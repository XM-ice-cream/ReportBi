import {requestCenter} from '@/libs/request'
/* 验刀数据查询 接口 */

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/checkknifedata/getcheckknifedata',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/checkknifedata/export',
    responseType: 'arraybuffer',
    method: 'post',
    data
  })
}
