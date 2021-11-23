import { requestCenter } from '@/libs/request'

// 获取token
export const getTokenReq = data => {
  return requestCenter({
    reqType: 'FormData',
    url: '/connect/token',
    method: 'post',
    data
  })
}
