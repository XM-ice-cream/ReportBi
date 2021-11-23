import { requestCenter } from '@/libs/request'
/* 线别岗位人数维护 接口 */

// 查询
export const getPagelistReq = data => {
  return requestCenter({
    url: '/api/subsidy/v1/postlinepeople/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlinepeople/export',
      method: 'post',
      data
    })
  }

  // 新增
export const addReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlinepeople/add',
      method: 'post',
      data
    })
  }
// 编辑
export const modifyReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlinepeople/modify',
      method: 'put',
      data
    })
  }




