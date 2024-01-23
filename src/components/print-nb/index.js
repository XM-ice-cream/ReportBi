import QRcodeCome from './qr-code.vue'
import PrintCom from './print.vue'
import PrintButtonCom from './print-button.vue'
export default {
  install: Vue => {
    Vue.component('QRcodeCom', QRcodeCome)
    Vue.component('PrintCom', PrintCom)
    Vue.component('PrintButtonCom', PrintButtonCom)
  }
}