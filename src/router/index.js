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
    path: '/book',
    component: Layout,
    redirect: '/book/create',
    name: 'book',
    meta: { title: '图书管理', icon: 'documentation', roles: ['admin'] },
    children: [
      {
        path: '/book/list',
        name: 'bookList',
        component: () => import('@/views/book/List'),
        meta: { title: '图书列表', icon: 'list', roles: ['admin'] }
      },
      {
        path: '/book/create',
        name: 'bookCreate',
        component: () => import('@/views/book/Create'),
        meta: { title: '添加图书', icon: 'edit', roles: ['admin'] }
      },
      {
        path: '/book/edit',
        name: 'bookEdit',
        hidden: true,
        component: () => import('@/views/book/Edit'),
        // activeMenu: 用户指定高亮的路由, 因为自己没有菜单 hidden: true
        meta: { title: '编辑图书', icon: 'edit', roles: ['admin'], activeMenu: '/book/list' } // icon : [edit, menu, documentation, location, setting, list]
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
