import {
  requestCenter
} from '@/libs/request'

// 查询
export const getpagelistReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/datacollect/getpagelist',
    method: 'post',
    data
  })
}
// 查询没有
export const getPagelistNoCaseresult = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/datacollect/getPagelistNoCaseresult',
    method: 'post',
    data
  })
}
// 插入
export const insertDatacollectReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/datacollect/insert',
    method: 'post',
    data
  })
}
// 删除
export const deleteDatacollectReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/datacollect/delete',
    method: 'post',
    data
  })
}
// 修改
export const modifyDatacollectReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/datacollect/modify',
    method: 'post',
    data
  })
}
// 测试
export const testTransformSet = data => {
  return requestCenter({
    timeout: 1000 * 60 * 60, //最长等待60分钟
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/datacollect/testtransform',
    method: 'post',
    data
  })
}
// 查询全部数据源
export const getAllDatasourceReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/datacollect/queryalldatasource',
    method: 'post',
    data
  })
}
// 根据ID 查询明细
export const getDeatilByIdReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/datacollect/getdetailbysetcode',
    method: 'post',
    data
  })
}
// 获取数据集信息表分页数据
export const setCodePageListUrl = () => `${window.localStorage.getItem("reportDesignIp")}/datacollect/getCodeList`
//获取对应数据集的第一个字段的值
export const getValueBySetcodePageListUrl = () => `${window.localStorage.getItem("reportDesignIp")}/datacollect/getFirstValues`