import { requestCenter } from '@/libs/request'
/* 烤箱管理 接口 */

// 新增烤箱记录表
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/ovenboxrecord/add',
        method: 'post',
        data
    })
}


// 分页获取烤箱记录表
export const getpagelistReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/ovenboxkanban/getpagelist',
        method: 'post',
        data
    })
}

//获取烤箱设备及超时设置信息
export const geteqpqtimeReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/wfroute/geteqpqtime',
        method: 'get',
        params: data
    })
}

// 查看烤箱记录表
export const getOvenBoxlistReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/ovenboxrecord/getlist',
        method: 'post',
        data
    })
}
