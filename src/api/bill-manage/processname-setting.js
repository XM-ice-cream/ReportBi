import {
  requestCenter
} from '@/libs/request'
/* 制程设定 */

// 查询
export const getlistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/analyticalprocess/get',
    method: 'get',
    params: data
  })
}
// 新增
export const addReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/analyticalprocess/add',
    method: 'post',
    data
  })
}
//编辑
export const modifyReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/analyticalprocess/update',
    method: 'post',
    data
  })
}