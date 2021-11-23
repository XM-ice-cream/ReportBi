import {
    requestCenter
} from "@/libs/request";
/*不良代码对应原因现象 接口 */

// 新增
export const addReq = (data) => {
    return requestCenter({
        loading: true,
        url: "/api/repaircenter/v1/sn_defect/add",
        method: "post",
        data,
    });
};

// 修改
export const modifyReq = (data) => {
    return requestCenter({
        loading: true,
        url: "/api/repaircenter/v1/sn_defect/modify",
        method: "put",
        data,
    });
};

// 查询
export const getlistReq = (data) => {
    return requestCenter({
        url: "/api/repaircenter/v1/sn_defect/getlist",
        method: "post",
        data,
    });
};

// 分页查询
export const getpagelistReq = (data) => {
    return requestCenter({
        url: "/api/repaircenter/v1/sn_defect/getpagelist",
        method: "post",
        data,
    });
};

// 查询信息
export const getinfoReq = (data) => {
    return requestCenter({
        url: "/api/repaircenter/v1/sn_defect/getinfo",
        method: "post",
        data,
    });
};

// 查询信息
export const getdefectcodeReq = (data) => {
    return requestCenter({
        url: "/api/repaircenter/v1/sn_defect/getdefectcode",
        method: "post",
        data,
    });
};

// 导出
export const exportReq = (data) => {
    return requestCenter({
        loading: true,
        url: "/api/repaircenter/v1/sn_defect/export",
        method: "post",
        responseType: "arraybuffer",
        data,
    });
};

//获取维修位置列表
export const getLocationListReq = (data) => {
    return requestCenter({
        url: "/api/repaircenter/v1/sn_repair_location/getlist",
        method: "post",
        data,
    });
};

// 新增维修记录
export const repairAddReq = (data) => {
    return requestCenter({
        loading: true,
        url: "/api/repaircenter/v1/sn_repair/add",
        method: "post",
        data,
    });
};
// 增清洗PCB日志表
export const cleanpcbAddReq = (data) => {
    return requestCenter({
        loading: true,
        url: "/api/repaircenter/v1/cleanpcblog/add",
        method: "post",
        data,
    });
};

// 增清洗LedPCB日志表
export const cleanLedPcbAddReq = (data) => {
    return requestCenter({
        loading: true,
        url: "/api/materialcenter/v1/bininfo/cleanpcb",
        method: "post",
        data,
    });
};


// 分页获取清洗PCB日志表
export const getpagelistCleanpcbLogReq = (data) => {
    return requestCenter({
        loading: true,
        url: "/api/repaircenter/v1/cleanpcblog/getpagelist",
        method: "post",
        data,
    });
};

// 导出清洗PCB日志表
export const exportlistReq = (data) => {
    return requestCenter({
        loading: true,
        url: "/api/repaircenter/v1/cleanpcblog/exportlist",
        method: "post",
        responseType: "arraybuffer",
        data,
    });
};

// 获取FA操作手册单个
export const getFaPageListReq = (data) => {
    return requestCenter({
        url: "/api/repaircenter/v1/fasop/getlist",
        method: "post",
        data,
    });
};

// 获取BinCode信息
export const getBinCodeReq = (data) => {
    return requestCenter({
        url: "/api/workflowcenter/v1/unitinfo/getbincodebyunit",
        method: "post",
        data,
    });
};

// 获取责任部门树型数据
export const getDutyTreeReq = data => {
    return requestCenter({
        url: '/api/usercenter/v1/organzie/getlisttree',
        method: 'get',
        params: data
    })
}

// 上传图片
export const uploadImageReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/systemcenter/v1/assets/upload',
        method: 'post',
        data
    })
}

// 保存图片
export const saveImgReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/repaircenter/v1/sn_defect/uploadpicture',
        method: 'post',
        data
    })
}

// 进出维修时间
export const trackReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/repaircenter/v1/sn_defect/track',
        method: 'post',
        data
    })
}

// 一键维修
export const oneclickrepairReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/repaircenter/v1/sn_defect/oneclickrepair',
        method: 'post',
        data
    })
}

// 维修替换料件码
export const repairreplacematerialReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/workflowcenter/v1/wfkeypartslog/repairreplacematerial',
        method: 'post',
        data
    })
}
// 获取是否可以维修
export const getIsrepairReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/repaircenter/v1/sn_defect/checkrepair',
        method: 'post',
        params: data
    })
}
