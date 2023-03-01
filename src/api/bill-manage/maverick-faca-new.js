import {
  requestCenter
} from '@/libs/request'
/* maverick-faca 新版 接口 */


// 查询
export const getlistReq = data => {
  return requestCenter({
    loading: true,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverick/getdetaillist',
    method: 'post',
    data
  })
}

// 回复操作
export const sendCommentReq = data => {
  return requestCenter({
    loading: true,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverick/SendComment',
    method: 'post',
    data
  })
}
// 显示信息
export const detailModelReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverick/getdetailmodel',
    method: 'post',
    data
  })
}
// 邮件群组信息
export const getMailDepartReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverick/getmaildepartlist',
    method: 'get',
    data
  })
}