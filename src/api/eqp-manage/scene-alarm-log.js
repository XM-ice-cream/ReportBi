import {
    requestCenter
} from '@/libs/request'
/* 现场报警日志 接口 */
// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/reportcenter/anonymous/v1/scenealarmlog/modify',
        method: 'put',
        data
    })
}
// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/reportcenter/anonymous/v1/scenealarmlog/add',
        method: 'post',
        data
    })
}
// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/anonymous/v1/scenealarmlog/getpagelist',
        method: 'post',
        data
    })
}

// 导出
export const exportReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/reportcenter/anonymous/v1/scenealarmlog/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
//获取指定查询参数列表
export const getParameterListReq = data => {
    return requestCenter({
        url: '/api/equipmentcenter/anonymous/v1/intelligentalarmlog/getintelligentalarmparameterlist',
        method: 'post',
        data
    })
}