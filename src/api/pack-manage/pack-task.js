import { requestCenter } from '@/libs/request'
/* 包装作业 接口 */

// 根据设备编码获取设备电子称重
export const getPackingWeightReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/packsetting/getpackingweight',
        method: 'get',
        params: data
    })
}

// 清除设备电子称重
export const clearPackingWeightReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/packsetting/clearpackingweight',
        method: 'get',
        params: data
    })
}