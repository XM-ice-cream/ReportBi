import {
  requestCenter
} from '@/libs/request'

// 查询
export const getRoleList = () => {
  return requestCenter({
      timeout: 0,
      baseUrl:  window.localStorage.getItem("reportDesignIp"),
      url: '/user/getRoleList',
      method: 'get',
  })
}
// 查询
export const getpagelistReq = data => {
  return requestCenter({
      timeout: 0,
      baseUrl:  window.localStorage.getItem("reportDesignIp"),
      url: '/user/getpagelist',
      method: 'post',
      data
  })
}
// 插入
export const insertUserReq = data => {
  return requestCenter({
      timeout: 0,
      baseUrl:  window.localStorage.getItem("reportDesignIp"),
      url: '/user/insert',
      method: 'post',
      data
  })
}
// 删除
export const deleteUserReq = data => {
  return requestCenter({
      timeout: 0,
      baseUrl:  window.localStorage.getItem("reportDesignIp"),
      url: '/user/delete',
      method: 'post',
      data
  })
}
// 修改
export const modifyUserReq = data => {
  return requestCenter({
      timeout: 0,
      baseUrl:  window.localStorage.getItem("reportDesignIp"),
      url: '/user/modify',
      method: 'post',
      data
  })
}