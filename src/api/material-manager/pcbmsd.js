import { requestCenter } from '@/libs/request'
/* pcbmsd 接口 */

// PCB MSD操作
export const opearReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/pcbmsd/pcbmsdoperate',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pcbmsd/getpagelist',
    method: 'post',
    data
  })
}

// 分页查询日志
export const getpagelistlogReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pcbmsdlog/getpagelist',
    method: 'post',
    data
  })
}
