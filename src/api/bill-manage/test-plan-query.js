import { requestCenter } from '@/libs/request'
/* TestPlan查询 接口 */

// 查询
export const getpagelistReq = data => {
  return requestCenter({
      timeout: 0,
      baseUrl: window.localStorage.getItem("reportip"),
      url: '/api/reportcenter/anonymous/v1/testplan/gettestplandata',
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
      url: '/api/reportcenter/anonymous/v1/testplan/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

// 查询TestPlanOMM数据
export const getpagelistDetailReq = data => {
  return requestCenter({
      timeout: 0,
      baseUrl: window.localStorage.getItem("reportip"),
      url: '/api/reportcenter/anonymous/v1/testplan/gettestplanommdata',
      method: 'post',
      data
  })
}