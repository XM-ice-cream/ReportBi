import {
  requestCenter
} from '@/libs/request'
/* msd信息 接口 */

// 操作
export const opearReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/msdreel/opear',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/msdreel/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/msdreel/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/msdreel/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 进防潮箱
export const setridindryboxReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/msdreel/setridindrybox',
    method: 'post',
    data
  })
}

// 出防潮箱 【成功时候判断message里是否有code,有需要提示】
export const setridoutdryboxReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/msdreel/setridoutdrybox',
    method: 'post',
    data
  })
}

// 进烤箱
export const setridindryovenReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/msdreel/setridindryoven',
    method: 'post',
    data
  })
}

// 出烤箱
export const setridoutdryovenReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/msdreel/setridoutdryoven',
    method: 'post',
    data
  })
}

// 重包操作
export const setridrepackingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/msdreel/setridrepacking',
    method: 'post',
    data
  })
}

// 开封操作
export const setridopenReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/msdreel/setridopen',
    method: 'post',
    data
  })
}

// 日志查询
export const getloglistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/msdreellog/getlist',
    method: 'post',
    data
  })
}

// 日志分页查询
export const getlogpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/msdreellog/getpagelist',
    method: 'post',
    data
  })
}