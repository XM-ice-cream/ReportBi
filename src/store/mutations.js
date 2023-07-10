import {
  getNextRoute,
  routeEqual,
  getHomeRoute,
  getBreadCrumbList,
  routeHasExist,
  getRouteTitleHandled,
  getTagNavListFromLocalstorage,
  setTagNavListInLocalstorage,
  userLocalInfo,
} from "@/libs/utils";
import router from "@/router"; // resetRouter
import config from "@/config";

const {
  homeName
} = config;
const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter((item) => {
    return !routeEqual(item, route);
  });
  router.push(nextRoute);
};
export default {
  updateTipsPublic(state, payload) {
    state.tipsPublicObj.content = payload.content;
    state.tipsPublicObj.color = payload.color;
  },
  updateMenuId(state, route) {
    state.menuId = route;
  },
  updateAvatarImgPath(state, route) {
    state.avatarImgPath = route;
  },
  updateHasGetMenuInfo(state, data) {
    state.hasGetMenuInfo = data
  },
  updateAppRouter(state, route) {
    state.routeList = route
  },
  setBreadCrumb(state, route) {
    state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
  },
  setUserInfo(state, data) {
    state.roleIds = data.roleIds;
    state.systemFlag = data.systemFlag;
    state.account = data.account;
    state.isAdministrator = data.isAdministrator;
    state.userName = data.name;
    state.password = data.password;
    state.avatarImgPath = data.headIcon;
    state.phone = data.phone;
    state.email = data.email;
    state.companyIds = data.companyIds;
    state.departmentIds = data.departmentIds;
    state.id = data.id;
    state.simpleSpelling = data.simpleSpelling;
    state.vipLevel = data.vipLevel;
    state.lastPasswordChangeTime = data.lastPasswordChangeTime;
    state.superAdmin = data.superAdmin;
  },
  closeTag(state, route) {
    let tag = state.tagNavList.filter((item) => routeEqual(item, route));
    route = tag[0] ? tag[0] : null;
    if (!route) return;
    closePage(state, route);
  },
  setTagNavList(state, list) {
    let tagList = [];
    if (list) {
      tagList = [...list];
    } else tagList = getTagNavListFromLocalstorage() || [];
    if (tagList[0] && tagList[0].name !== homeName) tagList.shift();
    let homeTagIndex = tagList.findIndex((item) => item.name === homeName);
    if (homeTagIndex > 0) {
      let homeTag = tagList.splice(homeTagIndex, 1)[0];
      tagList.unshift(homeTag);
    }
    state.tagNavList = tagList;
    setTagNavListInLocalstorage([...tagList]);
  },
  addTag(state, {
    route,
    type = "unshift"
  }) {
    let router = getRouteTitleHandled(route);
    if (!routeHasExist(state.tagNavList, router)) {
      //解决router.push 影响的tagList列表重复添加
      let itemIndex = state.tagNavList.findIndex((item) => item.name === router.name);
      if (type === "push") {
        if (itemIndex < 0) {
          state.tagNavList.push(router);
        } else {
          state.tagNavList.splice(itemIndex, 1, router);
        }
      } else {
        if (router.name === homeName) state.tagNavList.unshift(router);
        else {
          if (itemIndex < 0) {
            state.tagNavList.splice(1, 0, router);
          } else {
            state.tagNavList.splice(itemIndex, 1, router);
          }
        }
      }
      setTagNavListInLocalstorage([...state.tagNavList]);
    }
  },
  setLocal(state, lang) {
    let localObj = userLocalInfo()
    localObj.local = lang;
    userLocalInfo(localObj)
    state.local = lang;
  },
  setHomeRoute(state, routes) {
    state.homeRoute = getHomeRoute(routes, homeName);
  },
  setRefreshingToken(state, boolean) {
    state.refreshingToken = boolean;
  },
  setIP(state, str) {
    state.ip = str;
  },
};