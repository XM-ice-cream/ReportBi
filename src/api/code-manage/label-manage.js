import { requestCenter } from '@/libs/request'
/* 标签 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wounit/add',
    method: 'post',
    data
  })
}

// 子集分页查询
export const getlablepagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/wounit/getpageentitylist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wounit/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

//条码打印
export const printingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wounit/printing',
    method: 'post',
    data
  })
}

// 生产序列号补印
export const wounitReprintingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wounit/reprinting',
    method: 'post',
    data
  })
}

//连板补印
export const wopanelReprintingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopanel/reprinting',
    method: 'post',
    data
  })
}

//彩盒补印
export const woboxReprintingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wobox/reprinting',
    method: 'post',
    data
  })
}
//箱号补印
export const wocartonReprintingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wocarton/reprinting',
    method: 'post',
    data
  })
}

//栈板补印
export const wopalletReprintingReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopallet/reprinting',
    method: 'post',
    data
  })
}

//生产序列号扩展
export const wounitExtensionReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wounit/extension',
    method: 'post',
    data
  })
}
//连板扩展
export const wopanelExtensionReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopanel/extension',
    method: 'post',
    data
  })
}
//彩盒扩展
export const boxExtensionReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wobox/extension',
    method: 'post',
    data
  })
}
//箱号扩展
export const wocartonExtensionReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wocarton/extension',
    method: 'post',
    data
  })
}
//栈板扩展
export const wopalletExtensionReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopallet/extension',
    method: 'post',
    data
  })
}

// 查询工单下拉数据
export const getworkorderlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/WorkOrder/getamountwithworkorder',
    method: 'post',
    data
  })
}
//分页查询工单下拉数据
export const workorderPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/workorder/getpagelistamountwithworkorder`


//绑定大板码与小板码
export const bindBigPlateReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/lablerelation/add',
    method: 'post',
    data
  })
}

// 分页列表查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/WorkOrder/getpagelistamountwithworkorder',
    method: 'post',
    data
  })
}

// 预览单据编码获取生成的编码
export const getLabelPreviewReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/coderule/getpriviewbillnumber',
    method: 'get',
    params: data
  })
}

// 绑定连板
export const bindFinalReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/wopanel/addbypanel',
    method: 'post',
    data
  })
}




