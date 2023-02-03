import {
  requestCenter
} from '@/libs/request'
// 工作簿设计
// 过滤所需要的字段对应的所有值
export const getselectvalueReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/bicalculator/selectvalue',
    method: 'post',
    data
  })
}