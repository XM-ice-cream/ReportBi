import { requestCenter } from '@/libs/request'
/*过站错误代码 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/systemcenter/v1/errorcode/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/systemcenter/v1/errorcode/modify',
        method: 'put',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/systemcenter/v1/errorcode/getlist',
        method: 'post',
        data
    })
}

// 查询单个
export const getentityReq = data => {
    return requestCenter({
        url: '/api/systemcenter/v1/errorcode/getentity',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/systemcenter/v1/errorcode/getpagelist',
        method: 'post',
        data
    })
}




