//引入安装的signalr包
import * as signalR from '@aspnet/signalr'
import {localRead, userLocalInfo} from "@/libs/utils"
let signal = new signalR.HubConnectionBuilder()
  //服务器地址
  .withUrl(`${localRead("configip")}/BaizeHub/Notify`, {
    accessTokenFactory: () => userLocalInfo().token,
  })
  .build()

//  自动重连
//  async function start () {
//   try {
//     await signal.start()
//   } catch (err) {
//     setTimeout(() => start(), 5000)
//   }
// }
//
// signal.onclose(async () => {
//   await start()
// })

//将创建的signal赋值给Vue实例
export default {
  // install方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
  install: function (Vue) {
    Vue.prototype.$signalr = signal
  }
}