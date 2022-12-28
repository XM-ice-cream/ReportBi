import {
  requestCenter
} from '@/libs/request'
/* Sendahead Report 接口 */

// 查询
export const getpagelistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: "http://10.32.44.116:8700" || window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/sendahead/v1/sendaheadreport/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: "http://10.32.44.116:8700" || window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/sendahead/v1/sendaheadreport/export',
    responseType: 'arraybuffer',
    method: 'post',
    data
  })
}
// hold/unhold
export const holdReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: "http://10.32.44.116:8700" || window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/sendahead/v1/sendaheadreport/hold',
    method: 'post',
    data
  })
}
// 分组
export const groupReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: "http://10.32.44.116:8700" || window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/sendahead/v1/sendaheadreport/group',
    method: 'post',
    data
  })
}
// 删除
export const lclinkwoReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: "http://10.32.44.116:8700" || window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/sendahead/v1/sendaheadreport/lclinkwo',
    method: 'post',
    data
  })
}