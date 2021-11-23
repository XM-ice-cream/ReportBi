import { requestCenter } from '@/libs/request'
/* 锡膏胶水汇总 接口 */

// 解析厂商条码
export const resolvecodeReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/resolvecode',
    method: 'get',
    params: data
  })
}

// 解析纬创型号条码
export const resolvemodelReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/resolvemodel',
    method: 'get',
    params: data
  })
}

// 首次入库
export const firstwarehousingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/firstwarehousing',
    method: 'post',
    data
  })
}

// 二次入库
export const againwarehousingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/againwarehousing',
    method: 'post',
    data
  })
}

// 搅拌
export const stirReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/stir',
    method: 'post',
    data
  })
}

// 领用
export const receiveReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/receive',
    method: 'post',
    data
  })
}

// 用完
export const useupReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/useup',
    method: 'post',
    data
  })
}

// 报废
export const scrapReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/scrap',
    method: 'post',
    data
  })
}

// 清仓
export const clearanceReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/clearance',
    method: 'post',
    data
  })
}

// 楼层变更
export const floorchangeReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/floorchange',
    method: 'post',
    data
  })
}

// 上线
export const onlineReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/online',
    method: 'post',
    data
  })
}

// 下线
export const offlineReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/offline',
    method: 'post',
    data
  })
}

// 工单承接
export const setworkorderacceptanceReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel_solderpasteglue/setworkorderacceptance',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/reel_solderpasteglue/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/reel_solderpasteglue/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/materialcenter/v1/reel_solderpasteglue/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

// 获取日志分页
export const getlogpagelistReq = data => {
  return requestCenter({
      url: '/api/materialcenter/v1/reel_log/getpagelist',
      method: 'post',
      data
  })
}

