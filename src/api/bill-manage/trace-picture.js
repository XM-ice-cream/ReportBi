import {
  requestCenter
} from '@/libs/request'
/* TrackPicture 接口 */

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    loading: true,
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/tracepicture/gettracepicture',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/tracepicture/tracepictureexport',
    responseType: 'arraybuffer',
    method: 'post',
    data
  })
}
// 导出图片
export const downloadpictureReq = data => {
  return requestCenter({
    timeout: 0,
    loading: true,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/tracepicture/download',
    responseType: 'blob',
    method: 'post',
    data
  })
}