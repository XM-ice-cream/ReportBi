import {
    requestCenter
} from '@/libs/request'
/* 质量良率查询报告 接口 */

// 查询
export const getlistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/ledwipbulletinboard/getledwipdata',
        method: 'post',
        data
    })
}



// 导出 trackout
export const exportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/ledwipbulletinboard/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}