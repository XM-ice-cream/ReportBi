import {
    requestCenter
} from '@/libs/request'
/* 下拉框list 接口 */

// 机种
export const modelList = data => {
    return requestCenter({
        loading: true,
        url: '/api/subsidy/v1/model/getlist',
        method: 'post',
        data
    })
}

// 段别
export const lineTypeList = data => {
    return requestCenter({
        loading: true,
        url: '/api/subsidy/v1/linetype/getlist',
        method: 'post',
        data
    })
}
// 线别
export const lineList = data => {
    return requestCenter({
        loading: true,
        url: '/api/subsidy/v1/line/getentitylist',
        method: 'post',
        data
    })
}