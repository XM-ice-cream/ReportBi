import {requestCenter} from '@/libs/request'
/* OQC Shipping查询 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/oqcreport/v1/oqcreport/getoqcshippinglist',
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
        url: '/api/reportcenter/oqcreport/v1/oqcreport/exportoqcshippinglist',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}