import {
    requestCenter
} from '@/libs/request'

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/datasource/getpagelist',
        method: 'post',
        data
    })
}
// 插入
export const insertDataSourceReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/datasource/insert',
        method: 'post',
        data
    })
}
// 删除
export const deleteDataSourceReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/datasource/delete',
        method: 'post',
        data
    })
}
// 修改
export const modifyDataSourceReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/datasource/modify',
        method: 'post',
        data
    })
}
// 测试
export const testConnection = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:  window.localStorage.getItem("reportDesignIp"),
        url: '/datasource/testconnection',
        method: 'post',
        data
    })
}