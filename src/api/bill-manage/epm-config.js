import {requestCenter} from '@/libs/request'
/* EPM 上下限配置 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/epmconfig/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/epmconfig/update',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/epmconfig/get',
    method: 'get',
    params:data
  })
}

