import {requestCenter} from '@/libs/request'
/* 报废入库 接口 */

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    timeout: 0,
    url: '/api/workflowcenter/v1/unitinfo/getpagescraplist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    timeout: 0,
    url: '/api/workflowcenter/v1/unitinfo/exportscrap',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}