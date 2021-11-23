import { requestCenter } from "@/libs/request";
/* 上抛WMS日志 接口 */

// 上传WMS
export const pushpackReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/materialcenter/v1/wmsrecord/pushpack",
    method: "post",
    data,
  });
};

// 解绑WMS箱号
export const unbindingReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/materialcenter/v1/wmsrecord/unbinding",
    method: "post",
    data,
  });
};

// 分页查询
export const getpagelistReq = (data) => {
  return requestCenter({
    url: "/api/materialcenter/v1/wmsrecord/getpagelist",
    method: "post",
    data,
  });
};
