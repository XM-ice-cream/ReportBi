import {
    requestCenter
} from '@/libs/request'
/*NXT比对配置 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/nxtjobbom/v1/nxtjobbom/getnxtjobbompagelist',
        method: 'post',
        data
    })
}
// 新增
export const addReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/nxtjobbom/v1/nxtjobbom/addnxtjobbom',
        method: 'post',
        data
    })
}
// 编辑
export const modifyReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/nxtjobbom/v1/nxtjobbom/modifynxtjobbom',
        method: 'put',
        data
    })
}
// 批量导入Excel文件
export const attendanceInsightUploadUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/nxtjobbom/v1/nxtjobbom/upload`