import {
  getTokenReq
} from "@/api/login";

import {
  getcurrentuserReq,
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
  userLocalInfo,
  sessionSave
} from "@/libs/utils"
import {
  errorRouter
} from "@/router/routers";
import {
  resetRouter
} from "@/router";
import {
  encryptDes,
  sha1_to_base64
} from '@/libs/des';

import store from '@/store'

export default {
  // 登录
  handleLogin({
    commit
  }, {
    userName,
    password
  }) {
    const obj = {
      client_id: "baize",
      client_secret: "secret",
      grant_type: "password",
      username: userName.trim(),
      password: sha1_to_base64(encryptDes(password.trim(), "baize#66", "lxeP@ssx")),
      scope: "api offline_access",
      source: 1,
    };
    sessionSave("userName", obj.username);
    sessionSave("password", obj.password);
    localStorage.setItem('currentUser', obj.username);
    let localObj = {
      userName: obj.username,
      password: obj.password,
    };
    return new Promise((resolve, reject) => {
      getTokenReq(obj)
        .then((res) => {
          console.log(res);
          if (res.code === 500) {
            Message.error({
              content: res.message,
              duration: 10,
              closable: true,
            });
          } else {
            localObj.token = res.access_token;
            localObj.refreshToken = res.refresh_token;
            localObj.locking = obj.username;
            localObj.password = obj.password;
            userLocalInfo(localObj);
            getcurrentuserReq()
              .then((resp) => {
                if (resp.code === 200) {
                  commit("setUserInfo", resp.result);
                  localObj.userInfo = resp.result;
                  userLocalInfo(localObj);
                  resolve(resp);
                } else reject(resp);
              })
              .catch((error) => {
                userLocalInfo(localObj);
                reject(error);
              });
          }
        })
        .catch((err) => {
          userLocalInfo(localObj);
          reject(err);
        });
    });
  },
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
        let menuList = initNode(res.result.filter(o => o.name === 'bill-design-manage'));
        menuList.push(...errorRouter);
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