import {
    requestCenter
} from '@/libs/request'
/* 报废报表 接口 */

// 分页获取
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/scrapreport/getpagelist',
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
        url: '/api/reportcenter/anonymous/v1/scrapreport/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
  }