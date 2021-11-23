import { requestCenter } from '@/libs/request'
/* 回焊炉程式 接口 */
// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/v1/producttemperatureprogram/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/v1/producttemperatureprogram/modify',
    method: 'put',
    data
  })
}

// 获取单个
export const getEntityReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/producttemperatureprogram/getentity',
    method: 'post',
    data
  })
}

// 获取单个无权限
export const getProgramentityReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/getprogramentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/producttemperatureprogram/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/producttemperatureprogram/getpagelist',
    method: 'post',
    data
  })
}

// 新增温区设定
export const temperatureRangeAddReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/furnaceequipmentpartition/add',
    method: 'post',
    data
  })
}
// 获取温区设定列表
export const temperatureRangeGetListReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/furnaceequipmentpartition/getlist',
    method: 'post',
    data
  })
}
// 导出
export const exportReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/reportcenter/v1/producttemperatureprogram/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

// 下载防呆模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/producttemperatureprogram/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入
export const uploadUrl =()=> `${window.localStorage.getItem("configip")}/api/reportcenter/v1/producttemperatureprogram/upload`

