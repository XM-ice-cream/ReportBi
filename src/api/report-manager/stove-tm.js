import { requestCenter } from '@/libs/request'

// 获取炉温监控信息
export const getTMReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperaturedetailed/getlist',
    method: 'post',
    data
  })
}

// 获取产品
export const getProductListReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/getpagelist',
    method: 'post',
    data
  })
}

// 获取实时回焊炉温区温度
export const getpartitionReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/furnaceequipmentpartition/getpartition',
    method: 'post',
    data
  })
}

// 获取当前板子信息
export const currentboardinfoReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/currentboardinfo',
    method: 'post',
    data
  })
}

// 计算产品温度分析
export const calculateanalysisReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/calculateanalysis',
    method: 'post',
    data
  })
}

// 导出
export const exportProductReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/reportcenter/anonymous/v1/producttemperature/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

// 获取实时过板情况界面展示数据
export const interfaceDisplayReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/interfacedisplay',
    method: 'post',
    data
  })
}
// 更新回焊炉状态
export const modifyreFlowStatusReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/modifyreflowstatus',
    method: 'post',
    data
  })
}
// 获取设备参数数据
export const geteqparameterListReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/geteqparameterlist',
    method: 'post',
    data
  })
}

// 获取rgi数据
export const getrhiListReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/getrhilist',
    method: 'post',
    data
  })
}
// 产品温度日志删除
export const deleteReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/delete',
    method: 'delete',
    data
  })
}
// 获取未出炉子的产品
export const getNotOutReflowProductReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/getnotoutreflowproduct',
    method: 'post',
    data
  })
}






