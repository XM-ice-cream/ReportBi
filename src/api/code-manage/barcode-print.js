import { requestCenter } from '@/libs/request'
/* 条码打印维护 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/printinterfacerelation/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/printinterfacerelation/modify',
        method: 'put',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/printinterfacerelation/getlist',
        method: 'post',
        data
    })
}


// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/printinterfacerelation/getpagelist',
        method: 'post',
        data
    })
}

// 导出
export const exportReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/printinterfacerelation/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}

