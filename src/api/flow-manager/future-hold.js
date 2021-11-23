import { requestCenter } from '@/libs/request'
/* 计划Hold 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/futurehold/add',
        method: 'post',
        data
    })
}

//删除
export const deleteReq = data => {
    return requestCenter({
      url: '/api/workflowcenter/v1/futurehold/remove',
      method: 'delete',
      data
    })
  }

// 分页获取烤箱记录表
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/futurehold/getpagelist',
        method: 'post',
        data
    })
}

// 下载模板
export const downloadReq = data => {
    return requestCenter({
        url: '/api/workflowcenter/v1/futurehold/download',
        method: 'get',
        responseType: 'arraybuffer',
        params: data
    })
}