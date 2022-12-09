import {
  requestCenter
} from '@/libs/request'
// 无纸化表单
// 查询分页
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/ef_complexformsdata/getpagelist',
    method: 'post',
    data
  })
}
// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/ef_complexformsdata/getlist',
    method: 'post',
    data
  })
}

// 新增
export const addReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/ef_complexformsdata/add',
    method: 'post',
    data
  })
}
// 编辑
export const modifyReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/ef_complexformsdata/modify',
    method: 'put',
    data
  })
}