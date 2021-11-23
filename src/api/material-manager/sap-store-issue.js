import { requestCenter } from '@/libs/request'
/* SAP工单发料 Api */

// 新增
export const usraddReq = data => {
  return requestCenter({
    url: '/api/materialcenter/anonymous/v1/sappush/usradd',
    method: 'post',
    data
  })
}

// 新增LED
export const usrledaddReq = data => {
  return requestCenter({
    url: '/api/materialcenter/anonymous/v1/sappush/usrledadd',
    method: 'post',
    data
  })
}

// 工单承接
export const usrexchangeReq = data => {
  return requestCenter({
    url: '/api/materialcenter/anonymous/v1/sappush/usrexchange',
    method: 'post',
    data
  })
}

// 退库
export const usrreturnReq = data => {
  return requestCenter({
    url: '/api/materialcenter/anonymous/v1/sappush/usrreturn',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/sapstoreissue/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/sapstoreissue/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/sapstoreissue/getpagelist',
    method: 'post',
    data
  })
}

// 分页查询日志
export const getpagelistlogReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/storeissuelog/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/sapstoreissue/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 下载模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/sapstoreissue/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入
export const sapStoreIssueUploadUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/sapstoreissue/upload`