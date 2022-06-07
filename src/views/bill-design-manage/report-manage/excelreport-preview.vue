<template>
  <div class="page-style excel-preview">
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="submitReq" :label-width="80" :label-colon="true">
                    <template v-for="(item) in tableData2">
                      <template v-for="(subitem,subindex) in item.children">
                        <FormItem :label='subitem.name' :key="item.name+subindex" :prop='item.name+subitem.name' :rules="subitem.required == 1?  [{ required: true,message:'必填项' }]: [{ required: false }]">
                          <!-- 字符串 -->
                          <Input v-if="subitem.type==='String'" type="text" v-model.trim="subitem.value" clearable />
                          <!-- 布尔 true/false/0/1-->
                          <RadioGroup v-else-if="subitem.type==='Boolean'&&['true','false','0','1'].includes(subitem.value)" v-model="subitem.value">
                            <template v-if="['true','false'].includes(subitem.value)">
                              <Radio label="true">true</Radio>
                              <Radio label="false">false</Radio>
                            </template>
                            <template v-if="['0','1'].includes(subitem.value)">
                              <Radio label="0">0</Radio>
                              <Radio label="1">1</Radio>
                            </template>
                          </RadioGroup>
                          <!-- 数组 -->
                          <Input v-else-if="subitem.type==='Array'" type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model.trim="subitem.value" clearable />
                          <!-- 时间 -->
                          <DatePicker v-else-if="subitem.type==='DateTime'" v-model="subitem.value" transfer type="datetime" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" clearable></DatePicker>
                          <!-- 其余类型 -->
                          <Input v-else v-model.trim="subitem.value" type="text" clearable />
                        </FormItem>
                      </template>
                    </template>
                    <FormItem>
                      <Button type="primary" @click="searchPreview(false)">查询</Button>
                    </FormItem>

                  </Form>
                </div>
              </Poptip>
            </i-col>
          </Row>
        </div>
        <div id="excelpreview" class="data-table" :style="{height:params.height+'px'}"></div>
        <page-custom class="excel-page" :total="params.total" :totalPage="params.totalPage" :pageIndex="params.requestCount" :page-size="params.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
    <img :src="require('../../../assets/images/loading.gif')" v-if="loading" class="loading-img" />

  </div>
</template>

<script>
import { getExcelPreviewReq, exportReq } from '@/api/bill-design-manage/report-manage'
import draggable from "vuedraggable";
import { exportFile, formatDate } from "@/libs/tools";

