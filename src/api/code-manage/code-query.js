import {requestCenter} from '@/libs/request'
/* 条码查询 接口 */


// 子集分页查询
export const getlablepagelistReq = (data,name) => {
  return requestCenter({
    url: '/api/materialcenter/v1/' + name +'/getpageentitylist',
    method: 'post',
    data
  })
}






