import {
    requestCenter
} from '@/libs/request'
/* 工单Wip报表 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/workorderwip/getworkorderwip',
        method: 'post',
        data
    })
}
// 导出
export const exportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/workorderwip/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
// WipSn 查询
export const getWipSnlistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/workorderwip/getwipsn',
        method: 'post',
        data
    })
}
//  WipSn 导出
export const exportWipSnReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/workorderwip/wipsnexport',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}