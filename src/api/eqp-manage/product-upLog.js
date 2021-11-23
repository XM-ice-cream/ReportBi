import { requestCenter } from '@/libs/request'
/* 产品上抛记录 接口 */

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/reportcenter/v1/productreflowkeylog/modify',
        method: 'put',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/productreflowkeylog/getpagelist',
        method: 'post',
        data
    })
}

// 获取校验炉子关键参数超标参数
export const checkreflowkeyReq = data => {
    return requestCenter({
        url: '/api/reportcenter/anonymous/v1/producttemperature/checkreflowkey',
        method: 'post',
        data
    })
}

// 重置上抛
export const tossUpResetReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/reportcenter/anonymous/v1/producttemperature/updateproductreflowkeylogstate',
        method: 'post',
        data
    })
}


// 获取上抛数据
export const checkFlowkeyReq = data => {
    return requestCenter({
        url: '/api/reportcenter/anonymous/v1/producttemperature/getproductreflowkeyloginput',
        method: 'post',
        data
    })
}
