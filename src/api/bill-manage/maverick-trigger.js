import {
  requestCenter
} from '@/libs/request'
/*Maverick Trigger */
// 查询
export const getPageListReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/mavericktrigger/gettriggerheadasync',
    method: 'post',
    data
  })
}
// 查询明细
export const getSummaryReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/mavericktrigger/gettriggerdetailasync',
    method: 'post',
    data
  })
}