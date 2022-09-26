import {
    requestCenter
} from '@/libs/request'
/* ASM数据处理 接口 */

// 添加ASM数据信息
export const addReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/asmgeneratedata/add',
        method: 'get',
        params: data
    })
}