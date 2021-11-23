<template>
  <div class="printPage" style="display: none;">
    <div style="page-break-after: always;" v-for="(item, index) in printObj.printData" :key="index">
      <table style="text-align: center;border-collapse:collapse;border-spacing:0;word-break: break-all;margin: 0 auto;font-size: 14px;">
        <caption style="border: 2px solid #000;border-bottom: none;font-weight: bold;">{{printObj.title}}</caption>
        <tbody>
          <tr v-for="itemKey in Object.keys(item)" :key="itemKey">
            <td style="width: 110px;text-align: left;" :colspan="printObj[`${itemKey}ColSpan`] || 0">{{ `${$t(itemKey)}: ${printObj[`${itemKey}ColSpan`] ? item[itemKey] : ''}` }}</td>
            <td style="width: 215px;" :style="printObj.addStyle.includes(itemKey) ? printObj.printStyle : {}" v-show="!printObj[`${itemKey}ColSpan`]">{{ item[itemKey] }}</td>
          </tr>
        </tbody>
      </table>
      <div style="display: flex;justify-content: space-between;width: 350px;margin: 30px auto 0;font-weight: bold;">
        <span>{{$t('backHoursConfirm')}}</span>
        <span>{{$t('scrapConfirm')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "print-solderPaste-glue",
  props: {
    printObj: {
      type: Object,
      default: () => {}
    },
  },
  methods: {
    // 获取打印代码
    getPrintCode() {
      this.$nextTick(() => {
        let printStr = `<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                          <title>${this.printObj.title}</title></head><body >`
        let content = ''
        // 获取需要打印的页面元素 ，page1元素设置样式page-break-after:always，意思是从下一行开始分割
        let strArr = document.getElementsByClassName('printPage')
        for (let item of strArr) {
          // 添加td的样式
          for (let dom of item.getElementsByTagName('td')) {
            dom.style.height = '23px'
            dom.style.fontWeight = 'bold'
            dom.style.border = '2px solid #000'
          }
          content += item.innerHTML // 获取需要打印的页面元素
        }
        printStr = printStr + content + '</body></html>'
        let pWin = window.open() // 如果是本地测试，需要先新建Print.htm，如果是在域中使用，则不需要
        pWin.document.innerHTML = ''
        pWin.document.write(printStr)
        pWin.document.close() // 这句很重要，没有就无法实现
        pWin.print()
      })
    },
  }
}
</script>