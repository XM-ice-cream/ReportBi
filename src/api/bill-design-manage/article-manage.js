import {
    requestCenter
  } from '@/libs/request'
  
  // 查询
  export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/biarticle/getPageList',
        method: 'post',
        data
    })
  }
  // 插入
  export const insertArticle = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/biarticle/Insert',
        method: 'post',
        data
    })
  }
  // 修改
  export const modifyArticle = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/biarticle/modify',
        method: 'post',
        data
    })
  }

  // 删除
  export const deleteArticle = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/biarticle/delete',
        method: 'post',
        data
    })
  }

  // 根据ID 查询明细
export const getentity = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/biarticle/getentity',
    method: 'post',
    data
  })
}