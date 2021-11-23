import { requestCenter } from '@/libs/request'
/* 过站日志 接口 */

// 分页获取过站日志表
export const getpagelistReq = data => {
    return requestCenter({
        loading: true,
        timeout: 0,
        url: '/api/workflowcenter/v1/unitlog/getpagelist',
        method: 'post',
        data
    })
}

