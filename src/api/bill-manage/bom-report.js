import { requestCenter } from '@/libs/request'
/* Bom查询 接口 */

// 查询
export const getpagelistReq = data => {
  return requestCenter({
      timeout: 0,
      baseUrl: window.localStorage.getItem("reportip"),
      url: '/api/reportcenter/anonymous/v1/bomdata/getbomdatalz',
      method: 'post',
      data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
      loading: true,
      timeout: 0,
      baseUrl: window.localStorage.getItem("reportip"),
      url: '/api/reportcenter/anonymous/v1/bomdata/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}