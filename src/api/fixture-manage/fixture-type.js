import {requestCenter} from '@/libs/request'
/* 载治具类型 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingfixturetype/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingfixturetype/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfixturetype/getlist',
    method: 'post',
    data
  })
}


// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfixturetype/getpagelist',
    method: 'post',
    data
  })
}

// 分页查询
export const fixtrueTypePageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/toolingfixturetype/getpagelist`


