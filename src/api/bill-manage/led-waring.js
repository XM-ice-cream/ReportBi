import {
    requestCenter
} from '@/libs/request'
/* LED 来料预警看板 接口 */

// 分页获取LED预警Reel信息表
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/reel/getledwaringpagelist',
        method: 'post',
        data
    })
}

// 导出
export const exportReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/reel/getledwaringpagelistexport',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}