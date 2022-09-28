import {
    requestCenter
} from '@/libs/request'

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/autospcconfig/v1/autospcconfig/getpagelist',
        method: 'post',
        data
    })
}

// 插入
export const addReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/autospcconfig/v1/autospcconfig/add',
        method: 'post',
        data
    })
}
// 删除
export const deleteReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/autospcconfig/v1/autospcconfig/delete',
        method: 'put',
        data
    })
}
// 修改
export const modifyReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/autospcconfig/v1/autospcconfig/modify',
        method: 'put',
        data
    })
}