import { requestCenter } from '@/libs/request'
/* 技术工代码维护 接口 */

// 查询
export const getPagelistReq = data => {
  return requestCenter({
    url: '/api/subsidy/v1/posttechnician/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/sfccodemapping/export',
      method: 'post',
      data
    })
  }

  // 新增
export const addReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/posttechnician/add',
      method: 'post',
      data
    })
  }
// 编辑
export const modifyReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/posttechnician/modify',
      method: 'put',
      data
    })
  }



