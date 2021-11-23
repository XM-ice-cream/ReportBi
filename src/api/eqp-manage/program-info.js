import { requestCenter } from "@/libs/request";
/* 程式信息 接口 */
// 新增
export const addReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/equipmentcenter/v1/eqprecipe/add",
    method: "post",
    data,
  });
};

// 修改
export const modifyReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/equipmentcenter/v1/eqprecipe/modify",
    method: "put",
    data,
  });
};

// 查询单个
export const getentityReq = (data) => {
  return requestCenter({
    url: "/api/equipmentcenter/v1/eqprecipe/getentity",
    method: "post",
    data,
  });
};

// 查询
export const getlistReq = (data) => {
  return requestCenter({
    url: "/api/equipmentcenter/v1/eqprecipe/getlist",
    method: "post",
    data,
  });
};

// 分页查询
export const getpagelistReq = (data) => {
  return requestCenter({
    url: "/api/equipmentcenter/v1/eqprecipe/getpagelist",
    method: "post",
    data,
  });
};
// 分页查询
export const programInfoPageListUrl =()=> `${window.localStorage.getItem(
  "configip"
)}/api/equipmentcenter/v1/eqprecipe/getpagelist`;

// 新增参数
export const addParamsReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/equipmentcenter/v1/eqprecipeparameters/add",
    method: "post",
    data,
  });
};

// 修改参数
export const modifyParamsReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/equipmentcenter/v1/eqprecipeparameters/modify",
    method: "put",
    data,
  });
};

// 分页查询参数
export const getpagelistParamsReq = (data) => {
  return requestCenter({
    url: "/api/equipmentcenter/v1/eqprecipeparameters/getlist",
    method: "post",
    data,
  });
};
