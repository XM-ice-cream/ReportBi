import {
    requestCenter
} from '@/libs/request'
/*Insight 辅耗材接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/insight/v1/insightconsumable/getpagelist',
        method: 'post',
        data
    })
}
// 新增
export const addReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/insight/v1/insightconsumable/add',
        method: 'post',
        data
    })
}
// 新增
export const modifyReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/insight/v1/insightconsumable/modify',
        method: 'put',
        data
    })
}

// 批量导入Excel文件
export const attendanceInsightUploadUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/insight/v1/insightconsumable/upload`