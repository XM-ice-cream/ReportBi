import { requestCenter } from '@/libs/request'
/* 载治具电子看板 接口 */

// 分页查询
export const getpagelistReq = data => {
  return requestCenter({
    url: '/api/equipmentcenter/v1/toolingfixtureinfo/getpagelistbyreport',
    method: 'post',
    data
  })
}




