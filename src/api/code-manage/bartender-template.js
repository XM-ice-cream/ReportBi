import {requestCenter} from '@/libs/request'
/* Bartender模板 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bartendertemplate/add',
    method: 'post',
    data
  })
}
export const uploadTemplateReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bartendertemplate/uploadTemplate',
    method: 'post',
    data
  })
}
export const modifyTemplateReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bartendertemplate/modifyTemplate',
    method: 'post',
    data
  })
}

/* 测试模板打印 */
export const testTemplatePrintReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bartendertemplate/testtemplateprint',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bartendertemplate/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bartendertemplate/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bartendertemplate/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bartendertemplate/getpagelist',
    method: 'post',
    data
  })
}

//分页查询下拉数据
export const templateNamePageListUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/bartendertemplate/getpagelist`