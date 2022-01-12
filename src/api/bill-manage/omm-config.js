import {requestCenter} from '@/libs/request'
/* omm配置 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/anonymous/v1/generalconfig/addommconfig',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/anonymous/v1/generalconfig/modifyommconfig',
    method: 'put',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/generalconfig/getommconfigpagelist',
    method: 'post',
    data
  })
}

