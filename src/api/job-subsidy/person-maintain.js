import { requestCenter } from '@/libs/request'
/* 人员维护 接口 */

// 查询
export const getPagelistReq = data => {
  return requestCenter({
    url: '/api/subsidy/v1/postlineemp/getpagelist',
    method: 'post',
    data
  })
}

// 导出
export const exportReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlineemp/export',
      method: 'post',
      responseType: 'arraybuffer',
      data
    })
  }

  // 新增
export const addReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlineemp/add',
      method: 'post',
      data
    })
  }
// 编辑
export const modifyReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlineemp/modify',
      method: 'put',
      data
    })
}

// 导入
export const uploadReq = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlineemp/upload',
      method: 'post',
      data
    })
  }

  // 下载人员维护模板
export const downloadTemplateReq = data => {
    return requestCenter({
      url: '/api/systemcenter/anonymous/v1/assets/get?fileId=PostLineEmpTem',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
    })
  }
// 通过线体和站点获取站点分支
export const getStationBrachByLineAndStation = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlineemp/getstationbranchbylinestation',
      method: 'post',
      params:data
    })
  }
// 通过线体和站点获取岗位
export const getPostByLineAndStation = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlineemp/getpostbylinestation',
      method: 'post',
      params:data
    })
  }
// 批量删除
export const deleteBranches = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlineemp/deletelineemp',
      method: 'post',
      params:data
    })
  }
  // 异常查询
export const getUnList = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlineemp/checkemp',
      method: 'post',
      params:data
    })
  }
  // 获取OA状态
  export const getOa = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlineemp/getcheckoa',
      method: 'post',
      data
    })
  }
   //更新OA状态
   export const updateOa = data => {
    return requestCenter({
      url: '/api/subsidy/v1/postlineemp/ischeckoa',
      method: 'post',
      data
    })
  }


