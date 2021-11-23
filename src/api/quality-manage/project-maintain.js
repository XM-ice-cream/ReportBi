import { requestCenter } from "@/libs/request";
/*  首件管理 项目维护 接口 */

// 新增
export const addReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/firtpieceitem/add",
    method: "post",
    data,
  });
};

// 修改
export const modifyReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/firtpieceitem/modify",
    method: "put",
    data,
  });
};

// 查询
export const getlistReq = (data) => {
  return requestCenter({
    url: "/api/workflowcenter/v1/firtpieceitem/getlist",
    method: "post",
    data,
  });
};

// 获取首件检查维护检查项目表
export const getentitylistReq = (data) => {
  return requestCenter({
    url: "/api/workflowcenter/v1/firtpieceitem/getentitylist",
    method: "post",
    data,
  });
};


// 分页查询
export const getpagelistReq = (data) => {
  return requestCenter({
    url: "/api/workflowcenter/v1/firtpieceitem/getpagelist",
    method: "post",
    data,
  });
};

// 首件项目维护分页查询
export const firtpieceitemPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/workflowcenter/v1/firtpieceitem/getpagelist`

