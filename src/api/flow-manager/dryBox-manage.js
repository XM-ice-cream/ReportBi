import { requestCenter } from '@/libs/request'
/* 防潮箱管理 接口 */

// 新增防潮箱记录表
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/dryboxrecord/add',
    method: 'post',
    data
  })
}


// 分页获取防潮箱记录表
export const getpagelistReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/dryboxkanban/getpagelist',
    method: 'post',
    data
  })
}

// 查看防潮箱记录表
export const getDryBoxlistReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/dryboxrecord/getlist',
    method: 'post',
    data
  })
}


