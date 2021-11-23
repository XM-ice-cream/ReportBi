import {requestCenter} from '@/libs/request'
/* 产线报表 接口 */

// 查询
export const getpagelistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    // baseUrl: 'http://10.42.120.243:5700',
    url: '/api/reportcenter/productline/v1/productlinereport/getlinedata',
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
    // baseUrl: 'http://10.42.120.243:5700',
    url: '/api/reportcenter/productline/v1/productlinereport/exportlinedata',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}