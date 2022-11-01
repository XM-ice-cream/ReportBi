import {
    requestCenter
} from '@/libs/request'
/*DB员工信息 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/DBAccountManagement/v1/DBUserInfo/getpagelist',
        method: 'post',
        data
    })
}
// 新增
export const addReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/DBAccountManagement/v1/DBUserInfo/add',
        method: 'post',
        data
    })
}
// 新增
export const modifyReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/DBAccountManagement/v1/DBUserInfo/modify',
        method: 'put',
        data
    })
}

// 批量导入Excel文件
export const uploadUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/DBAccountManagement/v1/DBUserInfo/upload`