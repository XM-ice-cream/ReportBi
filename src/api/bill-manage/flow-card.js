import { requestCenter } from "@/libs/request";
/* 流程卡 接口 */
// 新增
export const addReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/unitinfotravel/add",
    method: "post",
    data,
  });
};

// 修改
export const modifyReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/unitinfotravel/modify",
    method: "put",
    data,
  });
};

// 查询
export const getlistReq = (data) => {
  return requestCenter({
    url: "/api/workflowcenter/v1/unitinfotravel/getlist",
    method: "post",
    data,
  });
};

// 分页查询
export const getpagelistReq = (data) => {
  return requestCenter({
    timeout: 0,
    url: "/api/workflowcenter/v1/unitinfotravel/getpagelist",
    method: "post",
    data,
  });
};

// 导出
export const exportReq = (data) => {
  return requestCenter({
    loading: true,
    timeout: 0,
    url: "/api/workflowcenter/v1/unitinfotravel/export",
    method: "post",
    responseType: "arraybuffer",
    data,
  });
};

// 下载防呆模板
export const downloadReq = (data) => {
  return requestCenter({
    url: "/api/workflowcenter/v1/unitinfotravel/download",
    method: "get",
    responseType: "arraybuffer",
    params: data,
  });
};
//批量导入
export const uploadUrl = () =>
  `${window.localStorage.getItem("configip")}/api/usercenter/v1/userattlimit/upload`;

// 获取条码的跳站基本信息
export const getunitinfoReq = (data) => {
  return requestCenter({
    url: "/api/workflowcenter/v1/unitinfo/getunitinfo",
    method: "post",
    data,
  });
};

// 跳站
export const skipReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/trackskip/skip",
    method: "post",
    data,
  });
};

// 跳站
export const returnReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/trackskip/return",
    method: "post",
    data,
  });
};

// 锁定
export const holdReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/trackskip/hold",
    method: "post",
    data,
  });
};

// 解锁
export const unholdReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/trackskip/unhold",
    method: "post",
    data,
  });
};

// 重工
export const reworkReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/trackskip/rework",
    method: "post",
    data,
  });
};

// 批量锁定
export const holdBatchReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/trackskip/holdimport",
    method: "post",
    data,
  });
};

// 批量解锁
export const unholdBatchReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/trackskip/unholdimport",
    method: "post",
    data,
  });
};

// 调整Rule
export const changeRuleReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/trackskip/changerule",
    method: "post",
    data,
  });
};

// 变更流程图
export const changeFlowReq = (data) => {
  return requestCenter({
    loading: true,
    url: "/api/workflowcenter/v1/trackskip/changeflow",
    method: "post",
    data,
  });
};

// 根据条码类型条件获取小条码信息,本接口只返回原始行数据
export const getunitinfosReq = (data) => {
  return requestCenter({
    url: "/api/workflowcenter/anonymous/v1/trackgo/getunitinfos",
    method: "post",
    data,
  });
};
