import { requestCenter } from '@/libs/request'
/* 抽检计划表 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingcheckplan/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingcheckplan/modify',
        method: 'put',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/samplingcheckplan/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/samplingcheckplan/getpagelist',
        method: 'post',
        data
    })
}

// 获取工单信息表分页数据
export const workerPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/workflowcenter/v1/samplingcheckplan/getpagelist`

// 导出
export const exportReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/samplingcheckplan/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}

