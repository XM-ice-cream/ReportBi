/* EncapFillScrap明细数据 */
<template>
  <Modal draggable v-model="modalFlag" width="1250" title="EncapScrap明细" :styles="{ top: '20px' }" :closable="true">
    <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loadingModal" :columns="columns" :data="data"></Table>
    <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
    <BarEncapFill
      ref="barEncapFill"
      style="width: 900px; height: 420px"
      :data="barData"
      index="eqpEncapFill"
    />
    <div slot="footer">
      <Button @click="modalCancel">{{ $t("cancel") }}</Button>
    </div>
  </Modal>
</template>

<script>
import { getpagelistScrapDetailReq, getpagelistDamRateReq } from "@/api/bill-manage/encap-fill-report";
import { formatDate,renderDate } from "@/libs/tools";
import BarEncapFill from "@/components/echarts/bar-encap-fill.vue";
export default {
  name: "encap-fill-scrap-detail",
  components: { BarEncapFill },
  data () {
    return {
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [],
      barData: {
        legendData: ["EQP(Dam机台)", "Fail"],
        xAxisData: [],
        xAxisLabel: {
          rotate: 20,
          interval: 0,
        },
        xBarMax: 200,
        barData: [],
        lineData: [],
      }, // 柱状图数据
      columns: [
        {
          type: "index", fixed: "left", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: this.$t("unitId"), key: "unitId", align: "center", width: 150, tooltip: true },
        { title: this.$t("lineName"), key: "lineName", align: "center", width: 150, tooltip: true },
        { title: this.$t("eqpId"), key: "eqpId", align: "center", width: 150, tooltip: true },
        { title: this.$t("stepName"), key: "stepName", align: "center", width: 150, tooltip: true },
        { title: this.$t("trackTime"), key: "trackTime", align: "center", width: 150, tooltip: true, render: renderDate, },
      ],
      req: {
        ...this.$config.pageConfig,
      },
      modalFlag: false
    };
  },
  props: {
    isShow: {
      typeof: Boolean,
      default: false
    },
    paramData: Object
  },
  watch: {
    isShow () {
      if (this.isShow) {
        this.modalFlag = this.isShow;
        const { startTime, endTime, lineName, stepName } = this.paramData
        this.pageLoad(startTime, endTime, lineName, stepName)
      }
    },
  },
  activated () {
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize);
  },
  methods: {
    // 获取分页列表数据
    pageLoad (startTime, endTime, lineName, stepName) {
      console.log('pageLoad1', lineName);
      console.log('pageLoad3', stepName);
      this.data = [];
      let obj = {
        orderField: "EQPID", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          startTime: formatDate(startTime),
          endTime: formatDate(endTime),
          lineName,
          stepName,
        },
      };
      getpagelistScrapDetailReq(obj).then((res) => {
        // this.tableConfig.loading = false;
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.data = data || []
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
        }
      })
      getpagelistDamRateReq(obj.data).then((res) => {
        if (res.code === 200) {
      console.log('getpagelistDamRateReq', res.result);
          // this.barData = res || []
          let result = res.result;
          this.tableConfig.loading = result.length === 0;
          this.barData.xAxisData = result.map((o) => o.eqpId);
          this.barData.barData = result.map((o) => Number(o.inputQty));
          this.barData.lineData = result.map((o) => Number(o.yieldRate.replace("%", "")));
          this.$nextTick(() => this.$refs.barEncapFill.initChart());
        }
      })
      //   .catch(() => (this.tableConfig.loading = false));
      this.searchPoptipModal = false;


    },
    modalCancel () {
      this.modalFlag = false;
      this.$emit('update:isShow', false)
    },

    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 360 - 60;
    },
    // 选择第几页
    pageChange (index) {
      this.req.pageIndex = index;
      this.pageLoad(this.paramData.startTime,this.paramData.endTime,this.paramData.lineName,this.paramData.stepName)
    },
    // 选择一页有条数据
    pageSizeChange (index) {
      this.req.pageIndex = 1;
      this.req.pageSize = index;
      this.pageLoad(this.paramData.startTime,this.paramData.endTime,this.paramData.lineName,this.paramData.stepName)
    },
  }
};
</script>
