import {
    requestCenter
  } from '@/libs/request'
  
  // 查询
  export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/MenuButton/getpagelist',
        method: 'post',
        data
    })
  }
  // 插入
  export const insertMenuButtonReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/MenuButton/insert',
        method: 'post',
        data
    })
  }
  // 删除
  export const deleteMenuButtonReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/MenuButton/delete',
        method: 'post',
        data
    })
  }
  // 修改
  export const modifyMenuButtonReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/MenuButton/modify',
        method: 'post',
        data
    })
  }