import {
  requestCenter
} from '@/libs/request'
// 工作簿设计
// 过滤所需要的字段对应的所有值
export const getselectvalueReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/bicalculator/selectvalue',
    method: 'post',
    data
  })
}

// 获取工作簿信息
export const getEchoReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/biworkbook/getEcho',
    method: 'post',
    data
  })
}
//  根据字段获取标记所有值
export const getMarksReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    timeout: 10 * 60 * 1000, //最长等待10分钟
    url: '/bicalculator/getmarkvalue',
    method: 'post',
    data
  })
}

//图片新增base64
export const addImageReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/ftpfile/insert',
    method: 'post',
    data
  })
}
//图片删除
export const deleteImageReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/ftpfile/delete',
    method: 'post',
    data
  })
}
//图片编辑
export const updateImageReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/v1/ftpfile/update',
    method: 'post',
    data
  })
}
//图片查询
export const getImageReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/v1/ftpfile/getlist',
    method: 'post',
    data
  })
}