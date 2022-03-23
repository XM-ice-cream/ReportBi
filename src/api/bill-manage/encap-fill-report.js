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

// OP50/70设备分组查询
export const getpagelistEqpReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/encapop50report/getencapfillbyeqp',
    method: 'post',
    data
  })
}

// Scrap明细查询
export const getpagelistScrapDetailReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/encapop50report/getencapfillscrapdetail',
    method: 'post',
    data
  })
}

// FILLDam良率查询
export const getpagelistDamRateReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/encapop50report/getencapfilldamrate',
    method: 'post',
    data
  })
}

// Dam明细查询
export const getpagelistDamDetailReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/encapop50report/getencapfilldamdetail',
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

// 获取FILL和DAM设备ID
export const getEncapFillDamEqpId = data => {
  return requestCenter({
    loading: true,
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/encapop50report/getencapfilldameqpid',
    method: 'post',
    //responseType: 'arraybuffer',
    data
  })
}

// 获取FILL和DAM设备ID
//export const getEncapFillDamEqpId = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/anonymous/v1/encapop50report/getencapfilldameqpid`

// 获取EQP 信息
export const eqpPageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/v1/dropdownlist/getfilldameqplist`