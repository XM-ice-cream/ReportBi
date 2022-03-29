<template>
  <div>
    <Modal title="Excel 预览" :mask-closable="false" :closable="true" v-model="visib" fullscreen :z-index='850' :before-close="closeDialog">
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
                    <FormItem :label='subitem.name' :key="subindex+'sub'">
                      <Input type="text" v-model.trim="subitem.value" v-if="subitem.type!=='DateTime'" />
                      <DatePicker v-else v-model="subitem.value" transfer type="datetime" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"></DatePicker>
                    </FormItem>
                  </template>
                </template>
                <Button type="primary" @click="searchPreview()" style="width: 100%;">查询</Button>
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
            <div id="luckysheetpreview" style="margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 0px;"></div>
            <div style="display:none"></div>
          </Content>
        </Layout>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button @click="closeDialog">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getExcelPreviewReq, exportReq } from '@/api/bill-design-manage/report-manage.js'
import draggable from "vuedraggable";
import { exportFile, formatDate } from "@/libs/tools";
export default {
  name: "excelreport-preview",
  components: { draggable },
  props: {
    visib: {
      required: true,
      type: Boolean,
      default: false
    },
    reportCode: {
      required: false,
      type: String,
    }
  },
  watch: {
    visib () {
      if (this.visib) {
        this.$nextTick(() => {
          this.params.reportCode = this.reportCode;
          this.searchPreview();
        })
        return;
      }

    }
  },
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
      params: {
        reportCode: "",
        setParam: "",
        requestCount: 1,
        pageSize: 10000
      }

    };
  },
  methods: {
    async searchPreview () {
      this.tableData2.forEach((item, itemIndex) => {
        item.children.forEach((o, oIndex) => {
          if (o.type === 'DateTime') {
            this.tableData2[itemIndex].children[oIndex].value = formatDate(o.value)
          }
        })
      })
      //重置
      const arr = this.toObject(this.tableData2);
      console.log(arr, this.tableData2);
      this.params.setParam = JSON.stringify(arr);
      this.params.requestCount = 1;//初始化请求次数为1
      this.sheetData = [];

      //每次都重新加载需要改成刷新
      this.intervalPreview()
      //   this.intervalData = setInterval(() => {
      //     this.intervalPreview();
      //   }, 1000 * 30)
    },
    async intervalPreview () {
      await getExcelPreviewReq(this.params).then(res => {
        if (res.code == 200) {
          const { result } = res;
          const jsonStr_parse = JSON.parse(result.jsonStr);
          const setParam_parse = JSON.parse(result.setParam);
          let { setParam, requestCount, pageSize } = this.params
          if (requestCount > 10) {
            console.log(requestCount, '取消');
            //取消循环
            return;
          }
          //第一次获取请求值
          if (requestCount === 1) {
            this.reportName = jsonStr_parse.name;
            // 渲染查询表单
            const extendObj = setParam = setParam_parse;
            const extendArry = [];
            for (const i in extendObj) {
              const children = [];
              for (const y in extendObj[i]) {
                const data = extendObj[i][y];
                const type = (isNaN(data) && !isNaN(Date.parse(data))) ? 'DateTime' : 'String';
                children.push({ name: y, value: extendObj[i][y], type });
              }
              extendArry.push({ name: i, children: children });
            }
            this.tableData2 = extendArry;
            this.sheetData = result == null ? [{}] : jsonStr_parse;
            //初始化Excel
            this.createSheet();
            //继续获取excel数据
            this.params.requestCount = requestCount + 1;
            // this.intervalPreview();
          } else {
            console.log('jsonStr_parse', jsonStr_parse);
            // jsonStr_parse.forEach((item, index) => {
            //   console.log(item.celldata);
            // //   item.celldata?.forEach(o => {
            // //     o.r = o.r + (requestCount - 1) * pageSize;
            // //     o.t = "v";
            // //     o.i = "Sheet_o83W674a36gA_1648100608524";
            // //     // this.sheetData[index].celldata.push({ ...o });
            // //   })
            // })
            // luckysheet.setRangeValue(jsonStr_parse, { range: "A1:B2" })
            //继续获取excel数据
            this.params.requestCount = requestCount + 1;
            this.intervalPreview();
            console.log(' this.sheetData', this.sheetData, requestCount);
          }

        }
      })

    },
    async download () {
      const { reportCode, setParam } = this.params
      const obj = {
        reportCode,
        setParam
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = reportCode + '-' + `${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    // 表单封装json
    toObject (val) {
      const objfirst = {};
      const objSecond = {};
      val.forEach(el => {
        el.name ? (objfirst[el.name] = el.children) : "";
      });
      for (const key in objfirst) {
        const newObj = {};
        objfirst[key].map(ev => {
          Object.assign(newObj, { [ev.name]: ev.value });
        });
        objSecond[key] = newObj;
      }
      return objSecond;
    },
    //初始化表格
    createSheet () {
      const options = {
        container: "luckysheetpreview", // 设定DOM容器的id
        title: "", // 设定表格名称
        lang: "zh", // 设定表格语言
        plugins: ["chart"],
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
      });
    },
    //关闭弹框
    closeDialog () {
      this.$emit('update:visib', false);
    },
  },
  mounted () {


  }
};
</script>
<style>
.luckysheet-input-box {
  z-index: 1000;
}
</style>
<style lang="less" scoped>
.sider {
  width: 250px !important;
  min-width: 250px !important;
  max-width: 250px !important;
  flex: 0 0 250px !important;
  height: 100%;
  //   border: 2px solid #3d85c6;
  margin: 0 0.5rem;
  /* padding: 0 0.5rem; */
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
      /* margin: 0 auto; */
      /* margin-left: 10%; */
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

/deep/.ivu-modal-fullscreen .ivu-modal-body {
  width: 100%;
  overflow: auto;
  position: absolute;
  top: 43px;
  bottom: 43px;
  right: 0;
  left: 0px;
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
</style>
