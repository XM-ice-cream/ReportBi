import {requestCenter} from '@/libs/request'
/* 考勤班别 接口 */
// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/usercenter/v1/userattendanceclass/getlist',
    method: 'post',
    data
  })
}
// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/usercenter/v1/userattendanceclass/getpagelist',
    method: 'post',
    data
  })
}

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/usercenter/v1/userattendanceclass/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/usercenter/v1/userattendanceclass/modify',
    method: 'put',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/usercenter/v1/userattendanceclass/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

