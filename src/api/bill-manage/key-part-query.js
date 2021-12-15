import { requestCenter } from '@/libs/request'
/* 料件码查询 接口 */

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/keypartquery/getkeypartno',
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
        url: '/api/reportcenter/anonymous/v1/keypartquery/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}