import { requestCenter } from '@/libs/request'
/* 编码预览表 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/codepreview/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/codepreview/modify',
    method: 'put',
    data
  })
}

// 分页列表查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/codepreview/getpagelist',
    method: 'post',
    data
  })
}
