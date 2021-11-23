import { requestCenter } from '@/libs/request'
/* 备品管理 接口 */
// 库存领用分析
export const getAnalysisReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_storage/getusemoneyanalysisnew',
    method: 'post',
    data
  })
}

// 获取产品处
export const getDeptReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_department/getlist',
    method: 'post',
    data
  })
}

// 获取职能部门
export const getFunctionalDeptReq = data => {
  return requestCenter({
    url: '/api/systemcenter/anonymous/v1/dataitemdetail/getlist',
    method: 'post',
    data
  })
}

// 获取子部门
export const getBpDeptReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_department/getlist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_storage/exportbpusereportlist',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
