import {
    requestCenter
} from '@/libs/request'
/* Fa WIP查询 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/fawip/getfawipdata',
        method: 'post',
        data
    })
}

// 获取FA WIP统计数据
export const getfawipdistributionReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/fawip/getfawipdistribution',
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
        url: '/api/reportcenter/anonymous/v1/fawip/exportwipdata',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
// 导出FA WIP统计数据
export const exportfawipdistributionReq = data => {
    return requestCenter({
        loading: true,
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/fawip/exportfawipdistribution',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}