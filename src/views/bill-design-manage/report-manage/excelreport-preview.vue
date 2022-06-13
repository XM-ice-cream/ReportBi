<template>
  <div style="height:100%">
    <div class="layout">
      <Layout>
        <!-- 左侧 -->
        <Sider hide-trigger class="sider">
          <!-- 数据集管理 -->
          <div class="title">表格查询</div>
          <!-- DBlist -->
          <div class="dblist">
            <Form ref="submitReq" :label-width="80" :label-colon="true">
              <template v-for="(item,index) in tableData2">
                <span class="title" :key="index">{{item.name}}</span>
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
              <Button type="primary" @click="searchPreview(false)" style="width: 100%;">查询</Button>
            </Form>
          </div>
        </Sider>
        <!-- 中间内容excel -->
        <Content class="content">
          <div class="push_btn">
            <Tooltip class="item" effect="dark" content="导出excel" placement="bottom-start">
              <Button type="text" @click="download()">
                <Icon type="md-cloud-download" />
              </Button>
            </Tooltip>
          </div>
          <div id="luckysheetpreview" style="margin:0;padding:0;position:absolute;width:100%;height:calc(100% - 34px);left: 0;top: 0;"></div>
          <!-- <div id="luckysheetpreview"></div> -->
          <div id="excelpreview" class="data-table"></div>
          <page-custom class="excel-page" :total="params.total" :totalPage="params.totalPage" :pageIndex="params.requestCount" :page-size="params.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
          <div style="display:none"></div>
        </Content>
      </Layout>
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
        // ...this.$config.pageConfig,
      },
      jsonStr: [], // json数据
      jsonIndex: 0, // json索引
      // 验证实体
      ruleValidate: {}
    };
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
          let { setParam } = this.params;
          const jsonStr_parse = JSON.parse(res.result.jsonStr);
          const setParam_parse = JSON.parse(res.result.setParam);
          this.jsonStr = jsonStr_parse;
          console.log(jsonStr_parse);
          //第一次获取请求值
          this.initExcel(jsonStr_parse, setParam, setParam_parse, res.result);
          // 渲染表格
          //   this.getTable("excelpreview", jsonStr_parse);
        } else {
          this.$Message.error(res.message);
          this.sheetData = [{}];
          //初始化Excel
          this.createSheet();
        }
      })

    },
    //获取表格
    getTable (tableid, data) {
      let htm = "<table class='table tableScroll'>";
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
          const width = columnlen[tdIndex] || 219
          const height = rowlen[itemIndex] || 18;
          //边框
          let border = "none";
          borderInfo.forEach((borderItem, borderIndex) => {
            const { borderType, color, range } = borderItem;
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
          //   htm += "<td style='background:" + bg + ",font-weight:"+bl===1?'bold':'normal+'"'>" + v + "</td>";
          if (tdIndex + 1 === item.length) htm += "</tr>"
        })

        // if (item.c === 0) {
        //   htm += "<tr><td>" + item.v.v + "</td>"
        // } else {
        //   htm += "<td>" + item.v.v + "</td></tr>";
        // }
      })
      //   const { title, dataList } = data;



      //   //#region 渲染前两行
      //   let htm0 = "<tr>"; // 第一行html
      //   let htm1 = "<tr>";// 第二行html
      //   for (let key in title) {
      //     htm0 += "<th colspan=" + title[key].length + ">" + key + "</th>";
      //     for (let i = 0; i < title[key].length; i++) {
      //       htm1 += "<td style='background-color:#f0f3f6;color:#484848;'>" + title[key][i] + "</td>";
      //     }
      //   }
      //   htm += htm0 + "</tr>" + htm1 + "</tr>";
      //   //#endregion

      //   // 获取需要合并单元格的个数{key:num;key:num}
      //   let dataListItem = dataList.map(item => {
      //     return item[0]
      //   })
      //   dataListItem = dataListItem.reduce(function (prev, next) {
      //     prev[next] = (prev[next] + 1) || 1;
      //     return prev;
      //   }, {});

      //   let index = 0; // 合并单元格的索引
      //   let flag = false; // 是否已合并
      //   dataList.forEach((item, j) => {
      //     htm += "<tr>";

      //     // 判断是否已合并
      //     if (j === index) {
      //       index += dataListItem[item[0]];
      //       flag = true;
      //     }

      //     // 合并单元格第一列
      //     if (flag) {
      //       htm += "<td rowspan=" + dataListItem[item[0]] + ">" + item[0] + "</td>";
      //       flag = false;
      //     }

      //     // 从第二列开始显示数据
      //     for (let k = 1; k < item.length; k++) {
      //       htm += "<td>" + item[k] + "</td>";
      //     }

      //     htm += "</tr>";
      //   });


      htm += "</table>";
      console.log(htm);
      document.getElementById(tableid).innerHTML = htm;
    },
    // 初始化Excel
    initExcel (jsonStr_parse, setParam, setParam_parse, result) {
      console.log(window.luckysheet);
      this.reportName = jsonStr_parse.name;
      // 渲染查询表单
      this.tableData2 = this.getParamsList(setParam, setParam_parse);

      this.params = {
        ...this.params,
        total: jsonStr_parse[this.jsonIndex].total,
        totalPage: jsonStr_parse[this.jsonIndex].pageCount
      }
      //初始化Excel
      this.sheetData = result == null ? [{}] : jsonStr_parse;
      this.createSheet();
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
      //刷新
      //   window.luckysheet.refresh();
      //   exportExcel(luckysheet.getAllSheets(), this.params.reportCode + '-' + `${formatDate(new Date())}`)

      exportReq(this.params).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = this.params.reportCode + '-' + `${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    //初始化表格
    createSheet () {
      const options = {
        container: "luckysheetpreview", // 设定DOM容器的id
        title: "", // 设定表格名称
        lang: "zh", // 设定表格语言
        plugins: ["chart"],
        hook: {
          sheetActivate: (index) => {
            this.jsonStr.forEach((item, itemIndex) => {
              if (item.index === index) {
                this.jsonIndex = itemIndex
              }
            })
            this.params.total = this.jsonStr[this.jsonIndex].total;//总数量
            this.params.totalPage = this.jsonStr[this.jsonIndex].pageCount; //总页数
            this.params.requestCount = 1;//切换sheet 重置起始页
            this.params.sheetIndex = index;
            this.searchPreview();
          }
        },
        data: [
          {
            name: "report", //工作表名称
            color: "", //工作表颜色
            index: 0, //工作表索引
            status: 1, //激活状态
            order: 0, //工作表的下标
            hide: 0, //是否隐藏
            row: 36, //行数
            column: 18, //列数
            defaultRowHeight: 19, //自定义行高
            defaultColWidth: 73, //自定义列宽
            celldata: [], //初始化使用的单元格数据
            config: {
              merge: {}, //合并单元格
              rowlen: {}, //表格行高
              columnlen: {}, //表格列宽
              rowhidden: {}, //隐藏行
              colhidden: {}, //隐藏列
              borderInfo: {}, //边框
              authority: {} //工作表保护
            },
            scrollLeft: 0, //左右滚动条位置
            scrollTop: 315, //上下滚动条位置
            luckysheet_select_save: [], //选中的区域
            calcChain: [], //公式链
            isPivotTable: false, //是否数据透视表
            pivotTable: {}, //数据透视表设置
            filter_select: {}, //筛选范围
            filter: null, //筛选配置
            luckysheet_alternateformat_save: [], //交替颜色
            luckysheet_alternateformat_save_modelCustom: [], //自定义交替颜色
            luckysheet_conditionformat_save: {}, //条件格式
            frozen: {}, //冻结行列配置
            chart: [], //图表配置
            zoomRatio: 1, // 缩放比例
            image: [], //图片
            showGridLines: 1, //是否显示网格线
            dataVerification: {} //数据验证配置
          }
        ]
      };
      options.data = this.sheetData;
      $(function () {
        luckysheet.create(options);
        // console.log(luckysheet.getRangeValue());
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
      // 解决Jquery 版本冲突问题
      //   window.jQuery.noConflict();
    })
  }
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
</style>
<style lang="less" scoped>
.sider {
  width: 250px !important;
  min-width: 250px !important;
  max-width: 250px !important;
  flex: 0 0 250px !important;
  height: 100%;
  margin: 0 0.5rem;
  background-color: transparent;
  .title {
    width: 100%;
    height: 2rem;
    color: #1ec0d1;
    text-align: center;
    margin: 0.2rem 0;
    line-height: 2rem;
    font-weight: bold;
    font-size: 0.94rem;
  }
  .icon {
    height: 2rem;
    text-align: right;
    padding-right: 1rem;
    font-size: 1.5rem;
    line-height: 2rem;
    background: #efefef;
    color: #1ec0d1;
  }
  .dblist {
    padding: 0 5px;
    .title {
      width: 100%;
      height: 1.5rem;
      background-color: #efefef;
      text-align: center;
      display: inline-block;
      line-height: 1.5rem;
      color: #666262d9;
      border-radius: 5px;
      margin-bottom: 1rem;
    }
    .row {
      padding: 0.2rem;
      margin: 0 1.6rem 0.3rem;
    }
  }
}
.content {
  width: calc(100% - 250px);
  height: 100%;
  background-color: #fff;
  padding: 1rem;
  position: relative;
  .push_btn {
    position: absolute;
    z-index: 100;
    top: 15px;
    right: 13%;

    i {
      color: #6c6666;
      font-size: 1.12rem;
      margin-right: 0.3rem;
    }
  }
}
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
