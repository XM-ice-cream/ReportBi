import { requestCenter } from '@/libs/request'
/* 离线品追踪 接口 */

//线下领用借用
export const receiveReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/repaircenter/v1/recipients/recipientsborrow',
        method: 'post',
        data
    })
}

//线下领用归还
export const givebackReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/repaircenter/v1/recipients/recipientsreturn',
        method: 'post',
        data
    })
}

//查询
export const getpagelistReq = data => {
    return requestCenter({
        loading: true,
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/offlinetracking/v1/offlinetracking/getpagelist',
        method: 'post',
        data
    })
}

// 导出
export const exportReq = data => {
    return requestCenter({
      loading: true,
        timeout: 0,
      baseUrl: window.localStorage.getItem("reportip"),
      url: '/api/reportcenter/offlinetracking/v1/offlinetracking/exportdata',
      method: 'post',
      responseType: 'arraybuffer',
      data
    })
  }
