/* FA WIP报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="24">
              <Button :btnData="btnData" @click="exportClick" type="primary" style="float:right">{{$t('export')}}</Button>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" :span-method="handleSpan">
        </Table>
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
        <Modal draggable v-model="visible" :closable="false"><img class="img-style" :src="imgBase64" /></Modal>
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/fa-wip-report";
import { formatDate, exportFile } from "@/libs/tools";

export default {
  name: "fa-wip-tab-table",
  data () {
    return {
      poptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      queryObj: {},
      req: {
        ...this.$config.pageConfig,
      }, //查询数据
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
        { title: "机种", key: "modelName", align: "center", width: 120, tooltip: true },
        { title: "工单", key: "workOrder", align: "center", width: 120, tooltip: true },
        { title: "料号", key: "pn", align: "center", width: 140, tooltip: true },
        { title: "白夜班", key: "shiftDay", align: "center", width: 150, tooltip: true },
        { title: "大板号", key: "panelNo", align: "center", width: 150, tooltip: true },
        { title: "SN", key: "unitId", align: "center", width: 150, tooltip: true },
        { title: "不良时间", key: "failureTime", align: "center", width: 150, tooltip: true },
        { title: "check-in时间", key: "labCheckIn", align: "center", width: 150, tooltip: true },
        { title: "check-out时间", key: "labCheckOut", align: "center", width: 150, tooltip: true },
        { title: "不良站别", key: "failureStationName", align: "center", width: 150, tooltip: true },
        { title: "不良现象", key: "failureSympton", align: "center", width: 150, tooltip: true },
        { title: "不良位置", key: "location", align: "center", width: 150, tooltip: true },
        { title: "LED BIN Code", key: "ledBinCode", align: "center", width: 150, tooltip: true },
        { title: "不良状态", key: "status", align: "center", width: 150, tooltip: true },
        { title: "FA人员", key: "repairEmployee", align: "center", width: 150, tooltip: true },
        { title: "当前站点", key: "currentStep", align: "center", width: 150, tooltip: true }
      ], // 表格数据
      cc: [],
      visible: false,
      imgBase64: '',
    };
  },
  mounted () {

    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());

  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.poptipModal = false;
    next();
  },
  methods: {

    // 获取分页列表数据
    pageLoad () {
      this.data = [];
      this.tableConfig.loading = true;
      let obj = {
        orderField: "rownum", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: this.queryObj,
      };
      getpagelistReq(obj).then((res) => {
        this.tableConfig.loading = false;
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.data = data.filter((element) => { return element.cc === null }) || [];
          this.cc = data[0].cc || [];
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
          this.poptipModal = false;
        }
      }).catch(() => (this.tableConfig.loading = false));

    },
    handleSpan ({ rowIndex, columnIndex }) {
      let cc = this.cc;
      const columnList = (columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9 || columnIndex === 10 || columnIndex === 13 || columnIndex === 15)


      for (let i = 0; i < cc.length; i++) {
        for (let o = 0; o < cc[i].bb; o++) {
          if (rowIndex === cc[i].aa - 1 && columnList) {
            return {
              rowspan: cc[i].bb,
              colspan: 1
            };
          }
          if (rowIndex === cc[i].aa + o - 1 && columnList) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    },
    // 导出
    exportClick () {
      //   let { startTime, endTime, lineName, modelName, stepName, pn, workOrder } = this.queryObj,;
      //   let obj = {
      //     startTime: formatDate(startTime),
      //     endTime: formatDate(endTime),
      //     workOrder, stepName, lineName: lineName?.join(","), modelName, pn
      //   }
      exportReq(this.queryObj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("fa-wip-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },

    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 215;
    },
    // 选择第几页
    pageChange (index) {
      this.req.pageIndex = index;
      this.pageLoad();
    },
    // 选择一页有条数据
    pageSizeChange (index) {
      this.req.pageIndex = 1;
      this.req.pageSize = index;
      this.pageLoad();
    },
  },
};
</script>
<style lang="less" scoped>
.img_item {
  width: 30px;
  height: 30px;
  margin-left: 3px;
  cursor: pointer;
}
/deep/.ivu-tabs-bar {
  margin-bottom: 0px;
}
</style>
