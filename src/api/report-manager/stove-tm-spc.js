import { requestCenter } from '@/libs/request'

// 获取产品温度SPC明细
export const getSPCListReq = data => {
  return requestCenter({
    url: '/api/reportcenter/anonymous/v1/producttemperaturespc_data/getlist',
    method: 'post',
    data
  })
}

// 获取RHIBY时间散点数据
export const getrhiScatterplotListReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/reportcenter/anonymous/v1/producttemperature/getrhiscatterplotlist',
    method: 'post',
    data
  })
}






