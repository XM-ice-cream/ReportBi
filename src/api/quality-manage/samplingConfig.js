import { requestCenter } from '@/libs/request'
/* 抽检配置 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingplan/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingplan/modify',
        method: 'put',
        data
    })
}

// 查询单个
export const getentityReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/samplingplan/getentity',
        method: 'post',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/samplingplan/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/samplingplan/getpagelist',
        method: 'post',
        data
    })
}


