import {
  requestCenter
} from '@/libs/request'
// 工作簿预览
// 查询
export const getWorkbookInfoReq = data => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/biworkbook/preview',
    method: 'post',
    data
  })
}