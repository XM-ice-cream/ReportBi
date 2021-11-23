import {
  requestCenter
} from '@/libs/request'
/* Bin基础维护 接口 */
// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bin/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/materialcenter/v1/bin/modify',
    method: 'put',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/bin/getpagelist',
    method: 'post',
    data
  })
}

//下拉分页查询
export const selectPageBinListUrl =()=> `${window.localStorage.getItem("configip")}/api/materialcenter/v1/bin/getpagelist`