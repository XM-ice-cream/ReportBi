import { requestCenter} from '@/libs/request'
/* LED Expand 备料 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/expandloctionpreparation/add',
    method: 'post',
    data
  })
}

// 删除
export const deleteReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/expandloctionpreparation/delete',
    method: 'delete',
    data
  })
}

// 转移
export const transferReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/expandloctionpreparation/transfer',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/feeding/getentitylist',
    method: 'post',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/expandloctionpreparation/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/expandloctionpreparation/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const eqpPageListUrl =() => `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/feeding/getpagelist`
