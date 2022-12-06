import Main from '@/components/main'

// 其他页面路由模块
const otherRouter = [{
    path: '/bill-design-manage/excelreport-preview',
    name: 'excelreport-preview',
    meta: {
      title: 'Excel - 预览',
      hideInMenu: true,
      notCache: true
    },
    component: () => import( /* webpackChunkName: "/excelreport-preview" */ '@/views/bill-design-manage/report-manage/excelreport-preview.vue')
  }, {
    path: '/bill-design-manage/excelreport-design',
    name: 'excelreport-design',
    meta: {
      title: 'Excel - 设计',
      hideInMenu: true,
      notCache: true
    },
    component: () => import( /* webpackChunkName: "excelreport-design" */ '@/views/bill-design-manage/report-manage/excelreport-design.vue')
  }, {
    path: '/bill-design-manage/screenreport-preview',
    name: 'screen-preview',
    meta: {
      title: '大屏 - 预览',
      hideInMenu: true,
      notCache: true
    },
    component: () => import( /* webpackChunkName: "screenreport-preview" */ '@/views/bill-design-manage/report-manage/screenreport-preview.vue')
  },
  {
    path: '/bill-design-manage/screenreport-design',
    name: 'screen-design',
    meta: {
      title: '大屏 - 设计',
      hideInMenu: true,
      notCache: true
    },
    component: () => import( /* webpackChunkName: "screenreport-design" */ '@/views/bill-design-manage/report-manage/screenreport-design.vue')
  },
  {
    path: '/bill-design-manage/paperless-preview',
    name: 'paperless-preview',
    meta: {
      title: '无纸化表单 - 审核',
      hideInMenu: true,
      notCache: true
    },
    component: () => import( /* webpackChunkName: "paperless-preview" */ '@/views/bill-design-manage/paperless/paperless-preview.vue')
  },
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
    path: '/userInfo',
    name: 'userInfo',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [{
      path: 'user-info',
      name: 'user-info',
      meta: {
        icon: 'iconfont icon-person',
        title: '个人档案'
      },
      component: () => import( /* webpackChunkName: "user-info" */ '@/views/other-page/userInfo/user-info.vue')
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
export const errorRouter = [{
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