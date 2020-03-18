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
        path: '/book/edit/:fileName',
        name: 'bookEdit',
        hidden: true,
        component: () => import('@/views/book/Edit'),
        // activeMenu: 用户指定高亮的路由, 因为自己没有菜单 hidden: true
        meta: { title: '编辑图书', icon: 'edit', roles: ['admin'], activeMenu: '/book/list' } // icon : [edit, menu, documentation, location, setting, list]
      }
    ]
  },
  // 机构管理
  {
    path: '/institution',
    component: Layout,
    redirect: '/institution/list',
    name: 'institution',
    meta: { title: '机构管理', icon: 'tree', roles: ['admin'] },
    children: [
      {
        path: '/institution/list',
        name: 'institutionList',
        component: () => import('@/views/institution/List'),
        meta: { title: '机构列表', icon: 'list', roles: ['admin'] }
      },
      {
        path: '/institution/add',
        name: 'addInstitution',
        component: () => import('@/views/institution/Add'),
        meta: { title: '添加机构', icon: 'edit', roles: ['admin'] }
      },
      {
        path: '/institution/edit/:institutionId',
        name: 'editInstitution',
        hidden: true,
        component: () => import('@/views/institution/Edit'),
        // activeMenu: 用户指定高亮的路由, 因为自己没有菜单 hidden: true
        meta: { title: '编辑机构', icon: 'edit', roles: ['admin'], activeMenu: '/institution/list' } // icon : [edit, menu, documentation, location, setting, list]
      }
    ]
  },
  // 用户管理
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'user',
    meta: { title: '用户管理', icon: 'peoples', roles: ['admin'] },
    children: [
      {
        path: '/user/list',
        name: 'userList',
        component: () => import('@/views/user/List'),
        meta: { title: '用户列表', icon: 'list', roles: ['admin'] }
      },
      {
        path: '/user/add',
        name: 'addUser',
        component: () => import('@/views/user/Add'),
        meta: { title: '添加用户', icon: 'user', roles: ['admin'] }
      },
      {
        path: '/user/edit/:userId',
        name: 'editUser',
        hidden: true,
        component: () => import('@/views/user/Edit'),
        // activeMenu: 用户指定高亮的路由, 因为自己没有菜单 hidden: true
        meta: { title: '编辑用户', icon: 'edit', roles: ['admin'], activeMenu: '/user/list' } // icon : [edit, menu, documentation, location, setting, list]
      }
    ]
  },
   // 授权管理
  {
    path: '/authorization',
    component: Layout,
    redirect: '/authorization/list',
    name: 'authorization',
    meta: { title: '授权管理', icon: 'tree-table', roles: ['admin'] },
    children: [
      {
        path: '/authorization/list',
        name: 'authorizationList',
        component: () => import('@/views/authorization/List'),
        meta: { title: '授权列表', icon: 'list', roles: ['admin'] }
      },
      {
        path: '/authorization/add',
        name: 'addAuthorization',
        component: () => import('@/views/authorization/Add'),
        meta: { title: '添加授权', icon: 'table', roles: ['admin'] }
      },
      {
        path: '/authorization/edit/:authorizationId',
        name: 'editAuthorization',
        hidden: true,
        component: () => import('@/views/authorization/Edit'),
        // activeMenu: 用户指定高亮的路由, 因为自己没有菜单 hidden: true
        meta: { title: '编辑授权', icon: 'edit', roles: ['admin'], activeMenu: '/authorization/list' } // icon : [edit, menu, documentation, location, setting, list]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
