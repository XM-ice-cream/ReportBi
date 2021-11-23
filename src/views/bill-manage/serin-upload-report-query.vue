/* SERIN上传报告查询 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="12">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="350" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form :rules="ruleValidate" ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent>
                    <!-- 起始时间 -->
                    <FormItem :label="$t('startTime')" prop="startTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime">
                      </DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime">
                      </DatePicker>
                    </FormItem>
                    <!-- 工单 -->
                    <FormItem :label="$t('workOrder')" prop="workOrder">
                      <v-selectpage ref="workOrder" class="select-page-style" v-if="searchPoptipModal" key-field="workOrder" show-field="workOrder" :data="workerPageListUrl" v-model="req.workOrder" :placeholder="$t('pleaseSelect') + $t('workOrder')" :result-format="
                          (res) => {
                            return {
                              totalRow: res.total,
                              list: res.data || [],
                            };
                          }
                        ">
                      </v-selectpage>
                    </FormItem>

                    <!-- 线体 -->
                    <FormItem :label="$t('line')" prop="line">
                      <Input type="text" v-model="req.line" @on-keyup.enter="searchClick" :placeholder="$t('pleaseEnter') + $t('line')" clearable />
                    </FormItem>
                    <!-- 站点 -->
                    <FormItem :label="$t('stepName')" prop="station">
                      <Input type="text" v-model="req.station" @on-keyup.enter="searchClick" :placeholder="$t('pleaseEnter') + $t('stepName')" clearable />
                    </FormItem>

                    <!-- Barcode -->
                    <FormItem :label="$t('bigBoardCode')" prop="barcode">
                      <Input type="text" v-model.trim="req.barcode" @on-keyup.enter="searchClick" clearable :placeholder="
                          $t('pleaseEnter') + $t('bigBoardCode') + $t('multiple,separated')
                        " />
                    </FormItem>
                    <!-- Status -->
                    <FormItem :label="$t('status')" prop="status">
                      <Input type="text" v-model="req.status" @on-keyup.enter="searchClick" :placeholder="$t('pleaseEnter') + $t('status')" clearable />
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
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/serin-upload-report-query";
import {
  renderDate,
  formatDate,
  getButtonBoolean,
  exportFile,
  commaSplitString,
} from "@/libs/tools";
import { workerPageListUrl } from "@/api/material-manager/order-info";

export default {
  name: "serin-upload-report-query",
  data () {
    return {
      workerPageListUrl: workerPageListUrl(),
      searchPoptipModal: false,
      noRepeatRefresh: false, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      req: {
        startTime: "",
        endTime: "",
        workOrder: "", // 工单
        status: "", //
        line: "", // 线体
        barcode: "", // 大板码
        station: "", // 站点
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
        { title: this.$t("id"), key: "id", align: "center", minWidth: 100, tooltip: true },
        { title: this.$t("workOrder"), key: "workOrder", align: "center" },
        { title: this.$t("line"), key: "line", align: "center" },
        { title: this.$t("stationName"), key: "station", align: "center" },
        { title: this.$t("eqpId"), key: "eq_Id", align: "center" },
        { title: this.$t("bigBoardCode"), key: "barCode", align: "center" },
        {
          title: "设备生成时间",
          key: "startTime",
          width: 125,
          align: "center",
          render: renderDate,
        },
        { title: this.$t("status"), key: "status", width: 50, align: "center" },
        {
          title: "压缩包生成时间",
          key: "zipCreateTime",
          width: 125,
          align: "center",
          render: renderDate,
        },
      ], // 表格数据
      data: [], // 表格数据
      btnData: [],
      // 验证实体
      ruleValidate: {
        startTime: [
          {
            required: true,
            type: "date",
            trigger: "change",
            message: this.$t("pleaseSelect") + this.$t("startTime"),
          },
        ],
        endTime: [
          {
            required: true,
            type: "date",
            trigger: "change",
            message: this.$t("pleaseSelect") + this.$t("endTime"),
          },
        ],
      },
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
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = false;
      const { startTime, endTime, workOrder, line, status, barcode, station } = this.req;
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          this.tableConfig.loading = true;
          let obj = {
            orderField: "BarCode", // 排序字段
            ascending: this.req.ascending, // 是否升序
            pageSize: this.req.pageSize, // 分页大小
            pageIndex: this.req.pageIndex, // 当前页码
            data: {
              startTime: formatDate(startTime),
              endTime: formatDate(endTime),
              workOrder,
              line,
              status,
              barcode: commaSplitString(barcode).join(),
              station,
            },
          };
          getpagelistReq(obj)
            .then((res) => {
              this.tableConfig.loading = false;
              if (res.code === 200) {
                let { data, pageSize, pageIndex, total, totalPage } = res.result;
                this.data = data || [];
                this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
              }
            })
            .catch(() => (this.tableConfig.loading = false));
        }
      });
    },

    // 制程选择操作
    processInput (value) {
      if (!value) {
        this.req.station = "";
      }
    },
    // serin导出
    exportClick () {
      if (!this.req.startTime || !this.req.endTime)
        return this.$Message.warning(`${this.$t("pleaseSelect")}${this.$t("timeHorizon")}`);
      const { workOrder, startTime, endTime, station, barcode, line, status } = this.req;
      const obj = {
        workOrder,
        startTime: formatDate(startTime),
        endTime: formatDate(endTime),
        line,
        status,
        barcode: commaSplitString(barcode).join(),
        station,
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("serin-upload-report-query")}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    // 点击搜索按钮触发
    searchClick () {
      if (this.req.startTime && this.req.endTime) {
        this.searchPoptipModal = false;
      }
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
      this.$refs.workOrder.remove();
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
