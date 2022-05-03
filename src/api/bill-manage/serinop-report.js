import {
    requestCenter
} from '@/libs/request'
/* Serin部分站点查询 接口 */

// 查询OP15
export const getOp15Req = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/serinop/getserinop15',
        method: 'post',
        data
    })
}
// 查询OP20
export const getOp20Req = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/serinop/getserinop20',
        method: 'post',
        data
    })
}
// 查询OP25
export const getOp25Req = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/serinop/getserinop25',
        method: 'post',
        data
    })
}
// 查询OP30
export const getOp30Req = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/serinop/getserinop30',
        method: 'post',
        data
    })
}

// 导出OP15
export const exportOp15Req = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/serinop/serinop15export',
        responseType: 'arraybuffer',
        method: 'post',
        data
    })
}
// 导出OP20
export const exportOp20Req = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/serinop/serinop20export',
        responseType: 'arraybuffer',
        method: 'post',
        data
    })
}
// 导出OP25
export const exportOp25Req = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/serinop/serinop25export',
        responseType: 'arraybuffer',
        method: 'post',
        data
    })
}
// 导出OP30
export const exportOp30Req = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/serinop/serinop30export',
        responseType: 'arraybuffer',
        method: 'post',
        data
    })
}