import { requestCenter } from '@/libs/request'
/* 设备信息 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqpbase/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqpbase/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpbase/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpbase/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpbase/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const eqpPageListUrl = () => `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/eqpbase/getpagelist`

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqpbase/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

//eqptype导入
export const eqptypeUploadUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/eqpbase/uploadeqptype`

//eqp导入
export const eqpUploadUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/eqpbase/uploadeqp`

// 绑定ID
export const bindingbatchidReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqpbase/bindingbatchid',
    method: 'put',
    data
  })
}

//新增点检维护
export const eqpoptiontraceAddReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpoptiontrace/add',
    method: 'post',
    data
  })
}

// 确认点检维护日志表
export const eqpoptiontraceConfirmReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqpoptiontrace/confirm',
    method: 'put',
    data
  })
}

//分页获取点检维护日志表
export const eqpoptiontraceGetpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpoptiontrace/getpagelist',
    method: 'post',
    data
  })
}
//获取点检维护日志表
export const getpagelistdetailReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpoptiontrace/getpagelistdetail',
    method: 'post',
    data
  })
}

//新增设备对应子设备
export const eqpbasesubAddReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpbasesub/add',
    method: 'post',
    data
  })
}

//删除设备对应子设备
export const eqpbasesubDeleteReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpbasesub/delete',
    method: 'delete',
    data
  })
}

//新增设备对应子设备
export const eqpbasesubGetlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqpbasesub/getlist',
    method: 'post',
    data
  })
}



