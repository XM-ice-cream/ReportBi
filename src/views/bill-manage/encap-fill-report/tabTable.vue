<template>
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
</template>

<script>
import { byLineExportReq } from "@/api/bill-manage/encap-fill-report";
import { exportFile, formatDate } from "@/libs/tools";
import BarEncapFill from "@/components/echarts/bar-encap-fill.vue";

export default {
  name: "tabTable",
  components: { BarEncapFill },
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
        { title: "Input", key: "inputQty", minWidth: 120, tooltip: true, align: "center" },
        { title: "Out put", key: "outputQty", minWidth: 120, tooltip: true, align: "center" },
        { title: "Fail", key: "failQty", minWidth: 120, tooltip: true, align: "center" },
        { title: "Yield rate", key: "yieldRate", minWidth: 120, tooltip: true, align: "center" },
      ], // 表格数据
    };
  },
  watch: {
    tableData: {
      handler(newVal) {
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
    // 自动改变表格高度
    autoSize() {
      this.tableConfig.height = document.body.clientHeight - 210;
    },
  },
};
</script>
