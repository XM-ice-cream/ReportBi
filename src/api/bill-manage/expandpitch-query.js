import { requestCenter } from "@/libs/request";
/* 扩晶Pitch值查询 接口 */

// 查询
export const getpagelistReq = (data) => {
  return requestCenter({
    timeout: 0,
    baseUrl:'http://172.30.50.14:5700' ||window.localStorage.getItem("reportip"),
    url: "/api/reportcenter/anonymous/v1/aoiexpandquerypitch/getexpandpitch",
    method: "post",
    data,
  });
};

// 导出
export const exportReq = (data) => {
  return requestCenter({
    loading: true,
    timeout: 0,
    baseUrl:'http://172.30.50.14:5700' || window.localStorage.getItem("reportip"),
    url: "/api/reportcenter/anonymous/v1/aoiexpandquerypitch/export",
    method: "post",
    responseType: "arraybuffer",
    data,
  });
};
