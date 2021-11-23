import { requestCenter } from '@/libs/request'
/* 抽检结果录入 接口 */

// 新增
export const addmultipleReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingresult/addmultiple',
        method: 'post',
        data
    })
}

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingresult/add',
        method: 'post',
        data
    })
}

export const addforfaiReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingresult/addforfai',
        method: 'post',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/samplingresult/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/samplingresult/getpagelist',
        method: 'post',
        data
    })
}

// 通过条码获取配置项
export const getBarcodeConfigReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingconfig/getbarcodeconfig',
        method: 'post',
        data
    })
}

export const getFaiConfigReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingconfig/getfaiconfig',
        method: 'post',
        data
    })
}



