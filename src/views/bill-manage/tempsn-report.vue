/* TempSn报表 */
<template>
  <div class="page-style">
    <!-- 右侧抽屉 Form表单 -->
    <Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
      <Form ref="submitReq" :label-width="90" :label-colon="true" @submit.native.prevent>
        <!-- 批量新增参数 -->
        <FormItem label="批量新增" prop="batchData">
          <Input type="text" v-model="batchData" placeholder="格式:SN1,SN2,SN3,SN4....SNn;Scrap" />
        </FormItem>

        <!-- 按钮 -->
        <FormItem>
          <drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
        </FormItem>
      </Form>
    </Drawer>
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
                  <Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
                    <!-- 起始时间 -->
                    <FormItem :label="$t('startTime')" prop="startTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
                    </FormItem>
                    <!-- SN -->
                    <FormItem label="SN" prop="sn">
                      <Input v-model="req.sn" :placeholder="$t('pleaseEnter') + 'sn'" @on-search="pageLoad" />
                    </FormItem>
                    <!-- SN -->
                    <FormItem label="状态" prop="status">
                      <Input v-model="req.status" :placeholder="$t('pleaseEnter') + 'status'" @on-search="pageLoad" />
                    </FormItem>

                  </Form>
                  <div class="poptip-style-button">
                    <Button @click="resetClick()">{{ $t("reset") }}</Button>
                    <Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
                  </div>
                </div>
              </Poptip>
            </i-col>
            <i-col span="18">
              <button-custom :btnData="btnData" @on-export-click="exportClick" @on-add-click="addClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, exportReq, addReq } from "@/api/bill-manage/tempsn-report";
import { getButtonBoolean, formatDate, exportFile, renderDate } from "@/libs/tools";

export default {
  name: "tempsn-report",
  data () {
    return {
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      categoryList: [],// 类别下拉框
      req: {
        startTime: "",
        endTime: "",
        sn: "",
        status: "",
        ...this.$config.pageConfig,
      }, //查询数据
      batchData: '',
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
        { title: 'ID', key: "id", align: "center", width: '250' },
        { title: "SN", key: "sn", align: "center" },
        { title: 'Status', key: "status", align: "center" },
        { title: 'Process', key: "process", align: "center" },
        { title: "Op1", key: "oP1", align: "center" },
        { title: 'Op2', key: "oP2", align: "center" },
        { title: "Op3", key: "oP3", align: "center" },
        { title: 'Op4', key: "oP4", align: "center" },
        { title: "Op5", key: "oP5", align: "center" },
        { title: '创建时间', key: "createTime", align: "center", render: renderDate },
      ], // 表格数据
      drawerFlag: false,
      drawerTitle: this.$t("add")
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
    // 点击搜索按钮触发
    searchClick () {
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 获取分页列表数据
    pageLoad () {
      this.data = [];
      this.tableConfig.loading = false;
      let { startTime, endTime, sn, status } = this.req;
      if (startTime && endTime) {
        this.$refs.searchReq.validate((validate) => {
          if (validate) {
            this.tableConfig.loading = true;
            let obj = {
              orderField: "sn", // 排序字段
              ascending: true, // 是否升序
              pageSize: this.req.pageSize, // 分页大小
              pageIndex: this.req.pageIndex, // 当前页码
              data: {
                startTime: formatDate(startTime),
                endTime: formatDate(endTime),
                sn,
                status
              },
            };
            getpagelistReq(obj).then((res) => {
              this.tableConfig.loading = false;
              if (res.code === 200) {
                let { data, pageSize, pageIndex, total, totalPage } = res.result;
                this.data = data || [];
                this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
              }
            })
              .catch(() => (this.tableConfig.loading = false));
            this.searchPoptipModal = false;
          }
        });
      } else {
        this.$Message.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
      }
    },
    // 导出
    exportClick () {
      let { startTime, endTime, sn, status } = this.req;
      if (startTime && endTime) {
        let obj = {
          startTime: formatDate(startTime),
          endTime: formatDate(endTime),
          sn,
          status
        };
        exportReq(obj).then((res) => {
          let blob = new Blob([res], { type: "application/vnd.ms-excel" });
          const fileName = `${this.$t("tempsn-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
          exportFile(blob, fileName);
        });
      } else {
        this.$Message.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
      }
    },
    // 点击新增按钮触发
    addClick () {
      this.drawerFlag = true;
      this.drawerTitle = this.$t("add");
    },
    //提交
    submitClick (isClose = false) {
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          let obj = { addData: this.batchData };
          addReq(obj).then((res) => {
            if (res.code === 200) {
              this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
              this.pageLoad();
              if (isClose) this.cancelClick();
            } else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
          });
        }
      });
    },
    // 左侧抽屉取消
    cancelClick () {
      this.drawerFlag = false;
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
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
