import { requestCenter } from '@/libs/request'
/* BinCode查询 接口 */

// 查询
export const getlistReq = data => {
  return requestCenter({
      timeout: 0,
      baseUrl: window.localStorage.getItem("reportip"),
      url: '/api/reportcenter/anonymous/v1/bincodereport/getbincodestats',
      method: 'post',
      data
  })
}
