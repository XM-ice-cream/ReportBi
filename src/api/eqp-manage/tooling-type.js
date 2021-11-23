import { requestCenter } from '@/libs/request'
/* 工治具类型 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingtype/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingtype/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingtype/getlist',
    method: 'post',
    data
  })
}


// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingtype/getpagelist',
    method: 'post',
    data
  })
}

//下拉分页查询
export const toolingTypePageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/toolingtype/getpagelist`
