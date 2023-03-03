import {
  requestCenter
} from '@/libs/request'
/*auto-nxt-data 接口 */
// LOG
export const getlistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/repairrefdesapi/v1/repairrefdesapi/getnxtloglist',
    method: 'post',
    data
  })
}
// 新增
export const addReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/repairrefdesapi/v1/repairrefdesapi/autonxtdata',
    method: 'post',
    data
  })
}