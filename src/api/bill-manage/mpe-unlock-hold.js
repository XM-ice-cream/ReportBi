import {
  requestCenter
} from '@/libs/request'
/* MPE 解hold 接口 */

// 查询
export const modifyReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/epmhold/update',
    method: 'post',
    data
  })
}