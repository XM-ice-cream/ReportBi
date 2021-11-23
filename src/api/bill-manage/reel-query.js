import { requestCenter } from '@/libs/request'
/* REEL查询 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/reel/getlist',
    method: 'post',
    data
  })
}

// 查询 - 单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/reel/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/reel/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reel/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

