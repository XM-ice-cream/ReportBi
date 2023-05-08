import {
  requestCenter
} from '@/libs/request'
/* 测试良率报表查询 接口 */

// 查询
export const getpagelistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/testyield/gettestyield',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/testyield/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
// 机种列表 分页查询
export const modelPageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/anonymous/v1/testyield/getmodellist`
// config 分页查询
export const configPageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/anonymous/v1/testyield/getconfiglist`
// 站点 分页查询
export const processPageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/anonymous/v1/testyield/getprocesslist`
// projectVersion 分页查询
export const projectVersionPageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/anonymous/v1/testyield/getprojectversionlist`
// buildType 分页查询
export const buildTypePageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/anonymous/v1/testyield/getbuildtypelist`

// workOrder 分页查询
export const workorderPageListUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/anonymous/v1/testyield/getwolist`