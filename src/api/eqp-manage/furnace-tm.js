import { requestCenter } from '@/libs/request'
/* 回焊炉设备 接口 */
// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/anonymous/v1/furnacemonitoring/getpagelist',
        method: 'post',
        data
    })
}
// 导出
export const exportReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/reportcenter/anonymous/v1/furnacemonitoring/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}


