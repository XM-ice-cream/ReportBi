import {
    userLocalInfo
} from "@/libs/utils"

export default {
    menuId: '',
    id: '',
    roleIds: '',
    systemFlag: 'baize',
    account: '',
    userName: '',
    password: '',
    phone: '',
    email: '',
    companyIds: '',
    departmentIds: '',
    access: '',
    avatarImgPath: '',
    breadCrumbList: [],
    routeList: [],
    tagNavList: userLocalInfo().tagNavList || [],
    homeRoute: {},
    local: '',
    unreadCount: 0,
    errorList: [],
    isAdministrator: false,
    hasReadErrorPage: false,
    hasGetMenuInfo: false,
    refreshingToken: false, // 是否正在刷新token true正在刷新
    ip: '', // 用户IP
    vipLevel: '', // 等级
    tipsPublicObj: {
        content: '',
        color: ''
    }, // 公告
}