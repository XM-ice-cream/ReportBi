import { requestCenter } from '@/libs/request'
/* 备品报表 接口 */
// 取库存金额对比
export const getInventoryAmountComparisonReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/bp_storage/getstockmonthanalysis',
        method: 'post',
        data
    })
}
// 获取库存金额与目标库存金额差异分析
export const getGoalAnalysisReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/bp_storage/getgoalalysis',
        method: 'post',
        data
    })
}
// 获取领用金额分布分析
export const getUseMoneyAnalysisReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/bp_storage/getusemoneyalysis',
        method: 'post',
        data
    })
}



