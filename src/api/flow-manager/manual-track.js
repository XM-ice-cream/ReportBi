import { requestCenter } from '@/libs/request'
/* 手动过站 接口 */


// 进站/收值/出站
export const trackReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/anonymous/v1/trackgo/track',
    method: 'post',
    data
  })
}

// 人工站过站
export const trackmanualReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/trackmanual/trackmanual',
    method: 'post',
    data
  })
}

// 进站校验
export const trackincheckReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/trackmanual/trackincheck',
    method: 'post',
    data
  })
}
