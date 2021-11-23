import { requestCenter } from '@/libs/request'
/* 自定义导出SQL API */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/exportsql/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/exportsql/modify',
    method: 'put',
    data
  })
}

// 获取
export const getlistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/exportsql/getlist',
    method: 'post',
    data
  })
}

// 分页获取
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/exportsql/getpagelist',
    method: 'post',
    data
  })
}

// 分页查询
export const customSQLPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/systemcenter/v1/exportsql/getpagelist`

// 分页执行自定义sql查询
export const executepagequeryReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/exportsql/executepagequery',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/exportsql/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

