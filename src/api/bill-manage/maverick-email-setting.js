import { requestCenter } from '@/libs/request'
/*  预警邮箱设定 接口 */

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/foxlog/v1/maverickemail/get',
        method: 'post',
        data
    })
}
// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        baseUrl:window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/foxlog/v1/maverickemail/add',
        method: 'post',
        data
    })
}
// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        baseUrl:window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/foxlog/v1/maverickemail/Update',
        method: 'post',
        data
    })
}
// 删除
export const deleteReq = data => {
    return requestCenter({
        loading: true,
        baseUrl:window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/foxlog/v1/maverickemail/Delete',
        method: 'post',
        data
    })
}