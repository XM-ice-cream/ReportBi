import { requestCenter } from "@/libs/request";
/*线下维修 接口 */

// 新增
export const addReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/repaircenter/v1/dataoffline/add",
    method: "post",
    data,
  });
};

// 修改
export const modifyReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/repaircenter/v1/dataoffline/modify",
    method: "put",
    data,
  });
};

// 新增(手动)
export const addmanualReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/repaircenter/v1/dataoffline/addmanual",
    method: "post",
    data,
  });
};

// 修改(手动)
export const modifymanualReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/repaircenter/v1/dataoffline/modifymanual",
    method: "put",
    data,
  });
};

// 查询单个
export const getentityReq = (data) => {
  return requestCenter({
    url: "/api/repaircenter/v1/dataoffline/getentity",
    method: "post",
    data,
  });
};

// 查询
export const getlistReq = (data) => {
  return requestCenter({
    url: "/api/repaircenter/v1/dataoffline/getentitylist",
    method: "post",
    data,
  });
};

// 分页查询
export const getpagelistReq = (data) => {
  return requestCenter({
    url: "/api/repaircenter/v1/dataoffline/getpagelist",
    method: "post",
    data,
  });
};

// 获取id
export const getunitidReq = (data) => {
  return requestCenter({
    url: "/api/repaircenter/v1/dataoffline/getunitid",
    method: "post",
    data,
  });
};

//获取编码
export const getdefectcodeReq = (data) => {
  return requestCenter({
    url: "/api/repaircenter/v1/dataoffline/getdefectcode",
    method: "post",
    data,
  });
};

// 获取位置
export const getlocationReq = (data) => {
  return requestCenter({
    url: "/api/repaircenter/v1/dataoffline/getlocation",
    method: "post",
    data,
  });
};
// 获取信息
export const getinfoReq = (data) => {
  return requestCenter({
    url: "/api/repaircenter/v1/dataoffline/getinfo",
    method: "post",
    data,
  });
};

// 获取不良
export const getdefectReq = (data) => {
  return requestCenter({
    url: "/api/repaircenter/v1/dataoffline/getdefect",
    method: "post",
    data,
  });
};
