import {requestCenter} from '@/libs/request'
/* emaping信息检查 接口 */

// 文件是否存在
export const checkfileexistReq = data => {
  return requestCenter({
    // baseUrl: 'http://10.42.120.47:5500',
    loading: true,
    url: '/api/workflowcenter/v1/expandtrace/checkfileexist',
    method: 'get',
    params: data
  })
}
