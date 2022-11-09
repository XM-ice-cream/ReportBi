/* SIP-HealthTracker 系统 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="50" :label-colon="true" @submit.native.prevent>
                    <!-- 起始时间 -->
                    <FormItem :label="$t('startTime')" prop="startTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
                    </FormItem>
                    <!-- 小条码 -->
                    <FormItem label="Project" prop="project">
                      <Input v-model.trim="req.project" :placeholder="$t('pleaseEnter') + 'project'" />
                    </FormItem>
                  </Form>
                  <div class="poptip-style-button">
                    <Button @click="resetClick()">{{ $t("reset") }}</Button>
                    <Button type="primary" @click="pageLoad()">{{ $t("query") }}</Button>
                  </div>
                </div>
              </Poptip>
            </i-col>
            <i-col span="18">
              <button-custom :btnData="btnData" @on-add-click="addRecord"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
    <!-- 新增/编辑记录 -->
    <add-record :selectObj="selectObj" :data="columns" @refreshPageLoad="pageLoad" ref="addRecord" :isAdd="isAdd" />
  </div>
</template>

<script>
import { getpagelistReq } from "@/api/bill-manage/health-tracker";
import { getButtonBoolean,renderDate,formatDate } from "@/libs/tools";
import addRecord from "./health-tracker/add-modify"; 
export default {
  name: "health-tracker",
  components: { addRecord },
  data () {
    return {
      isAdd: true,
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      selectObj: null, // 表格选中数据
      req: {
        startTime: "",
        endTime: "",
        project: "", 
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
        { title: "Project", key: "project", align: "center", minWidth: 120, tooltip: true },
        { title: "SN", key: "sn", align: "center", minWidth: 150, tooltip: true },
        { title: "Qty", key: "qty", align: "center", minWidth: 60, tooltip: true },
        { title: "Location", key: "loacation", align: "center", minWidth: 100, tooltip: true },
        { title: "Radar No.", key: "radarno", align: "center", minWidth: 120, tooltip: true },
        { title: "APN", key: "apn", align: "center", minWidth: 100, tooltip: true },
        { title: "IPN", key: "ipn", align: "center", minWidth: 100, tooltip: true },
        { title: "DC", key: "dc", align: "center", minWidth: 100, tooltip: true },
        { title: "LC", key: "lc", align: "center", minWidth: 100, tooltip: true },
        { title: "Issue Date", key: "issuedate", align: "center", minWidth: 120, tooltip: true, render: renderDate },
        { title: "Error code", key: "errocode", align: "center", minWidth: 120, tooltip: true },
        { title: "Failure station", key: "failurestation", align: "center", minWidth: 120, tooltip: true },
        { title: "Issue Description", key: "issuedescription", align: "center", minWidth: 140, tooltip: true },
        { title: "Input Qty", key: "inputqty", align: "center", minWidth: 100, tooltip: true },
        { title: "FR", key: "failrate", align: "center", minWidth: 80, tooltip: true },
        { title: "Tracking No.", key: "trackingno", align: "center", minWidth: 120, tooltip: true },
        { title: "Shipment Date", key: "shipmentdate", align: "center", minWidth: 120, tooltip: true, render: renderDate },
        { title: "Vendor Receiving Date", key: "vendorreceivdate", align: "center", minWidth: 135, tooltip: true, render: renderDate },
        { title: "Report time", key: "reportdate", align: "center", minWidth: 120, tooltip: true, render: renderDate },
        { title: "Status", key: "status", align: "center", minWidth: 120, tooltip: true },
      ], // 表格数据
    };
  },
  activated () {
    this.pageLoad();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = false;
      let { startTime,endTime,project } = this.req;
      if (startTime&&endTime) {
        this.tableConfig.loading = true;
        let obj = {
          orderField: "project", // 排序字段
          ascending: false, // 是否升序
          pageSize: this.req.pageSize, // 分页大小
          pageIndex: this.req.pageIndex, // 当前页码
          data: {
            startTime: formatDate(startTime),
            endTime: formatDate(endTime),
            project
          },
        };
        getpagelistReq(obj)
          .then((res) => {
            this.tableConfig.loading = false;
            if (res.code === 200) {
              let { data, pageSize, pageIndex, total, totalPage } = res.result;
              this.data = data || [];
              this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
            }
          })
          .catch(() => (this.tableConfig.loading = false));
      } else {
        this.$Message.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
      }
    },
    // 点击新增按钮触发
    addRecord () {
      this.$refs.addRecord.drawerFlag = true;
      this.isAdd = true;
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
      this.searchPoptipModal = false;
      this.$nextTick(() => {
        this.searchPoptipModal = true;
      });
    },
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 120 - 60;
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
