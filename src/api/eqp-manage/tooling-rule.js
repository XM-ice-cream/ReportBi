import {requestCenter} from '@/libs/request'
/* 治具上料规则 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingrule/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/toolingrule/modify',
    method: 'put',
    data
  })
}

// 获取设备要上的料
export const getdataReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingrule/getdata',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingrule/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingrule/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const toolingRulePageListUrl =()=> `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/toolingrule/getpagelist`

