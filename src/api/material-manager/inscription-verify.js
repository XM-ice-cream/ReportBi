import { requestCenter } from '@/libs/request'
/* 碑文信息验证 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reelstatusinscription/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reelstatusinscription/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/reelstatusinscription/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/reelstatusinscription/getpagelist',
    method: 'post',
    data
  })
}

// 获取碑文信息行数数组
export const getrownumsReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/reelstatusinscription/getrownums',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/materialcenter/v1/reelstatusinscription/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

// 下载防呆模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/reelstatusinscription/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入
export const uploadUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/reelstatusinscription/upload`

