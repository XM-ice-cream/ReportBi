import { requestCenter } from '@/libs/request'
/* 禁用料管理 接口 */

// 新增禁用料类型
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/partsblocktype/add',
        method: 'post',
        data
    })
}

// 修改禁用料类型
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/partsblocktype/modify',
        method: 'put',
        data
    })
}

// 查询禁用料类型
export const getlistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/partsblocktype/getlist',
        method: 'post',
        data
    })
}

// 分页查询禁用料类型
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/partsblocktype/getpagelist',
        method: 'post',
        data
    })
}

//新增禁用料条件
export const addPartsBlockReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/materialcenter/v1/partsblock/add',
        method: 'post',
        data
    })
}

//获取禁用料条件
export const getlistPartsBlockReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/partsblock/getlist',
        method: 'post',
        data
    })
}
