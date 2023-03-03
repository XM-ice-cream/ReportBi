import {
  requestCenter
} from '@/libs/request'
/* MaverickCustData 接口 */

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickcustdata/getmaverickcustpagelist',
    method: 'post',
    data
  })
}