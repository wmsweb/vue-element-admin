import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置,取消右上角旋转的环

const whiteList = ['/login', '/auth-redirect'] // 白名单

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 获取to页面的title
  document.title = getPageTitle(to.meta.title)

  // 获取token
  const hasToken = getToken()

  if (hasToken) { // 有token
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 获取当前用户的角色列表 hasRoles标记是否生成总的路由,静态路由+动态路由(过滤出有权限的)
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) { // 有角色直接放行
        next()
      } else { // 登录后第一次进来,还没有roles表明也没有生成总的有权限的路由,下面的逻辑是生成roles,过滤出所有有权限的路由,合并到总路由里面去
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加这个角色的路由(把所有动态路由里面有角色的路由过滤出来,添加到所有路由里面),生成左侧sidebar
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有token */

    if (whiteList.indexOf(to.path) !== -1) { // 在白名单
      // 在白名单,不需要权限,直接放行
      next()
    } else {
      // 不在白名单,重定向到login页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 进度条结束
  NProgress.done()
})
