import {
    requestCenter
} from '@/libs/request'
/*sn 压力测试 接口 */

// 获取标签数据
export const getpressuredata = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/machinecollect/v1/pressuredata/getpressuredata',
        method: 'post',
        data
    })
}