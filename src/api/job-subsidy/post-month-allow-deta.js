import { requestCenter } from '@/libs/request'
/* 津贴签核申请 接口 */

// 查询
export const getPagelistReq = data => {
  return requestCenter({
    url: '/api/subsidy/v1/postmonthallowdeta/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postmonthallowdeta/export',
      method: 'post',
      data
    })
  }

  // 查询待审核人
export const checktooa = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postmonthallowdeta/getattendempchecktooa',
      method: 'post',
      params:data
    })
  }




