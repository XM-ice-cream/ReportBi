import { requestCenter } from '@/libs/request'
/* 碑文信息维护 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/pninscription/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/pninscription/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pninscription/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pninscription/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/materialcenter/v1/pninscription/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

// 下载防呆模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/pninscription/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入
export const uploadUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/pninscription/addexcel`

// 上传图片
export const uploadImageReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/assets/upload',
    method: 'post',
    data
  })
}

// 保存图片
export const saveImgReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/pninscription/savepictures',
    method: 'post',
    data
  })
}
