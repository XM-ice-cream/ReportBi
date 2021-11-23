import {requestCenter} from '@/libs/request'
/* OEE设备异常码 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/anonymous/v1/oee_eqperrorcode/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/anonymous/v1/oee_eqperrorcode/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/anonymous/v1/oee_eqperrorcode/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/anonymous/v1/oee_eqperrorcode/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/anonymous/v1/oee_eqperrorcode/getpagelist',
    method: 'post',
    data
  })
}
