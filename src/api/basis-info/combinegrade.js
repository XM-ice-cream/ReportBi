import {
  requestCenter
} from '@/libs/request'
/* 组合制程等级 */
// 查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/combinegrade/getpagelist',
    method: 'post',
    data
  })
}
// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/combinegrade/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/combinegrade/modify',
    method: 'put',
    data
  })
}

// 新增明细
export const addDetailReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/combinegradedetail/add',
    method: 'post',
    data
  })
}

// 获取明细列表
export const getlistDetailReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/combinegradedetail/getlist',
    method: 'post',
    data
  })
}

