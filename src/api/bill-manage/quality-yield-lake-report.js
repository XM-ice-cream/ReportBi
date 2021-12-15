import {
    requestCenter
} from '@/libs/request'
/* 淀山湖质量良率查询报表 接口 */

// 查询
export const getlistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/reportanalysis/v1/lakereport/gettackout',
        method: 'post',
        data
    })
}

// 查询
export const getinputsReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/reportanalysis/v1/lakereport/getinputs',
        method: 'post',
        data
    })
}

// 导出
export const exportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/reportanalysis/v1/lakereport/inputsexport',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}

// 导出 trackout
export const trackOutExportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/reportanalysis/v1/lakereport/trackoutexport',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}