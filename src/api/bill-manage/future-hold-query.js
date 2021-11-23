import { requestCenter } from '@/libs/request'
/* 计划HOLD查询 接口 */

// 查询
export const getisfutureholdReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/futurehold/getisfuturehold',
        method: 'get',
        params: data
    })
}
