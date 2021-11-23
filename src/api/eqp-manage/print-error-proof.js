import { requestCenter} from '@/libs/request'
/* 印刷机防错 接口 */

// // 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/tfbinding/add',
    method: 'post',
    data
  })
}

// 删除
export const deleteReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/tfbinding/delete',
    method: 'delete',
    data
  })
}

// 获取详情
export const getdetailReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/printLocation/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/tfbinding/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/tfbinding/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const eqpBindPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/tfbinding/getpagelist`

// 历史记录分页查询
export const gethtpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/tfbindinght/getpagelist',
    method: 'post',
    data
  })
}

// 全部上料接口
export const addEqpReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/printLocation/add',
    method: 'post',
    data
  })
}

// 全部下料/重新上料接口
export const deleteEqpReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/printLocation/modify',
    method: 'put',
    data
  })
}
