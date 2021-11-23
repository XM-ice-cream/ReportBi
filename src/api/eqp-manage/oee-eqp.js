import {
    requestCenter
} from '@/libs/request'
/* OEE设备 接口 */

// 新增
export const addReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/equipmentcenter/v1/oee_eqpbase/add',
        method: 'post',
        data
    })
}

// 修改
export const modifyReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/equipmentcenter/v1/oee_eqpbase/modify',
        method: 'put',
        data
    })
}

// 查询
export const getlistReq = data => {
    return requestCenter({
        url: '/api/equipmentcenter/v1/oee_eqpbase/getlist',
        method: 'post',
        data
    })
}

// 分页查询
export const getpagelistReq = data => {
    return requestCenter({
        url: '/api/equipmentcenter/v1/oee_eqpbase/getpagelist',
        method: 'post',
        data
    })
}
// 设备数据基础配置
export const addBaseConfig = data => {
    return requestCenter({
        url: '/api/equipmentcenter/v1/oee_baseconfig/add',
        method: 'post',
        data
    })
}
// 线体数据维护
export const getEqpBaseDataConfig = data => {
    return requestCenter({
        url: '/api/equipmentcenter/v1/oee_baseconfig/getlist',
        method: 'post',
        data
    })
}
// plannedDT项目 新增
export const addPlannedDTItenConfig = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/oee_unplanneditem/add',
        method: 'post',
        data
    })
}

// 获取oee非计划停机项目
export const unPlannedItem = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/oee_unplanneditem/getlist',
        method: 'post',
        data
    })
}

// 获取oee规格型号列表
export const getOeeSpecList = data => {
    return requestCenter({
        url: '/api/equipmentcenter/v1/oee_eqpbase/getoeespeclist',
        method: 'post',
        data
    })
}

// 上传图片
export const uploadImageReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/equipmentcenter/v1/oee_eqpbase/uploadoeeeqptimg',
        method: 'post',
        data
    })
}

// 获取上传的图片
export const getOeeImgReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/equipmentcenter/v1/oee_eqpbase/getoeeeqptimg',
        responseType: 'arraybuffer',
        method: 'get',
        params: {
            ...data
        }
    })
}


// 获取plannedDT项目列表
export const getOeePlannedItem = data => {
    return requestCenter({
        url: '/api/reportcenter/v1/oee_unplanneditem/getlist',
        method: 'post',
        data
    })
}
