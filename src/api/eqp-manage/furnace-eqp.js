import { requestCenter } from '@/libs/request'
/* 回焊炉设备 接口 */
// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/anonymous/v1/furnaceequipmentmapping/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/anonymous/v1/furnaceequipmentmapping/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/furnaceequipmentmapping/getlist',
    method: 'post',
    data
  })
}
// 匿名查询
export const getAnonymousListReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/furnaceequipmentmapping/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/furnaceequipmentmapping/getpagelist',
    method: 'post',
    data
  })
}

// 创建模型
export const createModelReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/anonymous/v1/producttemperature/calculatethedifference',
    method: 'post',
    data
  })
}
// 模拟温度
export const simulationTemperatureReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/anonymous/v1/producttemperature/add',
    method: 'post',
    data
  })
}


// 导出
export const exportReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/reportcenter/anonymous/v1/furnaceequipmentmapping/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

// 下载防呆模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入
export const uploadUrl =()=> `${window.localStorage.getItem("configip")}/api/reportcenter/anonymous/v1/producttemperature/upload`

// 新增温区设定
export const specificationAddReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/productreflowkeylogspec/add',
    method: 'post',
    data
  })
}
// 获取温区设定列表
export const specificationGetListReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/productreflowkeylogspec/getentity',
    method: 'post',
    data
  })
}
