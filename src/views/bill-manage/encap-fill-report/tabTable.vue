<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="24">
              <button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table
          :border="tableConfig.border"
          :highlight-row="tableConfig.highlightRow"
          :max-height="tableConfig.height"
          :columns="columns"
          :data="data"
        >
        </Table>
        <BarEncapFill
          ref="barEncapFill"
          style="width: 900px; height: 420px"
          :data="barData"
          index="lineEncapFill"
        />
      </Card>
    </div>
    <encapFillScrapDetail :isShow.sync="isShow" :paramData="wipJson" />
    <encapFillDamDetail :isShowDam.sync="isShowDam" :paramData="wipJson" />
    <encapFillEqp :isShowEqp.sync="isShowEqp" :paramData="wipJson" />
  </div>
</template>

<script>
import { byLineExportReq } from "@/api/bill-manage/encap-fill-report";
import { exportFile, formatDate } from "@/libs/tools";
import BarEncapFill from "@/components/echarts/bar-encap-fill.vue";
import encapFillScrapDetail from './encap-fill-scrap-detail.vue';
import encapFillDamDetail from './encap-fill-dam-detail.vue';
import encapFillEqp from './encap-fill-eqp.vue';

export default {
  name: "tabTable",
  components: { BarEncapFill,encapFillScrapDetail,encapFillDamDetail,encapFillEqp },
  props: {
    btnData: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    queryObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      wipJson: {},
      isShow: false,
      isShowDam: false,
      isShowEqp: false,
      barData: {
        legendData: ["Input", "Yield rate"],
        xAxisData: [],
        xAxisLabel: {
          rotate: 0,
          interval: 0,
        },
        barData: [],
        lineData: [],
      }, // 柱状图数据
      req: {
        ...this.$config.pageConfig,
      }, //查询数据
      // 模态框表格数据
      columns: [
        {
          type: "index",
          fixed: "left",
          width: 50,
          align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: "Line ID", key: "lineName", minWidth: 120, tooltip: true, align: "center" },
        { title: "Step Name", key: "stepName", minWidth: 120, tooltip: true, align: "center" },
        // { title: "EQP ID", key: "eqpId", minWidth: 120, tooltip: true, align: "center" },
        // { title: "Input", key: "inputQty", minWidth: 120, tooltip: true, align: "center" },
        {
          title: "Input",
          key: "inputQty",
          width: 120,
          align: "center",
          ellipsis: true,
          tooltip: true,
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                    color: "blue",
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block", //设置样式，超过文字省略号显示
                    cursor: "pointer", //设置鼠标样式
                  },
                  domProps: {
                    title: params.row.inputQty, //添加title属性
                  },
                  on: {
                    click: () => {
                      this.show(params.row,'input'); //点击事件
                    },
                  },
                },
                params.row.inputQty
              ),
            ]);
          },
        },
        { title: "Out put", key: "outputQty", minWidth: 120, tooltip: true, align: "center" },
        {
          title: "Fail",
          key: "failQty",
          width: 120,
          align: "center",
          ellipsis: true,
          tooltip: true,
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                    color: "blue",
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block", //设置样式，超过文字省略号显示
                    cursor: "pointer", //设置鼠标样式
                  },
                  domProps: {
                    title: params.row.failQty, //添加title属性
                  },
                  on: {
                    click: () => {
                      this.show(params.row,'fail'); //点击事件
                    },
                  },
                },
                params.row.failQty
              ),
            ]);
          },
        },
        { title: "Yield rate", key: "yieldRate", minWidth: 120, tooltip: true, align: "center" },
      ], // 表格数据
    };
  },
  watch: {
    tableData: {
      handler(newVal) {
        console.log('=============newVal============',newVal)
        this.data = newVal;
        this.tableConfig.loading = newVal.length === 0;
        this.barData.xAxisData = this.data.map((o) => o.lineName);
        this.barData.barData = this.data.map((o) => Number(o.outputQty));
        this.barData.lineData = this.data.map((o) => Number(o.yieldRate.replace("%", "")));
        this.$nextTick(() => this.$refs.barEncapFill.initChart());
      },
      deep: true,
    },
  },
  mounted() {
    this.autoSize();
  },
  methods: {
    // 导出
    exportClick() {
      let obj = this.queryObj;
      byLineExportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("encap-fill-report")}-线体查询${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    show (row,flag) {
      let obj = this.queryObj;
      console.log('======queryObj====',this.queryObj)
      if(flag == 'fail')
      {
        if(row.failQty == 0)
        {
          this.isShow = false;
          this.isShowDam = true;
          this.isShowEqp = false;
        }
        else
        {
          this.isShow = true;
          this.isShowDam = false;
          this.isShowEqp = false;
        }
      }
      else
      {
        this.isShow = false;
        this.isShowDam = false;
        this.isShowEqp = true;
      }
      //this.isShow = true;
      this.wipJson = { startTime: obj.startTime, endTime: obj.endTime, lineName: row.lineName, stepName: obj.stepName }
      // console.log(row, processname, this.$refs.wipmodal);
      //   this.$refs.wipmodal.pageLoad(row.workorder, processname);

    },
    // 自动改变表格高度
    autoSize() {
      this.tableConfig.height = document.body.clientHeight - 210;
    },
  },
};
</script>
