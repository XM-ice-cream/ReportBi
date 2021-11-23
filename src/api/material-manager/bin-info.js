import { requestCenter } from '@/libs/request'
/* Bin信息 接口 */

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bininfo/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bininfo/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
