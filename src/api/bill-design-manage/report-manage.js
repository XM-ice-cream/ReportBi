import {
    requestCenter
} from '@/libs/request'

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/report/getpagelist',
        method: 'post',
        data
    })
}
// 插入
export const insertReportReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/report/insert',
        method: 'post',
        data
    })
}
// 删除
export const deleteReportReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/report/batchdelete',
        method: 'post',
        data
    })
}
// 修改
export const modifyReportReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/report/modify',
        method: 'post',
        data
    })
}
//Excel 插入
export const insertExcelReportReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/reportexcel/insert',
        method: 'post',
        data
    })
}
//Excel 修改
export const modifyExcelReportReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/reportexcel/modify',
        method: 'post',
        data
    })
}
//Excel 查询明细byreportcode
export const getExcelByReportcodeReq = data => {
    return requestCenter({
        timeout: 1000 * 60 * 5, //最长等待五分钟
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/reportexcel/detailbyreportcode',
        method: 'get',
        params: data
    })
}
//Excel 预览
export const getExcelPreviewReq = data => {
    return requestCenter({
        timeout: 1000 * 60 * 5, //最长等待五分钟
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/reportexcel/preview',
        method: 'post',
        data
    })
}
//Excel 获取查询参数
export const getParamsReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/reportexcel/firstPreview',
        method: 'post',
        data
    })
}
//图片上传
export const uploadImageReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/v1/ftpfile/uploadimage',
        method: 'post',
        data,
    })
}
//新增大屏
export const addScreenReq = data => {
    return requestCenter({
        timeout: 1000 * 60 * 5, //最长等待五分钟
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/reportdashboard/insert',
        method: 'post',
        data,
    })
}
//预览大屏
export const previewScreenReq = data => {
    return requestCenter({
        timeout: 1000 * 60 * 5, //最长等待五分钟
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/reportdashboard/preview',
        method: 'get',
        params: data,
    })
}
//获取大屏数据
export const getDataReq = data => {
    return requestCenter({
        timeout: 1000 * 60 * 5, //最长等待五分钟
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/reportdashboard/getdata',
        method: 'post',
        data,
    })
}
//获取数据字典
export const getDictReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/datadicts/getpagelist',
        method: 'post',
        data,
    })
}
// 导出
export const exportReq = data => {
    return requestCenter({
        timeout: 1000 * 60 * 5, //最长等待五分钟
        loading: true,
        baseUrl: window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/reportexcel/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
//大屏默认背景图片
// ||${window.localStorage.getItem("reportDesignIp")}

export const baseImgUrl = `http://10.191.19.111:8700/api/autoreportcenter/v1/ftpfile/showimage/showimage/autoReport_317603302898536448.png`