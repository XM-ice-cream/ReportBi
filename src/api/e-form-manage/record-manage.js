import { requestCenter } from '@/libs/request'
/* 记录管理 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/reportcenter/v1/ef_datarecord/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/reportcenter/v1/ef_datarecord/modify',
        method: 'put',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/ef_datarecord/getdatadetails',
        method: 'post',
        data
    })
}

// 分页查询
export const getPageListReq = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/ef_datarecord/getpagelist',
        method: 'post',
        data
    })
}

// 获取审批流程记录
export const getApprovalRecord = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/ef_datarecord/getapprovalrecord',
        method: 'post',
        data
    })
}

// 审核
export const auditReq = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/ef_datarecord/updatestatus',
        method: 'post',
        data
    })
}
