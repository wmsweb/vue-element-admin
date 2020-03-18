import request from '@/utils/request'

// 查询机构列表
export function listInstitution(params) {
  return request({
    url: '/institution/list',
    method: 'get',
    params

  })
}

// 查询机构详情
export function getInstitutionDetail(institutionId) {
  return request({
    url: '/institution/getDetail',
    method: 'get',
    params: {
      id: institutionId
    }
  })
}

// 编辑机构
export function updateInstitution(data) {
  return request({
    url: '/institution/update',
    method: 'post',
    data
  })
}

// 添加机构
export function addInstitution(data) {
  return request({
    url: '/institution/add',
    method: 'post',
    data
  })
}

