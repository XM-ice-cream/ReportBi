import {requestCenter} from '@/libs/request'
/* 穿孔刮刀规范 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/punchscraperspec/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/equipmentcenter/v1/punchscraperspec/modify',
    method: 'put',
    data
  })
}

// 查询单个
export const getlistentityReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/punchscraperspec/getlistentity',
    method: 'post',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/punchscraperspec/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/punchscraperspec/getpagelist',
    method: 'post',
    data
  })
}
// 分页查询
export const scraperSpecPageListUrl = () => `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/punchscraperspec/getpagelist`

// 批量导入
export const scraperSpecUploadUrl = () => `${window.localStorage.getItem("configip")}/api/equipmentcenter/v1/punchscraperspec/upload`



