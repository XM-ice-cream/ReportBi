import { requestCenter } from '@/libs/request'
/* 工治具配件 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingfitting/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingfitting/modify',
    method: 'put',
    data
  })
}

// 操作
export const opearReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingfitting/opera',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfitting/getlist',
    method: 'post',
    data
  })
}


// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfitting/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const toolingFittingPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/toolingfitting/getpagelist`

// 分页查询日志
export const getpagelistlogReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfittinglog/getpagelist',
    method: 'post',
    data
  })
}


