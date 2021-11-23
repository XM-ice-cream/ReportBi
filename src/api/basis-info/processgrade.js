import { requestCenter } from '@/libs/request'
/* 制程等级 */
// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/processgrade/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/processgrade/modify',
    method: 'put',
    data
  })
}

// 查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/processgrade/getpagelist',
    method: 'post',
    data
  })
}

// 分页查询
export const processgradePageListUrl = ()=>`${window.localStorage.getItem("configip")}/api/workflowcenter/v1/processgrade/getpagelist`

