import { requestCenter } from '@/libs/request'
/* PN发料 接口 */

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pnissue/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getlistentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pnissue/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pnissue/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/materialcenter/v1/pnissue/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

