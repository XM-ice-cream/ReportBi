import { requestCenter } from '@/libs/request'

// 获取树型数据
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqprelation/getlist',
    method: 'post',
    data
  })
}

// 获取分页列表
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqprelation/getpagelist',
    method: 'post',
    data
  })
}

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqprelation/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqprelation/modify',
    method: 'put',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqprelation/export',
    method: 'post',
    data
  })
}




