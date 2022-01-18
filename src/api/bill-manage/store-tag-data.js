import { requestCenter } from '@/libs/request'
/* 标签数据查询 接口 */

// 查询
export const getpagelistReq = data => {
  return requestCenter({
      timeout: 0,
      baseUrl: window.localStorage.getItem("reportip"),
      url: '/api/reportcenter/machinecollect/v1/lakeiqcstoretag/getstoretag',
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
      url: '/api/reportcenter/machinecollect/v1/lakeiqcstoretag/exportstoretag',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}