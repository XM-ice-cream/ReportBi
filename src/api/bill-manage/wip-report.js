import {
    requestCenter
} from '@/libs/request'
/* WIP报表查询 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/wipreport/getwipdata',
        method: 'post',
        data
    })
}
// 明细查询
export const getpagelistDetailReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/wipreport/getwipdetaildata',
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
        url: '/api/reportcenter/anonymous/v1/wipreport/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}