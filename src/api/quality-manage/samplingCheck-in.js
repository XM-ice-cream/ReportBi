import { requestCenter } from '@/libs/request'
/* 抽检录入表 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingcheck/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingcheck/modify',
        method: 'put',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/samplingcheck/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/samplingcheck/getpagelist',
        method: 'post',
        data
    })
}

// 导出
export const exportReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingcheck/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}

