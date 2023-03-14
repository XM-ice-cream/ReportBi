import {
  requestCenter
} from '@/libs/request'
/*  预警邮箱设定 接口 */

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickyieldinfo/getyieldinfo',
    method: 'post',
    data
  })
}
// 获取图表信息
export const getpageReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickyieldinfo/getyieldinfosbl',
    method: 'post',
    data
  })
}
// 导出
export const exportReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickyieldinfo/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
// 获取类型
export const getTypeReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickyieldinfo/gettype',
    method: 'get',
    params: data
  })
}
// 获取线体
export const getLineReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickyieldinfo/getline',
    method: 'get',
    params: data
  })
}
// 获取站点
export const getStationReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickyieldinfo/getstation',
    method: 'get',
    params: data
  })
}
// 获取机种
export const getModelReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickyieldinfo/getmodel',
    method: 'get',
    params: data
  })
}

// 获取Location
export const getLocationReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/maverickyieldinfo/getlocation',
    method: 'get',
    params: data
  })
}