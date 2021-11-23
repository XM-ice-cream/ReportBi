import { requestCenter } from '@/libs/request'
/* 站点对应维护 接口 */

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/subsidy/v1/sfccodemapping/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/sfccodemapping/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
    })
  }

  // 新增
export const addReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/sfccodemapping/add',
      method: 'post',
      data
    })
  }
// 编辑
export const modifyReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/sfccodemapping/modify',
      method: 'put',
      data
    })
  }
// 导入
export const uploadReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/sfccodemapping/upload',
      method: 'post',
      data
    })
  }
// 下载站点对应维护模板
export const downloadTemplateReq = data => {
    return requestCenter({
      url: '/api/systemcenter/anonymous/v1/assets/get?fileId=SfcCodeMapping',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
    })
  }



