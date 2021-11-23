import { requestCenter } from '@/libs/request'
/* 工治具信息 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/tooling/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/tooling/modify',
    method: 'put',
    data
  })
}

// 操作工治具信息
export const opearReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/tooling/opear',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/tooling/getlist',
    method: 'post',
    data
  })
}


// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/tooling/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const toolingInfoPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/tooling/getpagelist`

// 分页查询操作日志
export const getpagelistlogReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolinglog/getpagelist',
    method: 'post',
    data
  })
}


