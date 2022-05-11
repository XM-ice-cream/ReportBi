/* 离线品追踪查询 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="350" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="60" :label-colon="true" @submit.native.prevent>
                    <!-- 开始时间 -->
                    <FormItem :label="$t('startTime')" prop="startTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
                    </FormItem>
                    <!-- 工单 -->
                    <FormItem :label="$t('workOrder')" prop="workOrder">
                      <v-selectpage class="select-page-style" v-if="searchPoptipModal" key-field="workOrder" show-field="workOrder" :data="workerPageListUrl" v-model="req.workOrder" multiple :placeholder="$t('pleaseSelect') + $t('workOrder')" :result-format="
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
                    <FormItem :label="$t('line')" prop="lineName">
                      <Select v-model="req.lineName" clearable filterable transfer multiple :placeholder="`${$t('pleaseSelect')}${$t('line')}`">
                        <Option v-for="(item, i) in lineList" :value="item.name" :key="i">{{
                          item.name
                        }}</Option>
                      </Select>
                    </FormItem>
                    <!-- 设备编码 -->
                    <FormItem :label="$t('equipment')" prop="eqpId">
                      <v-selectpage class="select-page-style" v-if="searchPoptipModal" multiple key-field="enCode" show-field="enCode" :data="eqpPageListUrl" v-model="req.eqpId" :placeholder="$t('pleaseSelect') + $t('equipment')" :result-format="
                          (res) => {
                            return {
                              totalRow: res.total,
                              list: res.data || [],
                            };
                          }
                        ">
                      </v-selectpage>
                    </FormItem>
                    <!-- 大板码 -->
                    <FormItem label="PanelNo" prop="panelNo">
                      <Input v-model="req.panelNo" :placeholder="$t('pleaseEnter') + 'PanelNo' + $t('multiple,separated')" @keyup.enter.native="searchClick" />
                    </FormItem>
                    <!-- SN -->
                    <FormItem label="Carrier SN" prop="sn">
                      <Input v-model="req.sn" :placeholder="$t('pleaseEnter') + 'SN'+ $t('multiple,separated')" @keyup.enter.native="searchClick" />
                    </FormItem>
                    <!-- 类型 -->
                    <FormItem :label="$t('type')" prop="type">
                      <Input v-model="req.type" :placeholder="$t('pleaseEnter') + $t('type')" @keyup.enter.native="searchClick" />
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
import { getpagelistReq, exportReq } from "@/api/flow-manager/offline-product-tracking";
import { getButtonBoolean, formatDate, exportFile, renderDate, renderState } from "@/libs/tools";
import { getAreaFloorLineListReq } from "@/api/basis-info/area-floor";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { eqpPageListUrl } from "@/api/eqp-manage/eqp-info";

export default {
  name: "offlinetracking-query",
  data () {
    return {
      eqpPageListUrl: eqpPageListUrl(),
      workerPageListUrl: workerPageListUrl(),
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      req: {
        startTime: "",
        endTime: "",
        workOrder: "", // 工单
        lineName: "", // 线体名称
        panelNo: "", // panelNo
        sn: "", // sn
        eqpId: "",
        type: "",
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [
        {
          title: this.$t("sort"),
          type: "index",
          width: 50,
          align: "center",
          fixed: "left",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        {
          title: this.$t("workOrder"),
          key: "workOrder",
          width: 140,
          align: "center",
          tooltip: true,
          fixed: "left",
        },
        { title: this.$t("line"), key: "lineName", width: 200, align: "center" },
        { title: this.$t("equipment"), key: "eqpId", width: 120, align: "center" },
        { title: this.$t("process"), key: "process", width: 120, align: "center" },
        { title: this.$t("type"), key: "type", width: 100, align: "center" },
        {
          title: "PanelNo",
          key: "panelNo",
          minWidth: 150,
          align: "center",
          tooltip: true,
        },
        { title: "SN", key: "sn", minWidth: 150, align: "center", tooltip: true },

        {
          title: this.$t("operationType"),
          key: "enabled",
          width: 80,
          align: "center",
          render: (h, params) => {
            const color = params.row.enabled ? "#ff9900" : "#ccc";
            const name = params.row.enabled ? "归还" : "借用";
            return renderState(h, color, name);
          },
        },
        { title: this.$t("cause"), key: "reason", width: 150, align: "center" },
        { title: "借用人", key: "borrower", width: 150, align: "center" },
        { title: "借用时间", key: "borrowDate", width: 125, render: renderDate },
        { title: "归还人", key: "returner", width: 150, align: "center" },
        { title: "归还时间", key: "returnDate", width: 125, render: renderDate },
      ], // 表格数据
      lineList: [], // 线体列表
    };
  },
  mounted () {
    this.pageLoad();
  },
  async activated () {
    this.autoSize();
    window.addEventListener("resize", () => this.autoSize());
    getButtonBoolean(this, this.btnData);
    await this.getLineList();
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = true;
      const {
        workOrder,
        lineName,
        startTime,
        endTime,
        sn,
        panelNo,
        eqpId,
        type,
      } = this.req;
      let obj = {
        orderField: "workOrder", // 排序字段
        ascending: this.req.ascending, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          workOrder, // 工单
          lineName: lineName.toString(), // 线体名称
          sn,
          panelNo,
          eqpId,
          type,
          startTime: formatDate(startTime),
          endTime: formatDate(endTime),
        },
      };
      getpagelistReq(obj)
        .then((res) => {
          this.tableConfig.loading = false;
          if (res.code === 200) {
            let { data, pageSize, pageIndex, total, totalPage } = res.result;
            this.data = data || [];
            this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
            this.searchPoptipModal = false;
          }
        })
        .catch(() => (this.tableConfig.loading = false));
    },

    // 获取线体数据
    async getLineList () {
      const obj = {
        category: 4,
        systemFlag: this.$store.state.systemFlag,
        enabled: 1,
      };
      await getAreaFloorLineListReq(obj).then(async (res) => {
        if (res.code === 200) {
          this.lineList = res.result || [];
        }
      });
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
      this.searchPoptipModal = false;
      this.$nextTick(() => {
        this.searchPoptipModal = true;
      })
    },
    // 点击搜索按钮触发
    searchClick () {
      this.req.pageIndex = 1;
      this.pageLoad();
      this.selectObj = null;

    },
    // 导出
    exportClick () {
      const {
        workOrder,
        lineName,
        startTime,
        endTime,
        panelNo,
        sn,
        eqpId,
        type,
      } = this.req;
      let obj = {
        workOrder, // 工单
        lineName: lineName.toString(), // 线体名称
        panelNo,
        sn,
        eqpId,
        type,
        startTime: formatDate(startTime), // 报废时间
        endTime: formatDate(endTime), // 报废时间
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("offlinetracking-query")}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
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
