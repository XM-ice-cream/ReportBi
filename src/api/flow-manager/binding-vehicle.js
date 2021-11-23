import {requestCenter} from '@/libs/request'
/* 绑定载治具 接口 */

// 新增
export const addToolingFixtureBindingReq = data => {
    return requestCenter({
      loading: true,
      url: '/api/equipmentcenter/v1/toolingfixturebinding/add',
      method: 'post',
      data
    })
  }

// 查询已绑定穴位号
export const getListToolingFixtureBindingReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfixturebinding/getlist',
    method: 'post',
    data
  })
}

//分页获取载治具绑定表
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfixturebinding/getpagelist',
    method: 'post',
    data
  })
}