export default {
  name: "excelreport-preview",
  components: { draggable },
  data () {
    return {
      intervalData: '',
      options: {},
      sheet: {},
      sheetData: [],
      reportId: null,
      reportName: null,
      dataSet: null,
      tableData2: [],
      loading: false,
      reportCode: '',
      params: {
        reportCode: "",
        setParam: "",
        pageSize: 30, // 每页显示数
        requestCount: 1, // 当前页
        orderField: 'CREATEDATE', // 排序字段
        ascending: false, // 排序类型true升序 false降序
        total: 0, //  总条数
        totalPage: 0, //  总页数,
        sheetIndex: '',//sheet 当前激活索引
        height: "120",//表格高度
        // ...this.$config.pageConfig,
      },
      jsonStr: [], // json数据
      jsonIndex: 0, // json索引
      // 验证实体
      ruleValidate: {},
      searchPoptipModal: false,
    };
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    async searchPreview (flag = true) {

      if (!flag) this.params.requestCount = 1;  // 点击查询按钮

      this.dateFormate();  // 左侧查询参数--时间格式化 

      //左侧查询参数 --必要参数接收
      const arr = this.toObject(this.tableData2)
      this.params.setParam = JSON.stringify(arr)

      this.sheetData = [{}] //表格数据
      window.luckysheet.destroy() //销毁

      this.intervalPreview()  //每次都重新加载需要改成刷新
    },
    async intervalPreview () {
      this.loading = true;
      await getExcelPreviewReq(this.params).then(res => {
        if (res.code === 200) {
          this.loading = false;
          let { jsonStr, setParam } = res.result;
          jsonStr = JSON.parse(jsonStr);
          // 查询参数
          this.tableData2 = this.getParamsList(this.params.setParam, JSON.parse(setParam));
          this.params = {
            ...this.params,
            total: jsonStr[this.jsonIndex].total,
            totalPage: jsonStr[this.jsonIndex].pageCount
          }
          // 渲染表格
          this.getTable("excelpreview", jsonStr);
        } else {
          this.$Message.error(res.message);
          this.sheetData = [{}];
          //初始化Excel
          this.createSheet();
        }
        this.searchPoptipModal = false;
      })

    },
    //获取表格
    getTable (tableid, data) {
      let htm = "<table class='table tableScroll' id='exceltable'>";
      const { celldata, config } = data[0];
      //处理数据,将同一行为一组数据
      let result = [];
      celldata.forEach(item => {
        if (!result[item.r]) result[item.r] = [];
        result[item.r].push(item)
      })
      result.forEach((item, itemIndex) => {
        htm += "<tr>";
        item.forEach((tdItem, tdIndex) => {
          //   console.log(tdItem);
          const { v, bg, bl, fc, ht, vt, mc, fs } = tdItem.v; //获取样式
          const { columnlen, rowlen, borderInfo } = config;//
          let style = "";
          //   宽高
          const width = columnlen ? columnlen[tdIndex] : 219
          const height = rowlen ? rowlen[itemIndex] : 18;
          //边框
          let border = "none";
          borderInfo?.forEach((borderItem, borderIndex) => {
            const { borderType, color, range, rangeType } = borderItem;
            if (rangeType === "range") {
              //列号在范围内
              const columnRang = (range[0].column[0] <= tdIndex) && (range[0].column[1] >= tdIndex);
              //行号在范围内
              const rowRang = (range[0].row[0] <= itemIndex) && (range[0].row[1] >= itemIndex);
              if (borderType === "border-all" && columnRang && rowRang) {
                border = `1px solid ${color}`;
              }
              if (borderType === "border-none" && columnRang && rowRang) {
                border = "none";
              }
            }
          })
          if (bg) style += `background:${bg};`;//背景颜色
          if (bl) style += `font-weight:${bl == 1 ? 'bold' : 'normal'};`; //字体粗细
          if (fc) style += `color:${fc};`;//字体颜色
          if (ht) style += `text-align:${ht == 0 ? 'center' : (ht == 2 ? 'right' : 'left')};`;//水平居中 0:居中;1:居左;2:居右
          if (vt) style += `verticle-align:middle;`;//垂直居中
          if (fs) style += `font-size:${fs}px;`;//文字大小
          style += `width:${width}px;height:${height}px;`;//宽高
          style += `border:${border};`;//边框



          htm += `<td style="${style}" colspan="${mc?.cs || 1}" rowspan="${mc?.rs || 1}">${v}</td>`
          if (tdIndex + 1 === item.length) htm += "</tr>"
        })
      })


      htm += "</table>";
      document.getElementById(tableid).innerHTML = htm;
    },
    //获取查询参数 并获得参数类型及是否必填
    getParamsList (setParam, setParam_parse) {
      const extendObj = setParam = setParam_parse;
      const extendArry = [];
      for (const i in extendObj) {
        const children = [];
        for (const y in extendObj[i]) {
          if (!y.endsWith('required') && !y.endsWith('type')) {
            children.push({ name: y, value: extendObj[i][y], type: extendObj[i][y + 'type'], required: extendObj[i][y + 'required'] });
            this.ruleValidate[i + y] = [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }];
          }
        }
        extendArry.push({ name: i, children: children });
      }
      return extendArry;
    },

    // Excel导出
    async download () {
      exportReq(this.params).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = this.params.reportCode + '-' + `${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    //时间格式化
    dateFormate () {
      this.tableData2.forEach((item, itemIndex) => {
        item.children.forEach((o, oIndex) => {
          if (o.type === 'DateTime') {
            this.tableData2[itemIndex].children[oIndex].value = formatDate(o.value)
          }
        })
      })
    },
    // 表单封装json
    toObject (val) {
      const objfirst = {}
      const objSecond = {}
      val.forEach(el => {
        el.name ? (objfirst[el.name] = el.children) : ""
      });
      for (const key in objfirst) {
        const newObj = {};
        objfirst[key].map(ev => {
          Object.assign(newObj, { [ev.name]: ev.value, [ev.name + 'required']: ev.required, [ev.name + 'type']: ev.type })
        });
        objSecond[key] = newObj
      }
      return objSecond
    },
    // 自动改变表格高度
    autoSize () {
      this.params.height = document.body.clientHeight - 120;
      console.log("this.params.height", this.params.height);
    },
    // 选择第几页
    pageChange (index) {
      this.params.requestCount = index
      this.searchPreview()
    },
    // 选择一页几条数据
    pageSizeChange (index) {
      this.params.requestCount = 1
      this.params.pageSize = index
      this.searchPreview()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.reportCode = this.$route.query.reportCode;
      this.params.reportCode = this.reportCode;
      this.loading = true;
      this.tableData2 = [];
      this.searchPreview();
      this.autoSize();
      window.addEventListener('resize', () => this.autoSize());
      // 解决Jquery 版本冲突问题
      //   window.jQuery.noConflict();
    })
  },
  // 销毁luckysheet
  // window.luckysheet.destroy();
}
</script>
 <style src="../../../../public/luckysheet/assets/iconfont/iconfont.css" />
<style>
@import "../../../assets/table.less";
.luckysheet-input-box {
  z-index: 1000;
}

#luckysheet-pivotTableFilter-byvalue-select .ListBox {
  min-height: 150px !important;
}
.luckysheet-modal-controll-btn {
  height: 20px;
  width: 20px;
  padding: 0;
  text-align: center;
  font-size: 0.01rem !important;
}
.ivu-modal-mask,
.ivu-modal-wrap {
  z-index: 910 !important;
}
.excel-preview .card-style {
  padding: 1rem;
}
</style>
<style lang="less" scoped>
.loading-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/deep/.ivu-modal-fullscreen .ivu-modal-body {
  width: 100%;
  overflow: auto;
  position: absolute;
  top: 43px;
  bottom: 43px;
  right: 0;
  left: 0;
  padding: 0;
}
/deep/.layout,
.ivu-layout {
  height: 100%;
  background: #fff;
}
/deep/.ivu-collapse-simple {
  border-top: none;
}
/deep/.luckysheet-stat-area {
  background: transparent;
}
/deep/.luckysheet {
  border-top: none;
}
/deep/.luckysheet-share-logo {
  display: none;
}
.tableModal {
  /deep/ .ivu-modal {
    width: 600px !important;
  }
}
/deep/ #luckysheet-row-count-show {
  width: 1.2rem !important;
}
.excel-page {
  width: 98%;
  position: absolute;
  bottom: 8px;
  z-index: 9999;
}
</style>
