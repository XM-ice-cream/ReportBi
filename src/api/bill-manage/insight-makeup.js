import {
  requestCenter
} from '@/libs/request'
/* Insight状态 接口 */


// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    loading: true,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/insight/v1/insightmakeup/getpagelist',
    method: 'post',
    data
  })
}
// 单产品状态更新
export const updateStatusReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/insight/v1/insightmakeup/chanagestatusbyidasync',
    method: 'post',
    data
  })
}

//批量导入
export const uploadReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/reportcenter/insight/v1/insightmakeup/chanagestatusbybatchasync',
    method: 'post',
    data,
  })
}