import {
    requestCenter
} from '@/libs/request'
/* 测试良率报表查询 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/testyield/gettestyield',
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
        url: '/api/reportcenter/anonymous/v1/testyield/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
// 查询机种下拉框
export const getModelListReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/testyield/getmodellist',
        method: 'post',
        data
    })
}
// 查询Config下拉框
export const getConfigListReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/testyield/getconfiglist',
        method: 'post',
        data
    })
}
// 查询站点下拉框
export const getProcessListReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/testyield/getprocesslist',
        method: 'post',
        data
    })
}