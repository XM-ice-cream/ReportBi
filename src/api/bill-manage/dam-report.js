import {
    requestCenter
} from '@/libs/request'
/* Dam点胶机 接口*/

// 获取列表
export const getlistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/damreport/v1/dam/gettabledata',
        baseUrl: window.localStorage.getItem("reportip"),
        method: 'post',
        loading: true,
        data
    })
}

// 获取柱状图数据
export const getBarDataReq = data => {
    return requestCenter({
        url: '/api/reportcenter/damreport/v1/dam/getbardata',
        baseUrl: window.localStorage.getItem("reportip"),
        method: 'post',
        loading: true,
        data
    })
}
// 获取饼图数据
export const getPieDataReq = data => {
    return requestCenter({
        url: '/api/reportcenter/damreport/v1/dam/getpiedata',
        baseUrl: window.localStorage.getItem("reportip"),
        method: 'post',
        loading: true,
        data
    })
}
// 导出
export const exportReq = data => {
    return requestCenter({
        loading: true,
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/damreport/v1/dam/exportdata',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
// 获取线体List
export const getlinelistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/damreport/v1/dam/getlinelist',
        baseUrl: window.localStorage.getItem("reportip"),
        method: 'post',
        loading: true,
        data
    })
}