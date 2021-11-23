import { requestCenter } from '@/libs/request'
/* 发货单管理 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/sappush/deliveryorder',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/deliveryorder/modify',
    method: 'put',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/deliveryorder/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getentitylistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/deliveryorder/getentitylist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/deliveryorder/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/deliveryorder/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}




