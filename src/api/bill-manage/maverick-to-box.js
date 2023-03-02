import {
  requestCenter
} from '@/libs/request'
/* maverickToBox 接口 */

// 分页查询
export const getGoalSblReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/mavericktobox/getgoalsbl',
    method: 'post',
    data
  })
}
// 分页查询
export const getSylReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/mavericktobox/getsyl',
    method: 'post',
    data
  })
}
// 分页查询
export const getSblReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/mavericktobox/getsbl',
    method: 'post',
    data
  })
}
// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/mavericktobox/getall',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}


// 查询线体
export const getLineReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/mavericktobox/getline',
    method: 'get',
    params: data
  })
}
// 查询机种
export const getModelReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/mavericktobox/getmodel',
    method: 'get',
    params: data
  })
}