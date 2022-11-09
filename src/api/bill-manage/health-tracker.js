import {
    requestCenter
} from '@/libs/request'
/*HealthTrack接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/HealthTrack/get',
        method: 'post',
        data
    })
}
// 新增
export const addReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/HealthTrack/add',
        method: 'post',
        data
    })
}
// 获取信息
export const getInfoReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/HealthTrack/getHealthInfo',
        method: 'post',
        data
    })
}
