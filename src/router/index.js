import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import routers from './routers'
import i18n from '@/locale'
import {
  localRead,
  localSave,
  sessionSave,
  setTitle,
  userLocalInfo
} from '@/libs/utils'
import {
  watermarkFn
} from '@/libs/tools' //, getNowToDate

//引入安装的signalr包
// import * as signalR from '@aspnet/signalr'

Vue.use(VueRouter)

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
  // 判断是否登录
  if (Object.keys(to.query).includes('localObj')) {
    const localObj = JSON.parse(to.query.localObj)
    sessionSave('userName', localObj.userName)
    localSave('configip', to.query.configip)
    localSave('reportip', to.query.reportip)
    localSave('projectVersion', to.query.projectVersion)
    localSave('reportDesignIp', to.query.reportDesignIp)
    localSave('isFirst', true)
    const toName = to.path.split('/')[2]
    localObj.tagNavList = [{
      name: 'home',
      meta: {
        hideInMenu: true,
        icon: "iconfont icon-home",
        notCache: true,
        title: "首页",
      },
      params: {},
      query: {},
    }]
    userLocalInfo(localObj)
    next({
      replace: true,
      name: toName
    })
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
        //   // 接受所有消息
        //   vm.$signalr.on('public', data => signalrTips(vm, data))
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
          if (menu) store.commit('updateMenuId', menu.id)
          if (localRead('isFirst') === 'true') {
            localSave('isFirst', false)
            setTimeout(() => window.location.reload(), 500)
          }
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
            name: 'error-500'
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
  vm.$Loading.finish()
  // 添加水印
  watermarkFn(to.meta.watermarkRemove || store.state.userName)
})

export default router