/* Serin部分站点查询 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="12">
              <Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="350" trigger="manual">
                <Button type="primary" icon="ios-search" @click.stop="poptipModal = !poptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent>
                    <!-- 站点 -->
                    <FormItem :label="$t('stepName')" prop="stationType">
                      <Select v-model="req.stationType" clearable filterable :placeholder="`${$t('pleaseEnter')} 站点`">
                        <Option v-for="(item, i) in stationTypeList" :value="item" :key="i">{{ item }}</Option>
                      </Select>
                    </FormItem>
                    <!-- Barcode -->
                    <FormItem :label="$t('bigBoardCode')" prop="barCode">
                      <Input type="text" v-model.trim="req.barCode" @on-keyup.enter="searchClick" clearable :placeholder="$t('pleaseEnter') + $t('bigBoardCode') + $t('multiple,separated')" />
                    </FormItem>
                  </Form>
                  <div class="poptip-style-button">
                    <Button @click="resetClick()">{{ $t("reset") }}</Button>
                    <Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
                  </div>
                </div>
              </Poptip>
            </i-col>
            <i-col span="12">
              <button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data">
          <template slot-scope="{ row }" slot="sendFlag">
            <span style="color:#43e36c" v-if="row.sendFlag === 'Y'">是</span>
            <span style="color:#EC808D" v-else>否</span>
          </template>
        </Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getOp20Req, getOp25Req, getOp30Req, exportOp20Req, exportOp25Req, exportOp30Req } from "@/api/bill-manage/serinop-report";
import { renderDate, formatDate, getButtonBoolean, exportFile, commaSplitString } from "@/libs/tools";

export default {
  name: "serinop-report",
  data () {
    return {
      poptipModal: false,
      noRepeatRefresh: false, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      req: {
        barCode: '', // 大板码
        stationType: 'OP20', // 站点
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [
        {
          type: "index", fixed: "left", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: this.$t("workOrder"), key: "workOrder", align: "center" },
        { title: this.$t("model"), key: "project", align: "center" },
        { title: this.$t("eqpId"), key: "eq_Id", align: "center", tooltip: true },
        { title: 'Config', key: "config", align: "center", tooltip: true },
        { title: 'APN', key: "apn", align: "center", tooltip: true },
        { title: this.$t("line"), key: "line", align: "center", tooltip: true },
        { title: this.$t("stationName"), key: "station", align: "center" },
        { title: this.$t("bigBoardCode"), key: "barCode", align: "center", tooltip: true },
        { title: this.$t("rev"), key: "rev", align: "center" },
        { title: this.$t("totalResult"), key: "total_Result", align: "center" },
        { title: this.$t("serinState"), key: "state", align: "center" },
        { title: this.$t("sendFlag"), key: "sendFlag", align: "center", width: 70, slot: "sendFlag" },
        { title: this.$t("startTime"), key: "startTime", width: 125, align: "center", render: renderDate, },
        { title: this.$t("fileCreateTime"), key: "file_CreateTime", width: 125, align: "center", render: renderDate, },
      ], // 表格数据
      data: [], // 表格数据
      btnData: [],
      stationTypeList: ['OP20', 'OP25', 'OP30'], // 线体数据
    };
  },
  mounted () {
    this.pageLoad();
  },
  activated () {
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.poptipModal = false;
    next();
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = false;
      const { barCode, stationType } = this.req
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          this.tableConfig.loading = true;
          let obj = {
            orderField: 'BarCode', // 排序字段
            ascending: this.req.ascending, // 是否升序
            pageSize: this.req.pageSize, // 分页大小
            pageIndex: this.req.pageIndex, // 当前页码
            data: {
              barCode: commaSplitString(barCode).join(),
              stationType
            },
          };
          const getpagelistReq = this.getRequest('get' + stationType);
          console.log(getpagelistReq);
          getpagelistReq(obj).then((res) => {
            this.tableConfig.loading = false;
            if (res.code === 200) {
              let { data, pageSize, pageIndex, total, totalPage } = res.result;
              this.data = data || [];
              this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
            }
          }).catch(() => (this.tableConfig.loading = false));
        }
      });
    },


    // serin导出
    exportClick () {
      if (!this.req.startTime || !this.req.endTime)
        return this.$Message.warning(`${this.$t("pleaseSelect")}${this.$t("timeHorizon")}`);
      const { stationType, barCode } = this.req;
      const obj = {
        barCode: commaSplitString(barCode).join(),
        stationType
      };
      const exportReq = this.getRequest('export' + stationType);
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${stationType}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    getRequest (key) {
      const obj = {
        getOP20: getOp20Req,
        getOP25: getOp25Req,
        getOP30: getOp30Req,
        exportOP20: exportOp20Req,
        exportOP25: exportOp25Req,
        exportOP30: exportOp30Req,
      }
      return obj[key]
    },
    // 点击搜索按钮触发
    searchClick () {
      this.poptipModal = false
      this.req.pageIndex = 1;
      this.pageLoad();
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
