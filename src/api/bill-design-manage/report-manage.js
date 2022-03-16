import {
    requestCenter
} from '@/libs/request'

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/report/getpagelist',
        method: 'post',
        data
    })
}
// 插入
export const insertReportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/report/insert',
        method: 'post',
        data
    })
}
// 删除
export const deleteReportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/report/batchdelete',
        method: 'post',
        data
    })
}
// 修改
export const modifyReportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/report/modify',
        method: 'post',
        data
    })
}