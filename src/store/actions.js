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
      client_id: "BI",
      client_secret: "secret",
      grant_type: "password",
      username: userName.trim(),
      password: sha1_to_base64(encryptDes(password.trim(), "bi", "password")),
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
        mId: "",
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
        const data = [{
          "id": "D64702FF72B04CF29DC202CCD402FCEC",
          "parentId": "0",
          "category": 1,
          "source": 1,
          "name": "bill-design-manage",
          "title": "报表设计",
          "href": "/bill-design-manage",
          "component": "Main",
          "icon": "iconfont icon-menu",
          "sortCode": 100,
          "apis": null,
          "remark": null,
          "children": [{
              "id": "B0195E68C53F4C1CB7AEFA411AE700A7",
              "parentId": "D64702FF72B04CF29DC202CCD402FCEC",
              "category": 1,
              "source": 1,
              "name": "datasource",
              "title": "数据源",
              "href": "datasource",
              "component": "bill-design-manage/data-source.vue",
              "icon": "iconfont icon-menu",
              "sortCode": 1,
              "apis": null,
              "remark": null,
              "children": []
            },
            {
              "id": "0248C5A7E13A4E128AB74A1DCFCF68E7",
              "parentId": "D64702FF72B04CF29DC202CCD402FCEC",
              "category": 1,
              "source": 1,
              "name": "report-bi",
              "title": "Report BI",
              "href": "/report-bi",
              "component": "Main",
              "icon": "iconfont icon-menu",
              "sortCode": 1,
              "apis": null,
              "remark": null,
              "children": [{
                  "id": "B8061605B7D64A32844AF3A82A8C9F25",
                  "parentId": "0248C5A7E13A4E128AB74A1DCFCF68E7",
                  "category": 1,
                  "source": 1,
                  "name": "dateset-config",
                  "title": "数据集配置",
                  "href": "dateset-config",
                  "component": "bill-design-manage/data-set-config.vue",
                  "icon": "iconfont icon-menu",
                  "sortCode": 3,
                  "apis": null,
                  "remark": null,
                  "children": []
                },
                {
                  "id": "433599FB0E9542969DB2745268C5A290",
                  "parentId": "0248C5A7E13A4E128AB74A1DCFCF68E7",
                  "category": 1,
                  "source": 1,
                  "name": "preview-bi",
                  "title": "BI",
                  "href": "preview-bi",
                  "component": "bill-design-manage/preview-bi.vue",
                  "icon": "iconfont icon-menu",
                  "sortCode": 8,
                  "apis": null,
                  "remark": null,
                  "children": []
                }
              ]
            },
            {
              "id": "0E78529EC9AF4487A1BC21FA871A6740",
              "parentId": "D64702FF72B04CF29DC202CCD402FCEC",
              "category": 1,
              "source": 1,
              "name": "dataset",
              "title": "数据集",
              "href": "dataset",
              "component": "bill-design-manage/data-set.vue",
              "icon": "iconfont icon-menu",
              "sortCode": 2,
              "apis": null,
              "remark": null,
              "children": []
            },
            {
              "id": "49875C11E64E457E91AA4D14CF066E38",
              "parentId": "D64702FF72B04CF29DC202CCD402FCEC",
              "category": 1,
              "source": 1,
              "name": "design-report-manage",
              "title": "报表设计管理",
              "href": "design-report-manage",
              "component": "bill-design-manage/design-report-manage.vue",
              "icon": "iconfont icon-menu",
              "sortCode": 3,
              "apis": null,
              "remark": null,
              "children": []
            },
            {
              "id": "3664875E390145FFA8422B80E8AE744B",
              "parentId": "D64702FF72B04CF29DC202CCD402FCEC",
              "category": 1,
              "source": 1,
              "name": "preview-excel",
              "title": "报表Summary",
              "href": "preview-excel",
              "component": "bill-design-manage/preview-excel.vue",
              "icon": "iconfont icon-menu",
              "sortCode": 4,
              "apis": null,
              "remark": null,
              "children": []
            }
          ]
        }]
        let menuList = initNode(data.filter(o => o.name === 'bill-design-manage'));
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