import { requestCenter } from '@/libs/request'
/* OEE智能报警 接口 */
// 修改
export const modifyReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/reportcenter/v1/oee_intelligentalarmlog/modify',
      method: 'put',
      data
  })
}
// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/oee_intelligentalarmlog/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/anonymous/v1/intelligentalarmlog/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

//获取指定查询参数列表
export const getParameterListReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/anonymous/v1/intelligentalarmlog/getintelligentalarmparameterlist',
    method: 'post',
    data
  })
}



