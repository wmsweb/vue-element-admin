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

// 删除机构
export function deleteInstitution(id) {
  return request({
    url: `/institution/delete/${id}`,
    method: 'delete'
  })
}

// 停用机构
export function stopInstitution(id) {
  return request({
    url: `/institution/stop/${id}`,
    method: 'put'
  })
}

// 手动同步
export function syncInstitution(data) {
  return request({
    url: '/institution/sync',
    method: 'put',
    data
  })
}

