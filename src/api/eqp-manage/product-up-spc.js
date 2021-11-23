import { requestCenter } from '@/libs/request'

// 获取spc图表数据
export const getSpcReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/productreflowkeylog/getkeyspckanban',
    method: 'post',
    data
  })
}

// 获取项目数据
export const getProjectNameReq = data => {
  return requestCenter({
    url: '/api/reportcenter/v1/productreflowkeylog/getproductreflowkeylist',
    method: 'post',
    data
  })
}

