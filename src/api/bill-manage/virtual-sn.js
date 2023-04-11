import {
  requestCenter
} from "@/libs/request";
/* virtual SN 查询 接口 */

// 查询
export const getpagelistReq = (data) => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: "/api/reportcenter/virtualreport/v1/virtualyieldmgr/getvirtualsnlist",
    method: "post",
    data,
  });
};

// 添加
export const addReq = (data) => {
  return requestCenter({
    baseUrl: window.localStorage.getItem("reportip"),
    url: "/api/reportcenter/virtualreport/v1/virtualyieldmgr/addvirtualsn",
    method: "post",
    data,
  });
};
// 获取工单的目标数和投入数
export const getTargetInputNumReq = (data) => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: "/api/reportcenter/virtualreport/v1/virtualyieldmgr/getworkordernum",
    method: "get",
    params: data,
  });
};

// 导出
export const exportReq = (data) => {
  return requestCenter({
    loading: true,
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: "/api/reportcenter/virtualreport/v1/virtualyieldmgr/exportvirtualsn",
    method: "post",
    responseType: "arraybuffer",
    data,
  });
};