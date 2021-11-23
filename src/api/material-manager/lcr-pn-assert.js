import {  requestCenter } from '@/libs/request'
/* lcr料号维护 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/lcrpn/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/lcrpn/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/lcrpn/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getlistentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/lcrpn/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/lcrpn/getpagelist',
    method: 'post',
    data
  })
}

// 分页查询
export const lcrPnPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/lcrpn/getpagelist`

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/lcrpn/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 下载模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/lcrpn/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}


// 导入
export const uploadReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/lcrpn/upload',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
// 批量导入
export const lcrPnAssertUploadUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/lcrpn/upload`

// 测试分页查询
export const gettestqueryReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/lcrpn/gettestquery',
    method: 'post',
    data
  })
}

// 导出测试表
export const exporttestqueryReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/lcrpn/exporttestquery',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
