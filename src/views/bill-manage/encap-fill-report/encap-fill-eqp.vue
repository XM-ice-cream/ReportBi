/* EncapFillEqp */
<template>
  <Modal draggable v-model="modalFlag" width="1250" title="Encap机台" :styles="{ top: '20px' }" :closable="false">
    <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loadingModal" :columns="columns" :data="data"></Table>
    <div slot="footer">
      <Button @click="modalCancel">{{ $t("cancel") }}</Button>
    </div>
  </Modal>
</template>

<script>
import { getpagelistEqpReq } from "@/api/bill-manage/encap-fill-report";
import { formatDate } from "@/libs/tools";
export default {
  name: "encap-fill-eqp",
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

        { title: "Line ID", key: "lineName", minWidth: 120, tooltip: true, align: "center" },
        { title: "Step Name", key: "stepName", minWidth: 120, tooltip: true, align: "center" },
        { title: "EQP ID", key: "eqpId", minWidth: 120, tooltip: true, align: "center" },
        { title: "Input", key: "inputQty", minWidth: 120, tooltip: true, align: "center" },
        { title: "Output", key: "outputQty", minWidth: 120, tooltip: true, align: "center" },
        { title: "Fail", key: "failQty", minWidth: 120, tooltip: true, align: "center" },
        { title: "Yield rate", key: "yieldRate", minWidth: 120, tooltip: true, align: "center" },
      ],
      req: {
        ...this.$config.pageConfig,
      },
      modalFlag: false
    };
  },
  props: {
    isShowEqp: {
      typeof: Boolean,
      default: false
    },
    paramData: Object
  },
  watch: {
    isShowEqp () {
      if (this.isShowEqp) {
        this.modalFlag = this.isShowEqp;
        const { startTime, endTime, lineName, stepName } = this.paramData
        this.pageLoad(startTime, endTime, lineName, stepName)
      }
    }
  },
  activated () {
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize);
  },
  methods: {
    // 获取分页列表数据
    pageLoad (startTime, endTime, lineName, stepName) {
      this.data = [];
      let obj = {
        startTime: formatDate(startTime),
        endTime: formatDate(endTime),
        lineName,
        stepName,
      };
      getpagelistEqpReq(obj).then((res) => {
        if (res.code === 200) {
          this.data = res.result || []
        }
      })
      //   .catch(() => (this.tableConfig.loading = false));
      this.searchPoptipModal = false;


    },
    modalCancel () {
      this.modalFlag = false;
      this.$emit('update:isShowEqp', false)
    },

    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 120 - 60;
    },
  }
};
</script>
