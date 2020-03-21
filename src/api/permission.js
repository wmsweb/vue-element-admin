import request from '@/utils/request'

export function permissionTree() {
  return request({
    url: '/permission/list',
    method: 'get'
  })
}

