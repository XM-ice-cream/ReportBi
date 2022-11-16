import {
  requestCenter
} from '@/libs/request'
/* maverick-faca 接口 */


// 查询
export const getlistReq = data => {
  return requestCenter({
    timeout: 1000 * 60 * 10, //10分钟
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverick/getdetaildata',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverick/updatestatu',
    method: 'post',
    data
  })
}

export const getMailDepartReq = data => {
  return requestCenter({
    timeout: 1000 * 60 * 10, //十分钟
    loading: true,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverick/getmaildepart',
    method: 'get',
    params: data
  })
}