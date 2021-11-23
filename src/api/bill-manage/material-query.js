import { requestCenter } from '@/libs/request'
/* 辅耗材查询 接口 */

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/materialdata/getmaterialdata',
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
        url: '/api/reportcenter/anonymous/v1/materialdata/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}