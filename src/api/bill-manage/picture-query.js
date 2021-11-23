import {
    requestCenter
} from '@/libs/request'
/* 图片查询 接口 */

// 分页获取
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/equipmentcenter/v1/ledpicuture/getpagelist',
        method: 'post',
        data
    })
}
// 导出
export const exportReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/equipmentcenter/v1/ledpicuture/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}