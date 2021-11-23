import { requestCenter } from '@/libs/request'
/* OP30看板 接口*/

// 获取列表
export const getlistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/unitinfotravelreport/getlist',
    method: 'post',
    loading: true,
    data
  })
}

// 获取机台的总数和不良数
export const getcoutbymachineReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/unitinfotravelreport/getcoutbymachine',
    method: 'post',
    loading: true,
    data
  })
}

// 获取分页信息(获取楼层线体等)
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/anonymous/v1/areafloorlineanonymous/getpagelist',
    method: 'post',
    loading: true,
    data
  })
}
