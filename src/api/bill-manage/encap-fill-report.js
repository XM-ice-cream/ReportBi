import {requestCenter} from '@/libs/request'
/* EnCapFillReport报表 接口 */

// 查询
export const getpagelistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/encapop50report/getencapfillreport',
    method: 'post',
    data
  })
}

// 线体导出
export const byLineExportReq = data => {
  return requestCenter({
    loading: true,
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/encapop50report/encapfillexportbyline',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 设备导出
export const byEqpExportReq = data => {
  return requestCenter({
    loading: true,
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/encapop50report/encapfillexportbyeqp',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 良率导出
export const byDefectExportReq = data => {
  return requestCenter({
    loading: true,
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/encapop50report/encapfillexportbydefect',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}