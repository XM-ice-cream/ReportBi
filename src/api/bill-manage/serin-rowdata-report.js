import {
    requestCenter
} from '@/libs/request'
/* Serin RowData 接口 */

// 导出
export const exportReq = data => {
    return requestCenter({
        loading: true,
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/serin/subdetailexport',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}