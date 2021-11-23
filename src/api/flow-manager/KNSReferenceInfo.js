import {
  requestCenter
} from '@/libs/request'
/* KNS坐标信息维护 接口 */

// 新增/编辑
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/knsreferenceinfo/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/knsreferenceinfo/modify',
    method: 'put',
    data
  })
}

// 分页获取KNSReferenceInfo
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/knsreferenceinfo/getpagelist',
    method: 'post',
    data
  })
}

// 获取KNSReferenceInfo
export const getentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/knsreferenceinfo/getentitylist',
    method: 'post',
    data
  })
}

// 删除
export const deleteReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/knsreferenceinfo/delete',
    method: 'delete',
    data
  })
}

// 导入
export const uploadReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/knsreferenceinfo/upload',
    method: 'post',
    data
  })
}

//批量导入
export const knsReferenceInfoUploadUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/knsreferenceinfo/upload`
