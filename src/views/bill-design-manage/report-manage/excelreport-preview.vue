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
              <Form ref="submitReq" :label-width="100" :label-colon="true">
                <template v-for="(item,index) in tableData2">
                  <span class="title" :key="index">{{item.title}}</span>
                  <template v-for="(subitem,subindex) in item.children">
                    <FormItem :label='subitem.name' :key="subindex+'sub'">
                      <Input type="text" v-model="subitem.value" />
                    </FormItem>
                  </template>
                </template>
                <Button type="primary" @click="searchPreview()" style="width: 90%;margin-left: 25px;">查询</Button>
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
import { getExcelPreviewReq } from '@/api/bill-design-manage/report-manage.js'
import draggable from "vuedraggable";
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
          console.log(this.visib, this.reportCode);
          this.searchPreview();
        })
      }
    }
  },
  data () {
    return {
      options: {},
      sheet: {},
      reportId: null,
      reportName: null,
      dataSet: null,
      tableData2: [],
      excelData: {},
      params: {
        reportCode: "",
        setParam: ""
      }

    };
  },
  methods: {
    async searchPreview () {
      const arr = this.toObject(this.tableData2);
      this.params.setParam = JSON.stringify(arr);
      //每次都重新加载需要改成刷新
      this.preview();
    },
    async preview () {
      this.excelData = {};
      this.params.reportCode = this.reportCode;
      console.log(this.params);
      const { code, result } = await getExcelPreviewReq(this.params);

      if (code != 200) return;
      this.reportName = JSON.parse(result.jsonStr).name;
      // 渲染查询表单
      this.params.setParam = JSON.parse(result.setParam);
      const extendArry = [];
      const extendObj = this.params.setParam;
      for (const i in extendObj) {
        const children = [];
        for (const y in extendObj[i]) {
          children.push({ name: y, value: extendObj[i][y] });
        }
        extendArry.push({ name: i, children: children });
      }
      this.tableData2 = extendArry;

      this.excelData = result.jsonStr;
      this.sheetData = result == null ? [{}] : JSON.parse(result.jsonStr);
      console.log(this.excelData, result == null)
      console.log(this.sheetData)
      this.createSheet();
    },
    async download (val) {
      const result = {};
      result["reportCode"] = this.reportCode;
      result["setParam"] = JSON.stringify(this.params.setParam);
      if (val != "") {
        result["exportType"] = val;
      }
      const { code, message } = await exportExcel(result);
      if (code != 200) return;
      this.$Message.success(message);
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
      // console.log(this.sheetData)
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
