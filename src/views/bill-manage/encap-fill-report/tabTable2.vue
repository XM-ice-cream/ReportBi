<template>
  <Card :bordered="false" dis-hover class="card-style">
    <div slot="title">
      <Row>
        <i-col span="24">
          <button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
        </i-col>
      </Row>
    </div>
    <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :max-height="tableConfig.height"
           :loading="tableConfig.loading" :columns="columns" :data="data">
    </Table>
    <BarEncapFill ref="barEncapFill" style="width: 900px;height: 420px;" :data="barData" index="eqpEncapFill" />
  </Card>
</template>

<script>
import {exportReq} from "@/api/bill-manage/quality-yield-query-report";
import {exportFile, formatDate} from "@/libs/tools";
import BarEncapFill from "@/components/echarts/bar-encap-fill.vue"

export default {
  name: "tabTable2",
  components: {BarEncapFill},
  props: {
    btnData: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    queryObj: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      tableConfig: {...this.$config.tableConfig}, // table配置
      data: [], // 表格数据
      barData: {
        legendData: ['EQP', 'Fail'],
        xAxisData: [],
        xAxisLabel: {
          rotate: 20,
          interval: 0,
        },
        xBarMax: 200,
        barData: [],
        lineData: [],
      }, // 柱状图数据
      req: {
        ...this.$config.pageConfig,
      }, //查询数据
      // 模态框表格数据
      columns: [
        {
          type: "index", fixed: "left", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        {title: 'Line ID', key: "lineName", minWidth: 120, tooltip: true, align: "center",},
        {title: 'EQP', key: "eqpId", minWidth: 120, tooltip: true, align: "center",},
        {title: 'Input', key: "inputQty", minWidth: 120, tooltip: true, align: "center",},
        {title: 'Out put', key: "outputQty", minWidth: 120, tooltip: true, align: "center",},
        {title: 'Fail', key: "failQty", minWidth: 120, tooltip: true, align: "center",},
        {title: 'Yield rate', key: "yieldRate", minWidth: 120, tooltip: true, align: "center",},
      ], // 表格数据
    };
  },
  watch: {
    tableData: {
      handler(newVal) {
        this.data = newVal
        this.tableConfig.loading = newVal.length === 0
        this.barData.xAxisData = this.data.map(o => o.eqpId)
        this.barData.barData = this.data.map(o => Number(o.outputQty))
        this.barData.lineData = this.data.map(o => Number(o.yieldRate.replace('%', '')))
        this.$nextTick(() => this.$refs.barEncapFill.initChart())
      },
      deep: true
    }
  },
  mounted() {
    this.autoSize();
  },
  methods: {
    // 导出
    exportClick() {
      let obj = {
        orderField: "unitId", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        total: 0,
        data: this.queryObj,
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], {type: "application/vnd.ms-excel"});
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
