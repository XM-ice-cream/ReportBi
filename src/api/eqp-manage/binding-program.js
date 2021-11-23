import { requestCenter } from "@/libs/request";
/* 设备绑定程式 接口 */
// 新增
export const addReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/equipmentcenter/v1/eqpreciperelations/add",
    method: "post",
    data,
  });
};

// 修改
export const modifyReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/equipmentcenter/v1/eqpreciperelations/modify",
    method: "put",
    data,
  });
};

// 查询单个
export const getentityReq = (data) => {
  return requestCenter({
    url: "/api/equipmentcenter/v1/eqpreciperelations/getentity",
    method: "post",
    data,
  });
};

// 获取设备程式信息
export const getRecipeInfoReq = (data) => {
  return requestCenter({
    url: "/api/equipmentcenter/v1/eqpreciperelations/getrecipeinfo",
    method: "get",
    params: data,
  });
};

// 绑定程式变更记录查询
export const getLogReq = (data) => {
  return requestCenter({
    url: "/api/equipmentcenter/v1/eqpreciperelationslog/getpagelist",
    method: "post",
    data,
  });
};
