import {
  requestCenter
} from '@/libs/request'
/*nxt sn信息补录 接口 */
// LOG
export const getlistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/v1/REPAIR_REFDES_API/GetNxtLogList',
    method: 'post',
    data
  })
}
// 新增
export const addReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/v1/REPAIR_REFDES_API/AutoNxtData',
    method: 'post',
    data
  })
}