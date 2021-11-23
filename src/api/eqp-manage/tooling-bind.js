import {requestCenter} from '@/libs/request'
/* 工治具绑定 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/tffeeding/add',
    method: 'post',
    data
  })
}

// 删除
export const deleteReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/tffeeding/delete',
    method: 'delete',
    data
  })
}

// 查询
export const getdetailReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/tffeeding/getdetail',
    method: 'get',
    params: data
  })
}
