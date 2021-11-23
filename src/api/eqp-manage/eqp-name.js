import { requestCenter } from '@/libs/request'
/* 设备名称 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqpname/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqpname/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpname/getlisttree',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpname/getpagelist',
    method: 'post',
    data
  })
}

// 分页查询设备名称
export const eqpNamePageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/eqpname/getpagelist`

