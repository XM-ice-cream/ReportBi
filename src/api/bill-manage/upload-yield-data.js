import {
  requestCenter
} from '@/libs/request'
/*上传良率数据 接口 */

// 下载模板
export const downloadReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/virtualreport/v1/virtualyieldmgr/downyieldrptmodel',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
// 导入数据
export const importReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/virtualreport/v1/virtualyieldmgr/importyielddata',
    method: 'post',
    data
  })
}