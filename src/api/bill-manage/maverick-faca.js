import {
    requestCenter
} from '@/libs/request'
/* maverick-faca 接口 */


// 查询
export const getlistReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/maverick/getdetaildata',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/Maverick/UpdateStatu',
        method: 'post',
        data
    })
}

export const getMailDepartReq = data => {
    return requestCenter({
        loading: true,
        baseUrl: Window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/maverick/GetMailDepart',
        method: 'get',
        data
    })
}