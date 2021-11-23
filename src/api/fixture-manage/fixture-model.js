import { requestCenter } from '@/libs/request'
/* 载治具设计管理 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/model/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/model/modify',
    method: 'put',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/model/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/model/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/model/getpagelist',
    method: 'post',
    data
  })
}

// 下拉分页查询
export const modelPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/model/getpagelist`

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/model/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
// 下载
export const getattachmentReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/model/getattachment',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
// 上传
export const uploadattachment = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/model/uploadattachment',
    method: 'post',
    data
  })
}



