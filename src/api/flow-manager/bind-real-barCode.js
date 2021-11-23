import { requestCenter } from '@/libs/request'
/*绑定真实条码 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/unitinfo/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/unitinfo/modify',
    method: 'put',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/unitinfo/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/unitinfo/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/unitinfo/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/unitinfo/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 手动绑定真实条码
export const manualbindrealbarcodeReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/trackmanual/manualbindrealbarcode',
    method: 'post',
    data
  })
}

// 真实条码检测
export const checkrealunitReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/trackmanual/checkrealunit',
    method: 'post',
    data
  })
}
