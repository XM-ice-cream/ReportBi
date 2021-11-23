import { requestCenter } from '@/libs/request'
/* QTime 接口 */

// 获取QTime表
export const getlistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/qtime/getlist',
    method: 'post',
    data
  })
}

// 获取QTime表-单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/qtime/getentity',
    method: 'post',
    data
  })
}

// 新增qtime
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/qtime/add',
    method: 'post',
    data
  })
}

// 修改qtime
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/qtime/modify',
    method: 'put',
    data
  })
}

//删除qtime
export const deleteReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/qtime/delete',
    method: 'post',
    data
  })
}

