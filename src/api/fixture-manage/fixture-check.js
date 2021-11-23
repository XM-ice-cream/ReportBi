import {requestCenter} from '@/libs/request'
/* 载治具点检 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/tftoolingcheck/add',
    method: 'post',
    data
  })
}

