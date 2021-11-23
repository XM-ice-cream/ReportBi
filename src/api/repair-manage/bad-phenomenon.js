import { requestCenter } from '@/libs/request'
/*不良代码对应原因现象 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/repaircenter/v1/defectCode/add',
    method: 'post',
    data
  })
}

// 修改
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/repaircenter/v1/defectCode/modify',
    method: 'put',
    data
  })
}

// 查询
export const getlistReq = data => {
  return requestCenter({
    url: '/api/repaircenter/v1/defectCode/getlist',
    method: 'post',
    data
  })
}

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/repaircenter/v1/defectCode/getpagelist',
    method: 'post',
    data
  })
}

//下拉分页查询
export const defectCodePageListUrl =()=> `${window.localStorage.getItem("configip")}/api/repaircenter/v1/defectCode/getpagelist`

// 导出
export const exportReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/repaircenter/v1/defectCode/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}




