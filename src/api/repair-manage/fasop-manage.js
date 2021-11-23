import { requestCenter } from '@/libs/request'
/* FA操作手册管理 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/repaircenter/v1/fasop/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/repaircenter/v1/fasop/modify',
        method: 'put',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/repaircenter/v1/fasop/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/repaircenter/v1/fasop/getpagelist',
        method: 'post',
        data
    })
}

// 分页查询不良项目
export const projectPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/repaircenter/v1/defectCode/getpagelist`
