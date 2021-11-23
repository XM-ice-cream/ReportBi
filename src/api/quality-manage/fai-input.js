import { requestCenter } from '@/libs/request'
/* FAI录入 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/faino/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/faino/modify',
        method: 'put',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/faino/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/faino/getpagelist',
        method: 'post',
        data
    })
}

// 批量导入
export const importReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/faino/import',
        method: 'post',
        data
    })
}

