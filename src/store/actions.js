import {
    getReq
} from '@/api/organize-manager/user-manager'
import {
    getlisttreecurrentuserReq,
    getpagelisttreeReq
} from '@/api/organize-manager/authorize-manager/menu-manager'
import {
    addReq
} from '@/api/system-manager/error-record'
import {
    initNode,
    userLocalInfo
} from "@/libs/utils"
import {
    errorRouter
} from "@/router/routers";
import {
    resetRouter
} from "@/router";

export default {
    // 退出登录
    handleLogOut({
        commit
    }) {
        return new Promise((resolve) => {
            userLocalInfo({
                token: '',
                refreshToken: '',
                userInfo: {},
                tagNavList: [],
            })
            commit('updateAppRouter', {})
            commit('updateHasGetMenuInfo', false)
            resetRouter()
            resolve()
        })
    },
    // 获取左侧导航菜单信息
    handleGetLeftMenuList({
        commit
    }) {
        return new Promise((resolve => {
            getlisttreecurrentuserReq().then(res => {
                console.log(res);
                let menuList = initNode(res.result.filter(o => o.name === 'bill-manage' || o.name === 'bill-design-manage'))
                menuList.push(...errorRouter);
                console.log(menuList);
                commit('updateAppRouter', menuList)
                commit('updateHasGetMenuInfo', true)
                resolve()
            })
        }))
    },
    // 获取页面授权下的按钮
    handleGetPageButtonList({
        state
    }, {
        pageConfig
    }) {
        const obj = {
            orderField: pageConfig.orderField, // 排序字段
            ascending: true, // 是否升序
            pageSize: pageConfig.pageSize, // 分页大小
            pageIndex: pageConfig.pageIndex, // 当前页码
            data: {
                id: '',
                parentId: state.menuId,
                category: 2,
                source: 1,
                name: '',
                title: '',
                enabled: 1
            },
        }
        return getpagelisttreeReq(obj)
    },
    // 获取用户IP
    handleIP({
        commit
    }) {
        getReq().then(res => {
            commit('setIP', res.result)
        })
    },
    // 提交错误记录
    handleErrorRecord({
        state
    }, payload) {
        let obj = {
            baseUrl: payload.baseUrl || state.ip,
            url: payload.url,
            method: payload.method,
            httpStatus: payload.status.toString(),
            paramsJson: JSON.stringify(payload.data || payload.params),
            token: payload.Authorization,
            errorCode: payload.errorCode.toString(),
            errorCodeMsg: payload.errorCodeMsg || '',
            responseMsg: payload.message || '',
            responseResult: JSON.stringify(payload.result || ''),
            enabled: 1,
        }
        addReq(obj).then(() => {})
    },
}