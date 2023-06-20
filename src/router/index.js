import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import routers from './routers'
import i18n from '@/locale'
import {
  setTitle,
  userLocalInfo,
  localRead,
  localReadObject,
  sessionSave
} from '@/libs/utils'
import {
  watermarkFn
} from '@/libs/tools' //, getNowToDate

//引入安装的signalr包
// import * as signalR from '@aspnet/signalr'

Vue.use(VueRouter)
const LOGIN_PAGE_NAME = 'login'

// 消息提示判断
// const signalrTips = (vm, data) => {
//   let state = {1: 'info', 2: 'success', 3: 'warning', 4: 'error'}
//   let dialogState = state[data.dialogState]
//   if (data.dialogType === 0) {
//     const obj = {content: data.content, duration: data.duration, closable: true}
//     vm.$Message[dialogState](obj)
//   } else if (data.dialogType === 1) {
//     const obj = {title: data.title, content: data.content, duration: data.duration}
//     vm.$Message[dialogState](obj)
//   } else if (data.dialogType === 2) vm.$router.go(0)
//   else {
//     vm.$Modal.confirm({
//       title: data.title, content: data.content, duration: data.duration,
//       onOk: () => {
//         vm.$router.go(0)
//       }
//     })
//   }
// }

// 导入路由数据
const routes = [
  ...routers
]

//创建路由对象
const createRoute = () => new VueRouter({
  // mode: 'history',
  routes
})

const router = createRoute()

export function resetRouter() {
  const newRouter = createRoute()
  router.matcher = newRouter.matcher // reset router
}

// 前置守卫
router.beforeEach((to, form, next) => {
  let vm = router.app
  //清空所有msg提示
  vm.$Message.destroy()
  vm.$Loading.start()
  // 判断是否进入检测 vm.$config.nameList 等页面
  if (vm.$config.nameList.includes(to.name)) {
    //解决公共报表 页面不带token问题
    let userInfo = localReadObject(localRead("currentUser") + 'Obj');
    sessionSave("userName", userInfo.userName);
    sessionSave("password", userInfo.password);
    next()
  }
  // 判断是否登录
  else if (!userLocalInfo().token) {
    // 未登录
    if (to.name !== LOGIN_PAGE_NAME) {
      // 要跳转的页面不是登录页面
      next({
        replace: true,
        name: LOGIN_PAGE_NAME
      })
      vm.$Loading.finish()
    } else next()
  } else {
    // 已登录
    let locked = userLocalInfo().locked || 0
    if (locked === 1 && to.name !== 'locking') {
      next({
        replace: true,
        name: 'locking'
      })
      vm.$Loading.finish()
      vm.$Message.warning({
        content: `${i18n.t('unlockTipsPwd')}`,
        duration: 3
      })
    } else if (to.name === LOGIN_PAGE_NAME) {
      // 要跳转的页面是登录页
      next({
        replace: true,
        name: vm.$config.homeName
      }) // 跳转到homeName页
      vm.$Loading.finish()
    } else {
      const errorPageName = ['error-500', 'error-401', 'error-404', ]
      // 菜单导航是否获取
      if (store.state.hasGetMenuInfo) {
        // 是否注册实时通讯
        // if (!vm.$signalr) {
        //   let signal = new signalR.HubConnectionBuilder()
        //     //服务器地址
        //     .withUrl(`${window.localStorage.getItem("configip")}/BaizeHub/Notify`, {
        //       accessTokenFactory: () => userLocalInfo().token,
        //     })
        //     .build()
        //   Vue.prototype.$signalr = signal
        // }
        // // 启动实时通讯
        // if (vm.$signalr.state === 0) {
        //   vm.$signalr.start().then(() => {
        //     vm.$Message.success(`${i18n.t('linkServerSuccess')}`)
        //   }).catch(() => {
        //     vm.$Message.warning(`${i18n.t('linkServerError')}`)
        //   })
        //   // 解绑事件
        //   vm.$signalr.off('public')
        //   // vm.$signalr.off(store.state.id)
        //   // 接受所有消息
        //   vm.$signalr.on('public', data => signalrTips(vm, data))
        //   // 接受个人消息
        //   // vm.$signalr.on(store.state.id, data => {
        //   //   if (data.messageType === 4) {
        //   //     // 验证账号是否被登录
        //   //     let introspect = () => {
        //   //       if (userLocalInfo().token) {
        //   //         setTimeout(() => {
        //   //           store.dispatch('handleIntrospect', vm).then(() => { })
        //   //         }, 500)
        //   //       } else {
        //   //         setTimeout(() => {
        //   //           introspect()
        //   //         }, 1000)
        //   //       }
        //   //     }
        //   //     introspect()
        //   //   }
        //   // })
        // }
        // 判断是否有权限跳转该页面
        const menu = store.getters.allRouteList.find(x => x.name === to.name)
        if (menu) next()
        else next({
          name: 'error-404'
        })
      } else if (!errorPageName.includes(to.name)) {
        store.commit('setUserInfo', userLocalInfo().userInfo)
        store.dispatch('handleIP').then(() => {})
        // 获取导航菜单信息
        store.dispatch('handleGetLeftMenuList').then(() => {
          store.state.routeList.forEach(item => router.addRoute(item))
          const menu = store.getters.allRouteList.find(x => to.path.split('/')[2] === x.name)
          if (menu) store.commit('updateMenuId', userLocalInfo().mId)
          next({
            replace: true,
            ...to
          })
        }).catch((err) => {
          const tipContent = err.status === 0 ? i18n.t('errNetwork') : i18n.t('loginTips3')
          vm.$Message.warning({
            content: `${tipContent}`,
            duration: 0,
            closable: true
          })
          store.dispatch('handleLogOut').then(() => {})
          next({
            name: LOGIN_PAGE_NAME
          })
        })
      } else next()
    }
  }
})

// 后置钩子
router.afterEach((to) => {
  let vm = router.app
  // 设置页面名称
  setTitle(to, vm)
  vm.$Loading.finish();
  // 添加水印
  watermarkFn(to.meta.watermarkRemove || store.state.userName)
})
//解决报错 ncaught (in promise) Error: Redirected when going from "/secs-equipment" to "/secs-eqp-detail" via a navigation guard.
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
export default router