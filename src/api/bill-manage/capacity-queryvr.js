import {
  requestCenter
} from '@/libs/request'
/* 产能良率查询 接口 */

// 查询
export const getlistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/productiondata/prodctiondata',
    method: 'post',
    data
  })
}

// 单元格点击明细表查询
export const getlistReqByType = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/productiondata/getprodctiontrackdetail',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/productiondata/export',
    responseType: 'arraybuffer',
    method: 'post',
    data
  })
}
// 导出明细
export const exportModelReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/productiondata/productiondataexport',
    responseType: 'arraybuffer',
    method: 'post',
    data
  })
}