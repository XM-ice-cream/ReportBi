import { requestCenter } from '@/libs/request'
/* BobCat日志 接口 */

// 分页获取BobCat日志表
export const getpagelistReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/bobcatlog/getpagelist',
        method: 'post',
        data
    })
}

