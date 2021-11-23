import {
    requestCenter
} from '@/libs/request'
/* 数据报表 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/dataoffline/v1/dataoffline/getpagelist',
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
        url: '/api/reportcenter/dataoffline/v1/dataoffline/exportdata',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}