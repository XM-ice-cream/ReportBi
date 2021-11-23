import { requestCenter } from '@/libs/request'
/* 出库申请单 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_useapplybill/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_useapplybill/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_useapplybill/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_useapplybill/getpagelist',
    method: 'post',
    data
  })
}

// 获取备品领用申请明细
export const getApplyDetailReq = data => {
    return requestCenter({
        loading: true,
      url: '/api/materialcenter/v1/bp_useapplydetail/getlist',
      method: 'post',
      data
    })
  }

  // 更改申请单状态
export const updatestatusReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bp_useapplybill/updatestatus',
    method: 'put',
    data
  })
}

// 获取备品领用申请单日志
export const getListLogReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bp_useapplybill_log/getlist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
      loading: true,
      url: '/api/materialcenter/v1/bp_useapplybill/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}

