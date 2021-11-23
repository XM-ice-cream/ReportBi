import { requestCenter } from '@/libs/request'
/* 备品管理 接口 */
// 库存金额分析
export const getAnalysisReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_storage/getstockmonthanalysisnew',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_storage/exportbpstockreportlist',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

