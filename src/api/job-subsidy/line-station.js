import { requestCenter } from '@/libs/request'
/* 线体站点绑定 接口 */

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/subsidy/v1/postlinestation/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
    return requestCenter({
      url: '​/api​/subsidy​/v1​/postlinestation​/export',
      method: 'post',
      data
    })
  }

  // 新增
export const addReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlinestation/add',
      method: 'post',
      data
    })
  }
// 编辑
export const modifyReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlinestation/modify',
      method: 'put',
      data
    })
  }
// 导入
export const uploadReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlinestation/upload',
      method: 'post',
      data
    })
  }

// 下载线体站点绑定模板
export const downloadTemplateReq = data => {
    return requestCenter({
      url: '/api/systemcenter/anonymous/v1/assets/get?fileId=PostLineStation',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
    })
  }

  // 通过机种和段别获取线体
export const getLineByModelAndStage = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlinestation/getlinebymodelstage',
      method: 'post',
      params:data
    })
  }

  // 通过线体获取站点
export const getStationByLine = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlinestation/getstationbyline',
      method: 'post',
      params:data
    })
  }

    // 批量删除
export const deleteBranches = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlinestation/deletebyline',
      method: 'post',
      params:data
    })
  }

      // 特殊岗位提示框
export const getTempCount = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlinestation/getempcount',
      method: 'post',
      params:data
    })
  }



