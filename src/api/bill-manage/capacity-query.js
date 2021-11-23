import { requestCenter } from '@/libs/request'
/* 产能查询 接口 */

// 查询
export const getlistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/productiondata/getprodctiondatabyworkorder',
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
        url: '/api/reportcenter/anonymous/v1/productiondata/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}