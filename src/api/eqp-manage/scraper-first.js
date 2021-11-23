import {requestCenter} from '@/libs/request'
/* 刮刀首件关系 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqppunchscraperfirstbind/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqppunchscraperfirstbind/modify',
    method: 'put',
    data
  })
}

// 查询单个
export const getlistentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqppunchscraperfirstbind/getlistentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqppunchscraperfirstbind/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqppunchscraperfirstbind/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const scraperFirstPageListUrl = () => `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/eqppunchscraperfirstbind/getpagelist`



