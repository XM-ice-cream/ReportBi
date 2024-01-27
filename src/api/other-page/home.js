import {
  requestCenter
} from '@/libs/request'
/* 首页 接口 */

// 获取记录汇总数据
export const getreportbirecordReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/index/getreportbirecord',
    method: 'post',
    data
  })
}
// 获取记录TOP5
export const gettopfiveReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/index/getTopFive',
    method: 'post',
    data
  })
}
// 获取模型占比
export const getmodelrecordReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/index/getModelRecord',
    method: 'post',
    data
  })
}
// 获取收藏
export const getCollectReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/index/getusercollect',
    method: 'post',
    data
  })
}
// 获取趋势图
export const getTopChartRecordReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/index/gettopchartrecord',
    method: 'post',
    data
  })
}