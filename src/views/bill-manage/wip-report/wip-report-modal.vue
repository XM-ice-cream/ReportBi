/* WIP报表 */
<template>
  <Modal draggable v-model="modalFlag" width="1250" title="工单明细" :styles="{ top: '20px' }" :closable="false">
    <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loadingModal" :columns="columns" :data="data"></Table>
    <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
    <div slot="footer">
      <Button @click="modalCancel">{{ $t("cancel") }}</Button>
      <Button @click="exportClick">{{ $t("export") }}</Button>
    </div>
  </Modal>
</template>

<script>
import { getpagelistDetailReq, exportDetailReq } from "@/api/bill-manage/wip-report";
import { formatDate, exportFile, renderDate } from "@/libs/tools";
export default {
  name: "wip-report-modal",
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
        { title: this.$t("workOrder"), key: "workOrder", align: "center", width: 140, tooltip: true },
        { title: this.$t("panelNo"), key: "panelno", align: "center", width: 140, tooltip: true },
        { title: this.$t("unitId"), key: "unitID", align: "center", width: 140, tooltip: true },
        { title: '当前站点', key: "curprocessname", align: "center", width: 140, tooltip: true },
        { title: this.$t("eqpId"), key: "eqpid", align: "center", minWidth: 140, tooltip: true },
        { title: '下一站点', key: "nextprocessname", align: "center", width: 140, tooltip: true },
        { title: '当前状态', key: "currentstatus", align: "center", width: 140, tooltip: true },
        { title: '出站时间', key: "outprocesstime", align: "center", width: 140, tooltip: true, render: renderDate, },
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
        const { workorder, processname } = this.paramData
        this.pageLoad(workorder, processname)
      }
    }
  },
  activated () {
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize);
  },
  methods: {
    // 获取分页列表数据
    pageLoad (workorder, currentProcess) {
      this.data = [];
      let obj = {
        orderField: "workorder", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          workorder, //工单
          currentProcess,
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
    // 导出
    exportClick () {
      const { workorder, processname } = this.paramData
      if (workorder && processname) {
        let obj = {
          workorder, //工单
          currentProcess: processname,
        };
        exportDetailReq(obj).then((res) => {
          let blob = new Blob([res], { type: "application/vnd.ms-excel" });
          const fileName = `${this.$t("wip-report-modal")}_${workorder}_${processname}_${formatDate(new Date())}.xlsx`; // 自定义文件名
          exportFile(blob, fileName);
        });
      } else {
        this.$Message.warning('工单和当前站点不能为空!');
      }
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
      this.pageLoad(this.paramData.workorder, this.paramData.processname)
    },
    // 选择一页有条数据
    pageSizeChange (index) {
      this.req.pageIndex = 1;
      this.req.pageSize = index;
      this.pageLoad(this.paramData.workorder, this.paramData.processname)
    },
  }
};
</script>
