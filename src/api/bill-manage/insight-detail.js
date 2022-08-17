import {
    requestCenter
} from '@/libs/request'
/*Insight明细 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/insight/v1/insightdetail/getpagelist',
        method: 'post',
        data
    })
}
// 新增
export const addReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/insight/v1/insightdetail/add',
        method: 'post',
        data
    })
}
// 新增
export const modifyReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/insight/v1/insightdetail/modify',
        method: 'put',
        data
    })
}
// 批量导入Excel文件
export const attendanceInsightUploadUrl = () => `${window.localStorage.getItem("reportip")}/api/usercenter/v1/carduser/upload`