import request from '@/utils/request'

export function listAuthorization(params) {
  return request({
    url: '/authorization/list',
    method: 'get',
    params
  })
}

export function addAuthorization(data) {
  return request({
    url: '/authorization/add',
    method: 'post',
    data
  })
}

export function authorizationOrderDetails(params) {
  return request({
    url: '/authorization/orders',
    method: 'get',
    params
  })
}

// 设置提醒
export function handleRemind(data) {
  return request({
    url: '/authorization/remind',
    method: 'post',
    data
  })
}
