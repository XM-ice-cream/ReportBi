import { requestCenter } from '@/libs/request'
/* rework锡膏上料 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/reworkloading/add',
    method: 'post',
    data
  })
}

// 删除
export const removeReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/reworkloading/remove',
    method: 'put',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/reworkloading/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getentitylistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/reworkloading/getentitylist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/reworkloading/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const reasonPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/reworkloading/getpagelist`



