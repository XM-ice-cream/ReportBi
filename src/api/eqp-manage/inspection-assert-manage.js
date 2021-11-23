import { requestCenter } from '@/libs/request'
/* 点检/维护管理 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqpoption/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqpoption/modify',
    method: 'put',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpoption/getpagelist',
    method: 'post',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpoption/getentity',
    method: 'post',
    data
  })
}

// 获取点检/维护项目
export const getdropdownconditionReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpoption/getdropdowncondition',
    method: 'post',
    data
  })
}





