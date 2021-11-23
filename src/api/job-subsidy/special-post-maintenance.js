import { requestCenter } from '@/libs/request'
/* 特殊岗位维护 接口 */

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/subsidy/v1/specialpost/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/specialpost/export',
      method: 'post',
      data
    })
  }

  // 新增
export const addReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/specialpost/add',
      method: 'post',
      data
    })
  }
// 编辑
export const modifyReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/specialpost/modify',
      method: 'put',
      data
    })
  }

  // 获取特殊岗位list
  export const getSpecialList=data=>{
      return requestCenter({
          url:'/api/subsidy/v1/specialpost/getlist',
          method: 'post',
          data
      })
  }



