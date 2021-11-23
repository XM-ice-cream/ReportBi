import { requestCenter } from '@/libs/request'

// 分页获取报表信息
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/materialcenter/v1/reel/getpagelist',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
      loading: true,
      url: '/api/materialcenter/v1/reel/modify',
      method: 'put',
      data
    })
  }
