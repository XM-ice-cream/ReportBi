import { requestCenter} from '@/libs/request'
/* 料号信息 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/partmaster/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/partmaster/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/partmaster/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/partmaster/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const pnPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/partmaster/getpagelist`

// 查询单个信息
export const getentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/partmaster/getentity',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/partmaster/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 修改
export const modifymodelidReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/partmaster/modifymodelid',
    method: 'put',
    data
  })
}

// 变更记录分页查询
export const getPageListPartMasterLogReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/partmasterlog/getpagelist',
    method: 'post',
    data
  })
}

// 新增料号属性
export const pnextensionsAddReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pnextensions/add',
    method: 'post',
    data
  })
}

// 获取料号属性
export const getentitylistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pnextensions/getentitylist',
    method: 'post',
    data
  })
}

// Copy料号属性
export const pnextensionsCopyReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pnextensions/copy',
    method: 'post',
    data
  })
}
