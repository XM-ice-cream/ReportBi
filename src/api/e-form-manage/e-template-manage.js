import { requestCenter } from '@/libs/request'
/* 模板管理 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/reportcenter/v1/ef_template/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/reportcenter/v1/ef_template/modify',
        method: 'put',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/ef_template/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/ef_template/getpagelist',
        method: 'post',
        data
    })
}

// 编辑查询表格明细
export const getTableListReq = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/ef_templatedetails/getlist',
        method: 'post',
        data
    })
}
