import {
    requestCenter
} from '@/libs/request'
/* trackout 产能查询 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/machinecollect/v1/machinecollect/getcollectdata',
        method: 'post',
        data
    })
}
// 导出
export const exportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/machinecollect/v1/machinecollect/exportdata',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
// 获取制程信息--机台查询另维护的制程信息
export const processPageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/machinecollect/v1/machinecollect/getsteplist`