import { requestCenter } from '@/libs/request'
/* 通用原因管理 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/maintainreason/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/maintainreason/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/maintainreason/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/maintainreason/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const reasonPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/maintainreason/getpagelist`



