import {requestCenter} from '@/libs/request'
/* PanelEmapping信息修改 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/panelemapping/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/panelemapping/modify',
    method: 'put',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/panelemapping/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getentitylistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/panelemapping/getentitylist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/panelemapping/getpagelist',
    method: 'post',
    data
  })
}

// 分页查询历史记录
export const getpagelistlogReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/panelemappinglog/getpagelist',
    method: 'post',
    data
  })
}
