import { requestCenter } from '@/libs/request'
/* 产品温度分析 接口 */
// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/v1/producttemperatureanalysis/add',
    method: 'post',
    data
  })
}
// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/v1/producttemperatureanalysis/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/producttemperatureanalysis/getlist',
    method: 'post',
    data
  })
}
// 查询
export const getanalysisReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperature/getanalysis',
    method: 'post',
    data
  })
}


// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/producttemperatureanalysis/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/reportcenter/v1/producttemperatureanalysis/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

// 下载防呆模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/usercenter/v1/carduser/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

// 批量导入
export const uploadUrl = ()=>`${window.localStorage.getItem("configip")}/api/reportcenter/anonymous/v1/producttemperature/upload`

