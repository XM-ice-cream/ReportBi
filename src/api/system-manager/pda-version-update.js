import { requestCenter } from '@/libs/request'

// 获取数据
export const getlistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/pdaversion/getlist',
    method: 'post',
    data
  })
}

// 获取分页数据
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/pdaversion/getpagelist',
    method: 'post',
    data
  })
}

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/pdaversion/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/pdaversion/modify',
    method: 'put',
    data
  })
}
