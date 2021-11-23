import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import i18n from '@/locale'
import config from '@/config' // 全局自定义配置
import importDirective from '@/directive' // 注册自定义指令
import importPlugins from '@/plugin' // 注册全局自定义组件、第三方插件
import importFilters from '@/filters' // 注册全局自定义过滤器
import { enterTriggerTab,inhibitingInput } from "@/libs/tools";
import * as publicApi from "@/api/public";
import '@/index.less'
import '@/assets/iconfont/iconfont.css'
import animate from 'animate.css'

Vue.use(animate);

// 注册全局组件
Vue.use(ViewUI, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value)
})
importPlugins(Vue)

// 注册全局过滤器
importFilters(Vue)

/**
 * 注册全局指令
 */
importDirective(Vue)

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.$triggerTab = enterTriggerTab
Vue.prototype.$inhibitingInput = inhibitingInput
Vue.prototype.$publicApi = publicApi
Vue.prototype.$Msg = {
  error: (content) => {
    Vue.prototype.$Message.error({
      content: content.replace(/\n/g, "<br/>"),
      duration: config.tipTime,
      closable: true,
    });
  },
  warning: (content) => {
    Vue.prototype.$Message.warning({
      content: content,
      duration: config.tipTime,
      closable: true,
    });
  },
}

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = true

/**
 * @description 添加版本号控制
 */
const version = process.env.VERSION
const localVersion = localStorage.getItem('projectVersion')

if(!localVersion || version !== localVersion) {
  localStorage.setItem('projectVersion',process.env.VERSION)
}

// 创建vue对象
window.$Vue = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
