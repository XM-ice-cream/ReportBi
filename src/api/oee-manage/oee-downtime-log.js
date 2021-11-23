import {requestCenter} from '@/libs/request'
/* OEE停机记录 接口 */

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/oee_machineshutdownlog/getpagelist',
    method: 'post',
    data
  })
}

// 删除OEE停机记录
export const deleteReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/qtime/remove',
    method: 'post',
    data
  })
}
