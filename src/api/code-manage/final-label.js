import {requestCenter} from '@/libs/request'
/* 连扳标签 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopanel/add',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/wopanel/getentitylist',
    method: 'post',
    data
  })
}

// 子集分页查询
export const getlablepagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/wopanel/getpageentitylist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopanel/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

//条码打印
export const printingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopanel/printing',
    method: 'post',
    data
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

// 分页查询工单下拉数据
export const getFinalInfoReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bininfo/getlist',
    method: 'post',
    data
  })
}





