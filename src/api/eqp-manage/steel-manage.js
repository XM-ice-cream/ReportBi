import { requestCenter } from '@/libs/request'
/* 钢网 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/steelmesh/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/steelmesh/modify',
    method: 'put',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/steelmesh/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/steelmesh/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/steelmesh/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const steelPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/steelmesh/getpagelist`

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/steelmesh/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 下载防呆模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/steelmesh/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入
export const uploadUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/steelmesh/upload`

//获取钢网刮刀料号绑定表
export const getbindlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/steelmeshscraperpnmapping/getlist',
    method: 'post',
    data
  })
}

//新增钢网刮刀料号绑定表
export const addbindReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/steelmeshscraperpnmapping/add',
    method: 'post',
    data
  })
}

//保养
export const addMaintainReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/steelmeshmaintenance/add',
    method: 'post',
    data
  })
}

//保养记录分页查询
export const getmaintainpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/steelmeshmaintenance/getpagelist',
    method: 'post',
    data
  })
}





