import {
  requestCenter
} from '@/libs/request'
// 工作簿管理
// 查询
export const getpagelistReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/biworkbook/getpagelist',
    method: 'post',
    data
  })
}

// 插入
export const addReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/biworkbook/insert',
    method: 'post',
    data
  })
}
// 编辑
export const modifyReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/biworkbook/modify',
    method: 'post',
    data
  })
}
// 删除
export const deleteReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/biworkbook/delete',
    method: 'post',
    data
  })
}
//==============设计====================================
// 获取数据集对应的所有字段
export const getTabelColumnReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/biworkbookdata/gettablecolumn',
    method: 'post',
    data
  })
}
// 获取数据集对应的条件
export const getConditions = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/biworkbookdata/getconditions',
    method: 'get',
    params: data
  })
}
//新增自定义字段
export const addCustomerFieldReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/bicustomerfield/insert',
    method: 'post',
    data
  })
}
//编辑自定义字段
export const modifyCustomerFieldReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/bicustomerfield/modify',
    method: 'post',
    data
  })
}

//获取自定义字段
export const getCustomerFieldReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/bicustomerfield/getentity',
    method: 'post',
    data
  })
}
//删除自定义字段
export const deleteCustomerFieldReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/bicustomerfield/delete',
    method: 'post',
    data
  })
}
//校验自定义字段
export const checkCustomerFieldReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/bicustomerfield/syntaxRules',
    method: 'post',
    data
  })
}
//查询工作簿图表
export const getChartsInfoReq = data => {
  return requestCenter({
    timeout: 20 * 60 * 1000, //最长等待20分钟
    loading: true,
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/bicalculator/execute',
    method: 'post',
    data
  })
}

//获取用户收藏
export const getCollectReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/BIWorkbook/getCollectList',
    method: 'post',
    data
  })
}
//新增用户收藏
export const addCollectReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/BIWorkbook/insertCollect',
    method: 'post',
    data
  })
}
//删除用户收藏
export const deleteCollectReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/BIWorkbook/deleteCollect',
    method: 'post',
    data
  })
}