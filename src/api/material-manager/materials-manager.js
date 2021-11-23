import { requestCenter } from '@/libs/request'
/* 料号管理 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_part/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_part/modify',
    method: 'put',
    data
  })
}

// 查询
export const getentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_part/getentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_part/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_part/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_part/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 下载防呆模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_part/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入
export const uploadUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/bp_part/upload`

// 上传图片
export const uploadImageReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_part/uploadbppartimg',
    method: 'post',
    data
  })
}
// 获取上传的图片
export const getbppartimgReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_part/getbppartimg',
    responseType: 'arraybuffer',
    method: 'get',
    params: {
      ...data
    }
  })
}


