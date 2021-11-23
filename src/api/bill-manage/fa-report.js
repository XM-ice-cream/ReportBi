import {
    requestCenter
} from '@/libs/request'
/* Fa查询 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/fa/getfadata',
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
        url: '/api/reportcenter/anonymous/v1/fa/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
//下拉分页查询 --不良现象
export const defectdescPageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/anonymous/v1/fa/getdesclist`
//下拉分页查询--不良原因
export const defectReasonPageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/anonymous/v1/fa/getreasonlist`