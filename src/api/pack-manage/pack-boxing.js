import { requestCenter } from '@/libs/request'
/* 包装拆箱装箱 接口 */

// 拆箱
export const unboxingReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/packboxing/unboxing',
        method: 'post',
        data
    })
}

// 装箱
export const boxingReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/packboxing/boxing',
        method: 'post',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/packboxing/getlist',
        method: 'post',
        data
    })
}

// 查询单个
export const getentityReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/packboxing/getentity',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/packboxing/getpagelist',
        method: 'post',
        data
    })
}

// 获取拆箱源数据
export const getUnitInfoListReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/unitinfo/getlist',
        method: 'post',
        data
    })
}
