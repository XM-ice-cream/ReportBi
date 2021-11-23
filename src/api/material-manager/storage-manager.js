import { requestCenter } from '@/libs/request'
/* 储位管理 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_storage/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_storage/modify',
    method: 'put',
    data
  })
}
// 入库作业
export const setstorageinReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_storage/setstoragein',
    method: 'post',
    data
  })
}

//出库作业
export const setstorageoutReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_storage/setstorageout',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_storage/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_storage/getpagelist',
    method: 'post',
    data
  })
}

// 获取结算单价金额
export const getMonthUnitPriceReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_storage/getmonthunitprice',
    method: 'post',
    data
  })
}

// 维护结算单价金额
export const modifyMonthUnitPriceReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_storage/modifymonthunitprice',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_storage/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 下载防呆模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_storage/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入
export const uploadUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/bp_storage/upload`

// 下载防呆模板
export const sapDownloadReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_storage/sapoutdownload',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入
export const sapUploadUrl = ()=>`${window.localStorage.getItem("configip")}/api/materialcenter/v1/bp_storage/sapoutupload`

