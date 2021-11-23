import { requestCenter } from '@/libs/request'
/* 特殊条码管理 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/specialcode/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/specialcode/modify',
        method: 'put',
        data
    })
}


// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/specialcode/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/specialcode/getpagelist',
        method: 'post',
        data
    })
}

// 批量导入
export const importReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/specialcode/import',
        method: 'post',
        data
    })
}

