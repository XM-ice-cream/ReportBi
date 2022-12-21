import {
  requestCenter
} from '@/libs/request'
/*淀山湖 Maverick info 接口 */
// 查询
export const getPageListReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickinfo/getmaverickinfo',
    method: 'post',
    data
  })
}
// 查询明细
export const getSummaryReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickinfo/getsummarydata',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickinfo/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}