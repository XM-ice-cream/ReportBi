import {
  requestCenter
} from '@/libs/request'
/* 烘烤温度报表 接口 */

// 查询
export const getlistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/baketempraturereport/getbincodestats',
    method: 'post',
    data
  })
}