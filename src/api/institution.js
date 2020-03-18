import request from '@/utils/request'

// 查询机构列表
export function listInstitution(params) {
  return request({
    url: '/institution/list',
    method: 'get',
    params

  })
}

