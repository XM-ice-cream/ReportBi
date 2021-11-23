import { requestCenter } from '@/libs/request'
/*系统错误记录 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/errorrecord/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/errorrecord/modify',
    method: 'put',
    data
  })
}

// 删除
export const deleteReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/errorrecord/delete',
    method: 'delete',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/errorrecord/getlist',
    method: 'post',
    data
  })
}

// 查询单个
export const getentityReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/errorrecord/getentity',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/errorrecord/getpagelist',
    method: 'post',
    data
  })
}




