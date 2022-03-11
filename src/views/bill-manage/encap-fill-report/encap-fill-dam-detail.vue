/* EncapFillDam明细数据 */
<template>
  <Modal draggable v-model="modalFlag" width="1250" title="EncapFillDam明细" :styles="{ top: '20px' }" :closable="false">
    <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loadingModal" :columns="columns" :data="data"></Table>
    <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
    <div slot="footer">
      <Button @click="modalCancel">{{ $t("cancel") }}</Button>
    </div>
  </Modal>
</template>

<script>
import { getpagelistDamDetailReq } from "@/api/bill-manage/encap-fill-report";
import { formatDate } from "@/libs/tools";
export default {
  name: "encap-fill-dam-detail",
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
        { title: "Yield rate", key: "yieldRate", minWidth: 120, tooltip: true, align: "center" },
      ],
      req: {
        ...this.$config.pageConfig,
      },
      modalFlag: false
    };
  },
  props: {
    isShowDam: {
      typeof: Boolean,
      default: false
    },
    paramData: Object
  },
  watch: {
    isShowDam () {
      if (this.isShowDam) {
        this.modalFlag = this.isShowDam;
        const { startTime, endTime, lineName, eqpId, stepName } = this.paramData
        this.pageLoad(startTime, endTime, lineName, eqpId, stepName)
      }
    }
  },
  activated () {
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize);
  },
  methods: {
    // 获取分页列表数据
    pageLoad (startTime, endTime, lineName, eqpId, stepName) {
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
          eqpId,
        },
      };
      getpagelistDamDetailReq(obj).then((res) => {
        // this.tableConfig.loading = false;
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.data = data || []
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
        }
      })
      //   .catch(() => (this.tableConfig.loading = false));
      this.searchPoptipModal = false;


    },
    modalCancel () {
      this.modalFlag = false;
      this.$emit('update:isShowDam', false)
    },

    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 120 - 60;
    },
    // 选择第几页
    pageChange (index) {
      this.req.pageIndex = index;
      this.pageLoad(this.paramData.startTime, this.paramData.endTime, this.paramData.lineName, this.paramData.eqpId, this.paramData.stepName)
    },
    // 选择一页有条数据
    pageSizeChange (index) {
      this.req.pageIndex = 1;
      this.req.pageSize = index;
      this.pageLoad(this.paramData.startTime, this.paramData.endTime, this.paramData.lineName, this.paramData.eqpId, this.paramData.stepName)
    },
  }
};
</script>
