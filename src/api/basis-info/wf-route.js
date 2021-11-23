import { requestCenter } from '@/libs/request'
/* 产线流程管理 接口 */

// 获取列表
export const getlistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/wfroute/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/wfroute/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const wfPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/workflowcenter/v1/wfroute/getpagelist`

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/wfroute/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/wfroute/modify',
    method: 'put',
    data
  })
}

// 复制
export const copyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/wfroute/copy',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/wfroute/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 获取工单下的所有抽检制程
export const getallprocessbyworkorderReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/wfroute/getallprocessbyworkorder',
    method: 'get',
    params: data
  })
}

// 获取所有制程
export const getallprocessReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/wfroute/getallprocess',
    method: 'get',
    params: data
  })
}

// 获取所有制程集合
export const getprocessListReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/process/getlist',
    method: 'post',
    data
  })
}

// qtime设置根据流程id获取制程
export const getprocessbyrouteidReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/wfroute/getprocessbyrouteid',
    method: 'get',
    params: data
  })
}

// 获取是否锁定制程
export const getProcessStateReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/wfroute/getprocessstate',
    method: 'post',
    data
  })
}

// 锁定制程
export const holdprocessReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/wfroute/holdprocess',
    method: 'post',
    data
  })
}

// 解锁制程
export const unholdProcessReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/wfroute/unholdprocess',
    method: 'post',
    data
  })
}

// 获取日志记录
export const getpagelistlogReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/wfroutelog/getpagelist',
    method: 'post',
    data
  })
}

