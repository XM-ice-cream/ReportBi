import {
  requestCenter
} from '@/libs/request'

// 查询
export const getpagelistReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/report/getpagelist',
    method: 'post',
    data
  })
}
// 插入
export const insertReportReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/report/insert',
    method: 'post',
    data
  })
}
// 删除
export const deleteReportReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/report/batchdelete',
    method: 'post',
    data
  })
}
// 修改
export const modifyReportReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/report/modify',
    method: 'post',
    data
  })
}
//Excel 插入
export const insertExcelReportReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/reportexcel/insert',
    method: 'post',
    data
  })
}
//Excel 修改
export const modifyExcelReportReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/reportexcel/modify',
    method: 'post',
    data
  })
}
//Excel 查询明细byreportcode
export const getExcelByReportcodeReq = data => {
  return requestCenter({
    timeout: 1000 * 60 * 5, //最长等待五分钟
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/reportexcel/detailbyreportcode',
    method: 'get',
    params: data
  })
}
//Excel 预览
export const getExcelPreviewReq = data => {
  return requestCenter({
    timeout: 1000 * 60 * 60, //最长等待60分钟
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/reportexcel/preview',
    method: 'post',
    data
  })
}
//Excel 预览 总页数
export const getTotalPageReq = data => {
  return requestCenter({
    timeout: 1000 * 60 * 60, //最长等待60分钟
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/reportexcel/countPreview',
    method: 'post',
    data
  })
}
//Excel 设计 自定义函数 校验
export const checkFunctionReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/dynamiccode/syntaxrules',
    method: 'post',
    data
  })
}
//Excel 获取查询参数
export const getParamsReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/reportexcel/firstPreview',
    method: 'post',
    data
  })
}
//图片上传
export const uploadImageReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/ftpfile/uploadimage',
    method: 'post',
    data,
  })
}
//新增大屏
export const addScreenReq = data => {
  return requestCenter({
    timeout: 1000 * 60 * 5, //最长等待五分钟
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/reportdashboard/insert',
    method: 'post',
    data,
  })
}
//预览大屏
export const previewScreenReq = data => {
  return requestCenter({
    timeout: 1000 * 60 * 5, //最长等待五分钟
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/reportdashboard/preview',
    method: 'get',
    params: data,
  })
}
//获取大屏数据
export const getDataReq = data => {
  return requestCenter({
    timeout: 1000 * 60 * 5, //最长等待五分钟
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/reportdashboard/getdata',
    method: 'post',
    data,
  })
}
//获取数据字典
export const getDictReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/datadicts/getpagelist',
    method: 'post',
    data,
  })
}
//大屏默认背景图片
// ||${window.localStorage.getItem("reportDesignIp")}

export const baseImgUrl = `http://10.191.21.54:8700/api/autoreportcenter/v1/ftpfile/showimage/showimage/autoReport_317603302898536448.png`