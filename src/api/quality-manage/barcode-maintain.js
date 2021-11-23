import { requestCenter } from "@/libs/request";
/*  首件管理 条码维护 接口 */

// 新增/修改
export const addReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/firtpiecebarcode/add",
    method: "post",
    data,
  });
};

// 获取首件检查维护条码
export const getentitylistReq = (data) => {
  return requestCenter({
    url: "/api/workflowcenter/v1/firtpiecebarcode/getentitylist",
    method: "post",
    data,
  });
};

// 分页查询
export const getpagelistReq = (data) => {
  return requestCenter({
    url: "/api/workflowcenter/v1/firtpiecebarcode/getpagelist",
    method: "post",
    data,
  });
};


