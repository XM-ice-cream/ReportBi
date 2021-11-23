import { requestCenter } from '@/libs/request'
/* 测试管理 接口 */

// 修改ABB/UOP测试结果表
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/eqptestabb/modify',
        method: 'put',
        data
    })
}

// 分页获取ABB/UOP测试结果表
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/eqptestabb/getpagelist',
        method: 'post',
        data
    })
}

// 获取ABB_UOP测试结果明细表
export const getlistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/eqptestabbdetail/getlist',
        method: 'post',
        data
    })
}
