import { requestCenter } from '@/libs/request'
/* 质量核料 */

// 获取线体
export const getlinenamelistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/anonymous/v1/quality/getlinenamelist',
        method: 'post',
        loading: true,
        data
    })
}

// 获取质量核料
export const getlistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/anonymous/v1/quality/getlist',
        method: 'post',
        loading: true,
        data
    })
}

// 获取质量核料详情
export const getdetaillistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/anonymous/v1/quality/getdetaillist',
        method: 'post',
        loading: true,
        data
    })
}
// 获取质量核料历史
export const getloglistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/anonymous/v1/quality/getlistold',
        method: 'post',
        loading: true,
        data
    })
}







