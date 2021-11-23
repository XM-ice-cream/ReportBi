import { requestCenter } from '@/libs/request'

// 获取分页
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/anonymous/v1/antivirus/getpagelist',
    method: 'post',
    data
  })
}

// 获取下拉数据
export const getselectlistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/anonymous/v1/antivirus/getselectlist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
      url: '/api/systemcenter/anonymous/v1/antivirus/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
  })
}
