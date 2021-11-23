import {requestCenter} from '@/libs/request'
/* 包装称重设定 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/weighing/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/weighing/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/weighing/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/weighing/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/weighing/getpagelist',
    method: 'post',
    data
  })
}

