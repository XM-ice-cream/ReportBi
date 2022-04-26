import {
    requestCenter
} from '@/libs/request'
/*模拟数据 接口 */
// 获取线体
export const getLineReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/v1/analogdata/getlinebysation',
        method: 'post',
        data
    })
}
// 获取设备ID
export const getEqpIdReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/v1/analogdata/geteqpidbyline',
        method: 'post',
        data
    })
}

// 添加过站记录
export const addUnitinfoTravel = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/v1/analogdata/addunitinfotravel',
        method: 'post',
        data
    })
}

// 添加Serin记录
export const addSerinData = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/v1/analogdata/addserindata',
        method: 'post',
        data
    })
}
// 添加KNS记录
export const addKnsData = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/v1/analogdata/addknsdata',
        method: 'post',
        data
    })
}
// 添加Tooling记录
export const addToolingData = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/v1/analogdata/addtoolingdata',
        method: 'post',
        data
    })
}