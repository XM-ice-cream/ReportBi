import {requestCenter} from '@/libs/request'
/* OEE日志关系 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/oeesetting/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/oeesetting/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/oeesetting/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/oeesetting/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/oeesetting/getpagelist',
    method: 'post',
    data
  })
}
