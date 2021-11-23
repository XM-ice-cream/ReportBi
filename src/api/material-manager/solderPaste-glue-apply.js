import { requestCenter } from '@/libs/request'
/* 锡膏胶水申请 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/applysolderpasteglue/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/applysolderpasteglue/modify',
        method: 'put',
        data
    })
}

// 审核
export const auditReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/applysolderpasteglue/audit',
        method: 'put',
        data
    })
}

// 作废
export const deleteReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/applysolderpasteglue/delete',
        method: 'put',
        data
    })
}


// 查询单个
export const getentityReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/applysolderpasteglue/getentity',
        method: 'post',
        data
    })
}

//查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/applysolderpasteglue/getlist',
        method: 'post',
        data
    })
}

//分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/applysolderpasteglue/getpagelist',
        method: 'post',
        data
    })
}

//分页获取锡膏胶水申请明细表
export const getdetailpagelistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/applysolderpasteglue_detail/getpagelist',
        method: 'post',
        data
    })
}

// 导出
export const exportReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/applysolderpasteglue/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}

// 打印
export const getridprintinfoReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/applysolderpasteglue/getridprintinfo',
        method: 'post',
        data
    })
}







