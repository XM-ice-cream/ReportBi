import {
  requestCenter
} from '@/libs/request'
/* mpe-faca 接口 */


// 查询
export const getlistReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/epmfaca/getfacadata',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/epmfaca/update',
    method: 'post',
    data
  })
}