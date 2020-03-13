import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }

]

export const asyncRoutes = [

  {
    path: '/user',
    component: Layout,
    redirect: '/user/create',
    name: 'user',
    meta: { title: '用户管理', icon: 'user', roles: ['admin'] },
    children: [
      {
        path: '/user/list',
        name: 'userList',
        component: () => import('@/views/user/List'),
        meta: { title: '用户列表', icon: 'list', roles: ['admin'] }
      },
      {
        path: '/user/create',
        name: 'userCreate',
        component: () => import('@/views/user/Create'),
        meta: { title: '添加用户', icon: 'edit', roles: ['admin'] }
      },
      {
        path: '/user/edit',
        name: 'userEdit',
        hidden: true,
        component: () => import('@/views/user/Edit'),
        // activeMenu: 用户指定高亮的路由, 因为自己没有菜单 hidden: true
        meta: { title: '编辑用户', icon: 'edit', roles: ['admin'], activeMenu: '/user/list' } // icon : [edit, menu, document, location, setting, list]
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
