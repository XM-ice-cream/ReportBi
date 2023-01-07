import {
  requestCenter
} from '@/libs/request'

// 查询
export const getpagelistReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/bidataset/getpagelist',
    method: 'post',
    data
  })
}

// 插入
export const addReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/bidataset/insert',
    method: 'post',
    data
  })
}
// 编辑
export const modifyReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/bidataset/modify',
    method: 'post',
    data
  })
}
// 删除
export const deleteReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/bidataset/delete',
    method: 'post',
    data
  })
}
// 获取当前DB用户下的所有表
export const getTableListReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/bidataset/gettablelist',
    method: 'post',
    data
  })
}
// 获取当前数据源所有用户
export const getUsersReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/bidataset/getuserlist',
    method: 'post',
    data
  })
}
// 获取当前DB用户下的表的所有字段
export const getColumnListReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/bidataset/getcolumnlist',
    method: 'post',
    data
  })
}
// 获取所有数据集
export const getDataSetListReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/bidataset/getselectlist',
    method: 'post',
    data
  })
}