import {requestCenter} from '@/libs/request'
/* 产线报表（半点） 接口 */

// 查询
export const getpagelistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/productline/v1/productlinereport/getlinedatahalf',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/productline/v1/productlinereport/exportlinedatahalf',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}