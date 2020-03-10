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
        path: '/user/create',
        name: 'userCreate',
        component: () => import('@/views/user/create'),
        meta: { title: '添加用户', icon: 'edit', roles: ['admin'] } // icon : [edit, menu, document, location, setting]
      },
      {
        path: '/user/create',
        name: 'userCreate',
        component: () => import('@/views/user/create'),
        meta: { title: '添加用户', icon: 'edit', roles: ['admin'] } // icon : [edit, menu, document, location, setting]
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
