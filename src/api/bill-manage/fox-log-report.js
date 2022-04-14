import {
    requestCenter
} from '@/libs/request'
/* FoxLog查询 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/foxlog/v1/foxdata/getfoxdata',
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
        url: '/api/reportcenter/foxlog/v1/foxdata/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}