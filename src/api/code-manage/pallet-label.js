import {requestCenter} from '@/libs/request'
/* 栈板标签 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopallet/add',
    method: 'post',
    data
  })
}

// 新增并返回
export const addwithgetReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopallet/addwithget',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/wopallet/getentitylist',
    method: 'post',
    data
  })
}

// 子集分页查询
export const getlablepagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/wopallet/getpageentitylist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopallet/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

//条码打印
export const printingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopallet/printing',
    method: 'post',
    data
  })
}

// 自定义打印
export const customprintReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/wopallet/customprint',
    method: 'post',
    responseType: 'arraybuffer',
    params: data
  })
}
// 分页查询工单下拉数据
export const getworkorderlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/WorkOrder/getamountwithworkorder',
    method: 'post',
    data
  })
}

// 分页列表查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/WorkOrder/getpagelistamountwithworkorder',
    method: 'post',
    data
  })
}








