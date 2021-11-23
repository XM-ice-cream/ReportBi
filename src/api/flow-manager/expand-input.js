import { requestCenter} from '@/libs/request'
/* LED Expand Input 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/expandloction/add',
    method: 'post',
    data
  })
}

// 删除
export const deleteReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/expandloction/delete',
    method: 'delete',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/feeding/getlist',
    method: 'post',
    data
  })
}

// 查询一级列表
export const getMainReportReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/expandloction/getmainreport',
    method: 'post',
    data
  })
}

// 查询二级列表
export const getSubReportReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/expandloction/getsubreport',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/feeding/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const eqpPageListUrl =() => `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/feeding/getpagelist`

//分页查询历史
export const gethtpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/htfeeding/getpagelist',
    method: 'post',
    data
  })
}

//页获取MiniLed上料
export const getexpandloctionReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/expandloction/getpagelist',
    method: 'post',
    data
  })
}

// 条码解析rid
export const parseriduseruleReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/rid_iqc/parseriduserule',
    method: 'get',
    params: data
  })
}

