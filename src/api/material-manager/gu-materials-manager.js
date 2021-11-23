import {
  requestCenter
} from '@/libs/request'
/* GU料号管理 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/gu_part/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/gu_part/modify',
    method: 'put',
    data
  })
}

// 查询
export const getentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/gu_part/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/gu_part/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/gu_part/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/gu_part/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}