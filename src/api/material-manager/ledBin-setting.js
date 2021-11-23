import {requestCenter} from '@/libs/request'
/* ledBin设定 接口 */
// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/ledbinsetting/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/ledbinsetting/modify',
    method: 'put',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/ledbinsetting/getpagelist',
    method: 'post',
    data
  })
}

// 获取单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/ledbinsetting/getentity',
    method: 'post',
    data
  })
}

// 获取列表
export const getentitylistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/ledbinsetting/getentitylist',
    method: 'post',
    data
  })
}

//下拉分页查询
export const selectPageLedBinSettingListUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/ledbinsetting/getpagelist`