import { requestCenter } from '@/libs/request'
/* IQC物料入库 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/rid_iqc/add',
    method: 'post',
    data
  })
}


// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/rid_iqc/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/rid_iqc/getpagelist',
    method: 'post',
    data
  })
}

//IQC打印
export const printReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/rid_iqc/print',
    method: 'post',
    data
  })
}

//解析RID信息
export const parseridReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/rid_iqc/parserid',
    method: 'get',
    params: data
  })
}

//系统自动生成RID及二维码信息
export const builderridandqrcodeReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/rid_iqc/builderridandqrcode',
    method: 'post',
    data
  })
}

// 拆分
export const splitiqcReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/rid_iqc/splitiqc',
    method: 'put',
    data
  })
}
