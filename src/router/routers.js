import Main from '@/components/main'

// 其他页面路由模块
const otherRouter = [
  {
    path: '/',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: 'home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true,
        icon: 'iconfont icon-home'
      },
      component: () => import( /* webpackChunkName: "home" */ '@/views/other-page/home')
    }]
  },
  {
    path: '/locking',
    name: 'locking',
    meta: {
      hideInMenu: true,
      notCache: true
    },
    component: () => import( /* webpackChunkName: "locking" */ '@/components/main/components/lockscreen/components/locking-page.vue')
  },
  {
    path: '/oee',
    name: 'oee',
    meta: {
      hideInMenu: true,
      notCache: true
    },
    component: () => import( /* webpackChunkName: "oee-dataInput" */ '@/views/report-manager/oee-dataInput.vue')
  },
  {
    path: '/oeepie',
    name: 'oeepie',
    meta: {
      hideInMenu: true,
      notCache: true
    },
    component: () => import( /* webpackChunkName: "oee-pie" */ '@/views/report-manager/oee-pie.vue')
  },
]

// 错误页面路由模块
export const errorRouter = [
  {
    path: '/401',
    name: 'error-401',
    meta: {
      title: '401',
      hideInMenu: true
    },
    component: () => import( /* webpackChunkName: "error-401" */ '@/views/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error-500',
    meta: {
      title: '500',
      hideInMenu: true
    },
    component: () => import( /* webpackChunkName: "error-500" */ '@/views/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error-404',
    meta: {
      title: '404',
      hideInMenu: true
    },
    component: () => import( /* webpackChunkName: "error-404" */ '@/views/error-page/404.vue')
  },
]

export default [
  ...otherRouter
]
