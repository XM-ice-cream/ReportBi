import { requestCenter } from '@/libs/request'
/* MSD等级 接口 */
// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/msdlevel/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/msdlevel/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/msdlevel/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/msdlevel/getpagelist',
    method: 'post',
    data
  })
}
//分页查询
export const msdLevelPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/msdlevel/getpagelist`

// 导出
export const exportReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/materialcenter/v1/msdlevel/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

// 下载防呆模板
export const downloadReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/msdlevel/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
//批量导入
export const uploadUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/msdlevel/upload`

