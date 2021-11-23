import {  requestCenter } from '@/libs/request'
/* 锡膏胶水 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/partmaster_solderpasteglue/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/partmaster_solderpasteglue/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/partmaster_solderpasteglue/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getlistentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/partmaster_solderpasteglue/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/partmaster_solderpasteglue/getpagelist',
    method: 'post',
    data
  })
}

// 分页查询
export const pnPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/partmaster_solderpasteglue/getpagelist`

// 根据工单获取Wo_BOM料号
export const getPageListByWobomReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/partmaster_solderpasteglue/getpagelistbywobom',
    method: 'post',
    data
  })
}
// 根据工单获取Wo_BOM料号
export const getPageListByWobomUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/partmaster_solderpasteglue/getpagelistbywobom`

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/partmaster_solderpasteglue/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 下载防呆模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/partmaster_solderpasteglue/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

