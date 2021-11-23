import { requestCenter } from '@/libs/request'
/* 载治具绑定设置 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/fixtruesetting/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/fixtruesetting/modify',
        method: 'put',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/fixtruesetting/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/fixtruesetting/getpagelist',
        method: 'post',
        data
    })
}

// 查询所有流程列表
export const getworklistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/wfrouteorder/getlist',
        method: 'post',
        data
    })
}
