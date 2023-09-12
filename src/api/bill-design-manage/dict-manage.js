import {
    requestCenter
  } from '@/libs/request'
  
  // 查询
  export const getTreeData = () => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/dataitemdetail/getDataDictTree',
        method: 'get'
    })
  }
  // 查询
  export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/dataitemdetail/getPagelist',
        method: 'post',
        data
    })
  }
  // 插入
  export const insertDictDetailReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/dataitemdetail/insert',
        method: 'post',
        data
    })
  }
  // 删除
  export const deleteDictDetailReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/dataitemdetail/delete',
        method: 'post',
        data
    })
  }
  // 修改
  export const modifyDictDetailReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/dataitemdetail/modify',
        method: 'post',
        data
    })
  }

  
  // 插入
  export const insertDictReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/dataitemdetail/insertTree',
        method: 'post',
        data
    })
  }
  
  // 修改
  export const modifyDictReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/dataitemdetail/modifyTree',
        method: 'post',
        data
    })
  }