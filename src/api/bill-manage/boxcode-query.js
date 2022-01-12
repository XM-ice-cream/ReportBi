import {requestCenter} from '@/libs/request'
/* 箱号查询 接口 */

// 查询
export const getpagelistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/machinecollect/v1/lakeboxreport/getboxdata',
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
    url: '/api/reportcenter/machinecollect/v1/lakeboxreport/exportboxdata',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
