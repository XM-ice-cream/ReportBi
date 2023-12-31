import {
  requestCenter
} from '@/libs/request'
// 无纸化模板
// 查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/ef_complexforms/getpagelist',
    method: 'post',
    data
  })
}
// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/ef_complexforms/getlist',
    method: 'post',
    data
  })
}
// 新增
export const addReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/ef_complexforms/add',
    method: 'post',
    data
  })
}
// 编辑
export const modifyReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/ef_complexforms/modify',
    method: 'put',
    data
  })
}