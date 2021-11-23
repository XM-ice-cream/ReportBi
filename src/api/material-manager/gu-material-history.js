import {
  requestCenter
} from '@/libs/request'
/* GU历史 接口 */

// 获取GU_SN流向
export const getsnflowlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/gu_sn/getsnflowlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/gu_sn/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/gu_sn/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}