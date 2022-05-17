/* TestPlanOMM数据 */
<template>
  <Modal draggable v-model="modalFlag" width="1250" title="TestPlanOMM数据" :styles="{ top: '20px' }" :closable="false">
    <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loadingModal" :columns="columns" :data="data"></Table>
    <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
    <div slot="footer">
      <Button @click="modalCancel">{{ $t("cancel") }}</Button>
    </div>
  </Modal>
</template>

<script>
import { getpagelistDetailReq } from "@/api/bill-manage/test-plan-query";
import { renderDate } from "@/libs/tools";
export default {
  name: "test-plan-omm",
  data () {
    return {
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [],
      columns: [
        {
          type: "index", fixed: "left", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: this.$t("barCode"), key: "barcode", align: "center", width: 120, tooltip: true },
        { title: this.$t("station"), key: "station", align: "center", width: 140, tooltip: true },
        { title: this.$t("eqpId"), key: "eqpID", align: "center", width: 140, tooltip: true },
        { title: 'FAICode', key: "faiCode", align: "center", width: 100, tooltip: true },
        { title: this.$t("measuredValue"), key: "measuredValue", align: "center", minWidth: 90, tooltip: true },
        { title: this.$t("standardValue"), key: "standardValue", align: "center", minWidth: 90, tooltip: true },
        { title: this.$t("toleranceUpper"), key: "tolerance_Upper", align: "center", minWidth: 90, tooltip: true },
        { title: this.$t("toleranceLower"), key: "tolerance_Lower", align: "center", minWidth: 90, tooltip: true },
        { title: this.$t("exceedStandardValue"), key: "exceedStandardValue", align: "center", minWidth: 90, tooltip: true },
        { title: this.$t("exceedToleranceValue"), key: "exceedtoleranceValue", align: "center", minWidth: 90, tooltip: true },
        { title: this.$t("status"), key: "status", align: "center", minWidth: 60, tooltip: true },
        { title: this.$t("createTime"), key: "createTime", align: "center", width: 140, tooltip: true, render: renderDate, },
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
        const { panelno } = this.paramData
        this.pageLoad(panelno)
      }
    }
  },
  activated () {
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize);
  },
  methods: {
    // 获取分页列表数据
    pageLoad (panelno) {
      this.data = [];
      let obj = {
        orderField: "CreateTime", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          panelno,
        },
      };
      getpagelistDetailReq(obj).then((res) => {
        // this.tableConfig.loading = false;
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.data = data || []
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
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
      this.tableConfig.height = document.body.clientHeight - 120 - 60;
    },
    // 选择第几页
    pageChange (index) {
      this.req.pageIndex = index;
      this.pageLoad(this.paramData.panelno)
    },
    // 选择一页有条数据
    pageSizeChange (index) {
      this.req.pageIndex = 1;
      this.req.pageSize = index;
      this.pageLoad(this.paramData.panelno)
    },
  }
};
</script>
