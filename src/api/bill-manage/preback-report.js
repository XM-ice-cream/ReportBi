import {
    requestCenter
} from '@/libs/request'
/* PreBack查询 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/preback/getpreback',
        method: 'post',
        data
    })
}

// 导出
export const exportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        loading: true,
        url: '/api/reportcenter/anonymous/v1/preback/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}