import { requestCenter } from '@/libs/request'
/* Serin查询 接口 */

// 查询
export const getpagelistReq = data => {
  return requestCenter({
      timeout: 0,
      baseUrl: window.localStorage.getItem("reportip"),
      url: '/api/reportcenter/anonymous/v1/serin/getserindata',
      method: 'post',
      data
  })
}

// 导出
export const exportReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/serin/export',
        responseType: 'arraybuffer',
        method: 'post',
        data
    })
}
