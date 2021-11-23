import { requestCenter } from '@/libs/request'
/* GU储位管理 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/gu_storage/add',
    method: 'post',
    data
  })
}
// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/gu_storage/modify',
    method: 'put',
    data
  })
}
// 入库作业
export const setstorageinReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/gu_storage/setstoragein',
    method: 'post',
    data
  })
}

//出库作业
export const setstorageoutReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/gu_storage/setstorageout',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/gu_storage/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/gu_storage/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/gu_storage/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 储位日志分页查询
export const getStorageLogPageListReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/gu_storagelog/getpagelist',
    method: 'post',
    data
  })
}

