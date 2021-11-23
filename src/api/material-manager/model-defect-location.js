import { requestCenter } from '@/libs/request'
/* 机种不良位置 */

// 工单信息表新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/repaircenter/v1/modeldefectlocation/add',
    method: 'post',
    data
  })
}

// 工单信息表修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/repaircenter/v1/modeldefectlocation/modify',
    method: 'put',
    data
  })
}

// 获取工单信息表分页数据
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/repaircenter/v1/modeldefectlocation/getpagelist',
    method: 'post',
    data
  })
}