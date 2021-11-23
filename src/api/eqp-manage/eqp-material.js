import { requestCenter} from '@/libs/request'
/* 设备上料 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqploading/add',
    method: 'post',
    data
  })
}

// 移除设备上料 - 报表
export const removeReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqploading/remove',
    method: 'post',
    data
  })
}

// 获取设备上料 - 报表
export const getreportReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/eqploading/getreport',
    method: 'post',
    data
  })
}

//分页查询历史
export const gethtpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/htfeeding/getpagelist',
    method: 'post',
    data
  })
}
export const getfullreportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/eqploading/getfullreport',
    method: 'post',
    data
  })
}
