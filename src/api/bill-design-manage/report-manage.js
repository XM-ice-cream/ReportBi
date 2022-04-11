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
//Excel 插入
export const insertExcelReportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/reportexcel/insert',
        method: 'post',
        data
    })
}
//Excel 修改
export const modifyExcelReportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/reportexcel/modify',
        method: 'post',
        data
    })
}
//Excel 查询明细byreportcode
export const getExcelByReportcodeReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/reportexcel/detailbyreportcode',
        method: 'get',
        params: data
    })
}
//Excel 预览
export const getExcelPreviewReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/reportexcel/preview',
        method: 'post',
        data
    })
}
//图片上传
export const uploadImageReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/v1/ftpfile/uploadimage',
        method: 'post',
        data,
    })
}
//新增大屏
export const addScreenReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/reportdashboard/insert',
        method: 'post',
        data,
    })
}
//预览大屏
export const previewScreenReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/reportdashboard/preview',
        method: 'get',
        params: data,
    })
}
//获取大屏数据
export const getDataReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://10.191.21.54:8700' || window.localStorage.getItem("reportip"),
        url: '/api/autoreportcenter/anonymous/v1/reportdashboard/getdata',
        method: 'post',
        data,
    })
}