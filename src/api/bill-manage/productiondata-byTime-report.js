import {
    requestCenter
} from '@/libs/request'
/* 生产数据( By时间区间) 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/productiondata/prodctiondatasummary',
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
        url: '/api/reportcenter/anonymous/v1/productiondata/summaryexport',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}