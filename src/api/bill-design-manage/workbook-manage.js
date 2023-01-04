import {
  requestCenter
} from '@/libs/request'
// 工作簿管理
// 查询
export const getpagelistReq = data => {
  return requestCenter({
    baseUrl: "http://10.32.44.115:8700" || window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/biworkbook/getpagelist',
    method: 'post',
    data
  })
}

// 插入
export const addReq = data => {
  return requestCenter({
    baseUrl: "http://10.32.44.115:8700" || window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/biworkbook/insert',
    method: 'post',
    data
  })
}
// 编辑
export const modifyReq = data => {
  return requestCenter({
    baseUrl: "http://10.32.44.115:8700" || window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/biworkbook/modify',
    method: 'post',
    data
  })
}
// 删除
export const deleteReq = data => {
  return requestCenter({
    baseUrl: "http://10.32.44.115:8700" || window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/biworkbook/delete',
    method: 'post',
    data
  })
}
//==============设计====================================
// 获取数据集对应的所有字段
export const getTabelColumnReq = data => {
  return requestCenter({
    baseUrl: "http://10.32.44.115:8700" || window.localStorage.getItem("reportDesignIp"),
    url: '/api/autoreportcenter/anonymous/v1/biworkbookdata/gettablecolumn',
    method: 'post',
    data
  })
}