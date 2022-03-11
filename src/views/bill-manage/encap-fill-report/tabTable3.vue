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
      :max-height="300"
      :columns="columns"
      :data="tableData"
    >
    </Table>
    <!-- 饼图 -->
    <PieEncap ref="pieEncap" :data="pieData" index="PieEncap" />
  </Card>
</template>

<script>
import { byDefectExportReq } from "@/api/bill-manage/encap-fill-report";
import { exportFile, formatDate } from "@/libs/tools";
import PieEncap from '@/components/echarts/pie-encap'

export default {
  name: "tabTable3",
  components: { PieEncap },
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
      req: {
        ...this.$config.pageConfig,
      }, //查询数据
      pieData: {
        series: [],
        legend: [],
        title: '',
      }, // 饼图数据
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
        { title: "EQP", key: "eqpId", minWidth: 120, tooltip: true, align: "center" },
        { title: "Step Name", key: "stepName", minWidth: 120, tooltip: true, align: "center" },
        { title: "不良现象", key: "defectDes", minWidth: 120, tooltip: true, align: "center" },
        { title: "不良数", key: "defectQty", minWidth: 120, tooltip: true, align: "center" },
      ], // 表格数据
    };
  },
  watch: {
    tableData: {
      handler(newVal) {
      console.log('=====newVal=====',newVal)
        this.data = newVal;
        this.tableConfig.loading = newVal.length === 0;
        this.pieData = {
          series: [],
          legend: [],
          title: '',
        }, // 饼图数据
        this.data.map(o => {
          this.pieData.series.push({ name: o.defectDes, value: o.defectQty });
          this.pieData.legend.push(o.eqpId);
        })
        this.pieData.title = this.data.eqpId;
        this.$nextTick(() => this.$refs.pieEncap.initChart())
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
      byDefectExportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("encap-fill-report")}-良率查询${formatDate(new Date())}.xlsx`; // 自定义文件名
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
