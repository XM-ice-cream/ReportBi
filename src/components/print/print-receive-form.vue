<template>
  <div class="printPage" style="display: none;">
    <table
        style="width: 100%;border-collapse:collapse;border-spacing:0;table-layout: fixed;word-break: break-all;margin: 0 auto;font-size: 12px;">
      <caption style="margin-bottom: 10px;">
        <div style="display: flex;flex-wrap: wrap;justify-content: space-around;">
          <div v-for="(item, i) in Object.keys(printObj.captionObj)" :key="i">
            {{ `${$t(item)}: ${printObj.captionObj[item]}` }}
          </div>
        </div>
      </caption>
      <thead>
      <tr>
        <th style="width: 30px;"></th>
        <th :style="{width: printObj.printStyle[item] || ''}" v-for="(item, i) in printObj.headData" :key="i">
          {{ $t(item) }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in printObj.printData" :key="i">
        <td>{{ i + 1 }}</td>
        <td v-for="(itemKey, itemI) in printObj.headData" :key="itemI">{{ item[itemKey] }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "print-receive-form",
  props: {
    printObj: {
      type: Object,
      default: () => {
      }
    },
  },
  methods: {
    // 获取打印代码
    printClick() {
      this.$nextTick(() => {
        let printStr = `<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                          <title>${this.printObj.title}</title></head><body >`
        let content = ''
        // 获取需要打印的页面元素 ，page1元素设置样式page-break-after:always，意思是从下一行开始分割
        let strArr = document.getElementsByClassName('printPage')
        for (let item of strArr) {
          // 添加td的样式
          for (let dom of item.getElementsByTagName('th')) {
            dom.style.border = '1px solid #000'
            dom.style.textAlign = 'left'
          }
          // 添加td的样式
          for (let dom of item.getElementsByTagName('td')) {
            dom.style.border = '1px solid #000'
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