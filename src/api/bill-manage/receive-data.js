import {
    requestCenter
} from '@/libs/request'
/* reveiceData查询 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://172.30.50.14:8080' || window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/receivedataquery/getreceivedata',
        method: 'post',
        data
    })
}
// 导出
export const exportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: 'http://172.30.50.14:8080' || window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/receivedataquery/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}