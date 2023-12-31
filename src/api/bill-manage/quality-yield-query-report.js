import {
    requestCenter
} from '@/libs/request'
/* 质量良率查询报告 接口 */

// 查询
export const getlistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/reportanalysis/v1/reportanalysis/gettackout',
        method: 'post',
        data
    })
}

// 查询
export const getinputsReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/reportanalysis/v1/reportanalysis/getinputs',
        method: 'post',
        data
    })
}
// 看板查询LPA良率数据
export const getLpaYieldReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.19.72:8300/' || window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/lpayieldreport/v1/lpayieldreport/getlpayield',
        method: 'post',
        data
    })
}
// 看板查询LPA不良率数据
export const getLpaDefeactYieldReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.19.72:8300/' || window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/lpayieldreport/v1/lpayieldreport/getlpadefectyield',
        method: 'post',
        data
    })
}

// 导出
export const exportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/reportanalysis/v1/reportanalysis/inputsexport',
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
        url: '/api/reportcenter/reportanalysis/v1/reportanalysis/trackoutexport',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
// 获取config 信息
export const configPageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/reportanalysis/v1/reportanalysis/getconfiglist`
// 获取线体 信息
export const linePageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/v1/dropdownlist/getlinelist`