import { requestCenter } from '@/libs/request'
/* 制程QTime 接口 */

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/fixtruesetting/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/qtime/getpagelist',
        method: 'post',
        data
    })
}

// 分页获取制程QTime看板
export const getDashBoardReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/qtime/getqtimedashboard',
        method: 'post',
        data
    })
}

// 查询所有流程列表
export const getworklistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/wfrouteorder/getlist',
        method: 'post',
        data
    })
}

// 删除制程Qtime看板
export const deleteReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/qtime/remove',
        method: 'post',
        data
    })
}

// 分页获取QTime管控日志表
export const getQtimeLogReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/qtimecontrollog/getlist',
        method: 'post',
        data
    })
}
