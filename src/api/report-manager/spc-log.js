import { requestCenter } from '@/libs/request'

// 分页获取产品温度SPC
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperaturespc/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/anonymous/v1/producttemperaturespc/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}






