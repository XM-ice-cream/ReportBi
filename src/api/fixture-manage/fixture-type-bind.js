import {requestCenter} from '@/libs/request'
/* 载治具类型绑定PCB料号 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingfixturetypepnmapping/add',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfixturetypepnmapping/getlist',
    method: 'post',
    data
  })
}

