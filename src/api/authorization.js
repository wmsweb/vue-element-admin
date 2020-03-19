import request from '@/utils/request'

export function listAuthorization(params) {
  return request({
    url: '/authorization/list',
    method: 'get',
    params
  })
}

