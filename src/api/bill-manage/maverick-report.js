import { requestCenter } from '@/libs/request'
/*  预警邮箱设定 接口 */

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl:"http://10.32.44.112:5700"|| window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/foxlog/v1/maverickyieldinfo/getyieldinfo',
        method: 'post',
        data
    })
}
// 获取线体
export const getLineReq = data => {
    return requestCenter({
        loading: true,
        baseUrl:"http://10.32.44.112:5700"||window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/foxlog/v1/maverickyieldinfo/getline',
        method: 'get',
        params:data
    })
}
// 获取站点
export const getStationReq = data => {
    return requestCenter({
        loading: true,
        baseUrl:window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/foxlog/v1/maverickyieldinfo/getstation',
        method: 'get',
        params:data
    })
}
// 获取机种
export const getModelReq = data => {
    return requestCenter({
        loading: true,
        baseUrl:window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/foxlog/v1/maverickyieldinfo/getmodel',
        method: 'get',
        params: data
    })
}