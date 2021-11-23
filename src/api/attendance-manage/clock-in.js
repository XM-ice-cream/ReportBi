import {requestCenter} from '@/libs/request'
/* 打卡记录 接口 */
// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/usercenter/v1/userattendancelog/getlist',
    method: 'post',
    data
  })
}
// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/usercenter/v1/userattendancelog/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/usercenter/v1/userattendancelog/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

