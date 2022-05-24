import {
    requestCenter
} from '@/libs/request'
/* maverick-faca 接口 */


// 查询
export const getlistReq = data => {
    return requestCenter({
        baseUrl: "http://10.32.44.113:5700" || window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/maverick/getdetaildata?id=' + data.id,
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        baseUrl: "http://10.32.44.113:5700" || window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/Maverick/UpdateStatu',
        method: 'post',
        data
    })
}