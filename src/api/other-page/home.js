import {
  requestCenter
} from '@/libs/request'
/* 首页 接口 */

// 获取记录汇总数据
export const getreportbirecordReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/index/getreportbirecord',
    method: 'post',
    data
  })
}
// 获取记录TOP5
export const gettopfiveReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/index/getTopFive',
    method: 'post',
    data
  })
}
// 获取单个工作簿的折线图
export const gettopchartrecordReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/index/getTopChartRecord',
    method: 'post',
    data
  })
}