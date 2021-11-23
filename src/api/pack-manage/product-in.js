import {requestCenter} from '@/libs/request'
/* 成品入库 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url:'/api/materialcenter/v1/saporderstorage/add',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url:'/api/materialcenter/v1/saporderstorage/getpagelist',
    method: 'post',
    data
  })
}

// 获取已入库数量
export const getstorequalityReq = data => {
  return requestCenter({
    loading: true,
    url:'/api/materialcenter/v1/saporderstorage/getstorequality',
    method: 'get',
    params: data,
  })
}

