import {
    requestCenter
} from '@/libs/request'
/* 收值设定 接口 */

// 新增/编辑收值设定
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/cdseting/add',
        method: 'post',
        data
    })
}

// 分页获取收值设定,返回四个数据,按照ProcessId /Name ，RouteId /Name
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/cdseting/getpagelist',
        method: 'post',
        data
    })
}

// 获取收值设定  按照ProcessId ，RouteId查询
export const getentityReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/cdseting/getentitylist',
        method: 'post',
        data
    })
}