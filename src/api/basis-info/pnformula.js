import {requestCenter} from '@/libs/request'
/* 料号配方 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/pnformula/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/pnformula/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pnformula/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pnformula/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const pnFormulaPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/pnformula/getpagelist`

