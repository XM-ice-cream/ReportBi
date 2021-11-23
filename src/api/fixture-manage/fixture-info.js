import {requestCenter} from '@/libs/request'
/* 载治具信息 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingfixtureinfo/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingfixtureinfo/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfixtureinfo/getlist',
    method: 'post',
    data
  })
}

// 查询
export const getlistbybarcodeReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfixtureinfo/getlistbybarcode',
    method: 'post',
    data
  })
}


// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfixtureinfo/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingfixtureinfo/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 下载预入库模板
export const downloadTemplateReq = data => {
  return requestCenter({
    url: '/api/systemcenter/anonymous/v1/assets/get?fileId=载治具信息导入模板.xlsx',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

//批量导入载治具信息
export const uploadUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/toolingfixtureinfo/upload`
