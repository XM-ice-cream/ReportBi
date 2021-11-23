import { requestCenter } from '@/libs/request'
/* 入库 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/inwarehouse/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/inwarehouse/modify',
    method: 'put',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/inwarehouse/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/inwarehouse/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/inwarehouse/getpagelist',
    method: 'post',
    data
  })
}

// 分页查询入库日志
export const getLogPageListReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/inwarehouselog/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/inwarehouse/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 下载入库模板
export const downloadnormalReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/inwarehouse/downloadnormal',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
// 下载预入库模板
export const downloadprepareReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/inwarehouse/downloadprepare',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入入库
export const uploadUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/inwarehouse/uploadnormal`

//批量导入预入库
export const uploadUrl1 =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/inwarehouse/uploadprepare`


