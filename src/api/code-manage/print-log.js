import { requestCenter } from '@/libs/request'
/* 打印日志 接口 */

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/printedlog/getpagelist',
        method: 'post',
        data
    })
}
