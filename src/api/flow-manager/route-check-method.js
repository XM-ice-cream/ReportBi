import { requestCenter } from '@/libs/request'
/* 流程勾选查询 接口 */

// 分页获取流程-制程勾选的动态方法
export const getPageListReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/wfroute/getdynamicmethod',
        method: 'post',
        data
    })
}

// 获取方法类型名称列表
export const getmethodTypeListReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/systemcenter/v1/detaitem/getentitylist',
        method: 'post',
        data
    })
}
