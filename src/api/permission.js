import request from '@/utils/request'

export function permissionTree() {
  return request({
    url: '/permission/list',
    method: 'get'
  })
}

export function rolePermission(roleId) {
  return request({
    url: '/permission/role',
    method: 'get',
    params: { roleId }
  })
}

export function addRolePermission(data) {
  return request({
    url: '/permission/addRolePermission',
    method: 'post',
    data
  })
}

export function addPermission(data) {
  return request({
    url: '/permission/add',
    method: 'post',
    data
  })
}
