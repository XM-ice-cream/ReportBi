import { requestCenter } from '@/libs/request'
/* 备品线体管理 接口 */

// 新增线体
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/bp_department/addline',
        method: 'post',
        data
    })
}

// 修改线体
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/bp_department/modifyline',
        method: 'put',
        data
    })
}

// 获取部门下线体/线体下资产编号
export const getlistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/bp_department/getlineandassetlist',
        method: 'post',
        data
    })
}

// 分页获取部门下线体/线体下资产编号
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/bp_department/getlineandassetpagelist',
        method: 'post',
        data
    })
}

//新增资产编号
export const addAssetNumberReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/bp_department/addassetnumber',
        method: 'post',
        data
    })
}


