import {requestCenter} from '@/libs/request'
/* OnWipSN查询 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/onwipsnquery/getprocesstobelunch',
        method: 'post',
        data
    })
}