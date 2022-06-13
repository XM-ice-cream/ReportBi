import {
    requestCenter
} from '@/libs/request'

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        baseUrl: "http://10.191.19.111:8700" || window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/datacollect/getpagelist',
        method: 'post',
        data
    })
}
// 查询没有
export const getPagelistNoCaseresult = data => {
    return requestCenter({
        baseUrl: "http://10.191.19.111:8700" || window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/datacollect/getPagelistNoCaseresult',
        method: 'post',
        data
    })
}
// 插入
export const insertDatacollectReq = data => {
    return requestCenter({
        baseUrl: "http://10.191.19.111:8700" || window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/datacollect/insert',
        method: 'post',
        data
    })
}
// 删除
export const deleteDatacollectReq = data => {
    return requestCenter({
        baseUrl: "http://10.191.19.111:8700" || window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/datacollect/delete',
        method: 'post',
        data
    })
}
// 修改
export const modifyDatacollectReq = data => {
    return requestCenter({
        baseUrl: "http://10.191.19.111:8700" || window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/datacollect/modify',
        method: 'post',
        data
    })
}
// 测试
export const testTransformSet = data => {
    return requestCenter({
        timeout: 1000 * 60,
        baseUrl: "http://10.191.19.111:8700" || window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/datacollect/testtransform',
        method: 'post',
        data
    })
}
// 查询全部数据源
export const getAllDatasourceReq = data => {
    return requestCenter({
        baseUrl: "http://10.191.19.111:8700" || window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/datacollect/queryalldatasource',
        method: 'post',
        data
    })
}
// 根据ID 查询明细
export const getDeatilByIdReq = data => {
    return requestCenter({
        baseUrl: "http://10.191.19.111:8700" || window.localStorage.getItem("reportDesignIp"),
        url: '/api/autoreportcenter/anonymous/v1/datacollect/getdetailbysetcode',
        method: 'post',
        data
    })
}