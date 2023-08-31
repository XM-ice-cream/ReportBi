import {
    requestCenter
  } from '@/libs/request'
  
    // 获取树状菜单
    export const getMenuTree = () => {
        return requestCenter({
            timeout: 0,
            baseUrl:  window.localStorage.getItem("reportDesignIp"),
            url: '/menubutton/getmenutree',
            method: 'post'
        })
      }
  // 查询
  export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/user/getRolePageList',
        method: 'post',
        data
    })
  }
  // 插入
  export const insertRoleReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/user/roleInsert',
        method: 'post',
        data
    })
  }
  // 删除
  export const deleteRoleReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/user/roleDelete',
        method: 'post',
        data
    })
  }
  // 修改
  export const modifyRoleReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/user/roleModify',
        method: 'post',
        data
    })
  }