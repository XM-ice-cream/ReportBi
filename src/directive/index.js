import focus from './module/focus'
import clickOutside from './module/click-outside'

const importDirective = Vue => {
  /**
   * 拖拽指令 v-focus="options"
   * options = true|false 是否聚焦
   */
  Vue.directive('focus', focus)
  // 点击当前节点之外的其他节点响应
  Vue.directive('click-outside', clickOutside)
}

export default importDirective