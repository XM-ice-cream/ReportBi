import { requestCenter } from '@/libs/request'
/* 设备绑定扣数配方 接口 */

// 新增或编辑
export const addormodifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/eqpformula/addormodify',
    method: 'post',
    data
  })
}

// 删除
export const deleteReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/eqpformula/delete',
    method: 'put',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/eqpformula/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/eqpformula/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/eqpformula/getpagelist',
    method: 'post',
    data
  })
}

