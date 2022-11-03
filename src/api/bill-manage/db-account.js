import {
    requestCenter
} from '@/libs/request'
/*DB账户信息 接口 */

// 查询
export const getpagelistReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/DBAccountManagement/v1/DBAccountInfo/getpagelist',
        method: 'post',
        data
    })
}
// 新增
export const addReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/DBAccountManagement/v1/DBAccountInfo/add',
        method: 'post',
        data
    })
}
// 修改
export const modifyReq = data => {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/DBAccountManagement/v1/DBAccountInfo/modify',
        method: 'put',
        data
    })
}

// 导出
export const exportReq = (data) => {
  return requestCenter({
    loading: true,
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/DBAccountManagement/v1/DBAccountInfo/export',
    method: "post",
    responseType: "arraybuffer",
    data,
  });
};

// 批量导入Excel文件
export const uploadUrl = () => `${window.localStorage.getItem("reportip")}/api/reportcenter/DBAccountManagement/v1/DBAccountInfo/upload`