import {requestCenter} from '@/libs/request'
/* OEE设备日志 接口 */


// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/anonymous/v1/oee_eqperrorcode/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/anonymous/v1/oee_eqperrorcode/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/oee_timelog/getpagelist',
    method: 'post',
    data
  })
}
