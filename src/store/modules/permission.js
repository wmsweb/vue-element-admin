import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route, urlRoles) {
  const needRoles = urlRoles[route.path]
  if (needRoles && needRoles.length > 0) {
    return roles.some(role => needRoles.includes(role))
  } else {
    return true
  }

  // if (route.meta && route.meta.roles) {
  //   return roles.some(role => route.meta.roles.includes(role))
  // } else {
  //   return true
  // }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles, urlRoles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp, urlRoles)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, urlRoles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

// vuex mutations内定义的方法, 通过commit方法赋值
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

// vuex actions内定义的方法
// 通过 store.dispatch 赋值   await store.dispatch('permission/generateRoutes', roles)
const actions = {
  generateRoutes({ commit }, data) {
    const { roles, urlRoles } = data
    return new Promise(resolve => {
      let accessedRoutes // 定义一个可访问的 动态路由 对象
      if (roles.includes('admin')) { // 如果角色是admin, 拥有所有的动态路由
        accessedRoutes = asyncRoutes || []
      } else {
        debugger
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles, urlRoles) // 不是admin,需要过滤出可用路由,主要是未来生成左侧sidebar
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
