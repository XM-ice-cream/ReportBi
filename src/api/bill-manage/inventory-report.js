import {
  requestCenter
} from '@/libs/request'
/* Inventory 报表接口 */

// 获取数据
export const getListReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/inventoryreport/getinventorydata',
    method: 'post',
    data
  })
}
//Inventory 明细
export const getInventoryReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/inventoryreport/getinventorydetaildata',
    method: 'post',
    data
  })
}
//Borrow 明细
export const getBorrowReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/inventoryreport/getborrowdetaildata',
    method: 'post',
    data
  })
}
//Fail Qty 明细
export const getFailQtyReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/inventoryreport/getfailqtydetaildata',
    method: 'post',
    data
  })
}
//报表下载
export const downloadReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/inventoryreport/export',
    method: 'post',
    responseType: "arraybuffer",
    data
  })
}
//Inventory 下载
export const downloadInventoryReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/inventoryreport/exportinventorydetail',
    method: 'post',
    responseType: "arraybuffer",
    data
  })
}
//Borrow 下载
export const downloadBorrowReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/inventoryreport/exportborrowdetail',
    method: 'post',
    responseType: "arraybuffer",
    data
  })
}
//Fail Qty 下载
export const downloadFailQtyReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/anonymous/v1/inventoryreport/exportfailqtydetail',
    method: 'post',
    responseType: "arraybuffer",
    data
  })
}