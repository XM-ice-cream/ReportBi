/* CTE 数据查询 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="500" trigger="manual" transfer>
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
                    <!-- 机种 -->
                    <FormItem label="机种" prop="modelName">
                      <Input v-model.trim="req.modelName" placeholder="请输入机种,多个以英文逗号或空格分隔" />
                      <!-- <v-selectpage class="select-page-style" v-if="searchPoptipModal" :multiple="true" key-field="modelName" show-field="modelName" :data="modelPageListUrl" v-model="req.modelName" :placeholder="$t('pleaseSelect') + $t('model')" :result-format="
                          (res) => {
                            return {
                              totalRow: res.total,
                              list: res.data || [],
                            };
                          }
                        ">
                      </v-selectpage> -->
                    </FormItem>
                    <!-- 工单 -->
                    <FormItem label="工单" prop="workOrder">
                      <!-- <Input v-model.trim="req.category" :placeholder="$t('pleaseEnter') +'工单'" /> -->
                      <v-selectpage class="select-page-style" v-if="searchPoptipModal" :multiple="true" key-field="workOrder" show-field="workOrder" :data="workerPageListUrl" v-model="req.workOrder" :placeholder="$t('pleaseSelect') + $t('workOrder')" :result-format="
                          (res) => {
                            return {
                              totalRow: res.total,
                              list: res.data || [],
                            };
                          }
                        ">
                      </v-selectpage>
                    </FormItem>
                    <!-- Config -->
                    <FormItem label="Config" prop="buildConfig">
                      <Input v-model.trim="req.buildConfig" placeholder="请输入Config,多个以英文逗号或空格分隔" />
                    </FormItem>
                    <!-- 线体 -->
                    <FormItem label="线体" prop="lineName">
                      <Input v-model.trim="req.lineName" placeholder="请输入线体,多个以英文逗号或空格分隔" />
                    </FormItem>
                    <!-- 大板码 -->
                    <FormItem label="大板码" prop="panelNo">
                      <Input v-model.trim="req.panelNo" placeholder="请输入大板码号,多个以英文逗号或空格分隔" />
                    </FormItem>
                    <!-- 小条码 -->
                    <FormItem label="小条码" prop="unitId">
                      <Input v-model.trim="req.unitId" placeholder="请输入小条码号,多个以英文逗号或空格分隔" />
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
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data">
        </Table>
        <page-custom :elapsedMilliseconds='req.elapsedMilliseconds' :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/cte-query";
import { modelPageListUrl } from "@/api/basis-info/model-manager";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { getButtonBoolean, formatDate, exportFile, renderDate, commaSplitString } from "@/libs/tools";
export default {
  name: "cte-query",
  data () {
    return {
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      modelPageListUrl: modelPageListUrl(),
      workerPageListUrl: workerPageListUrl(),
      req: {
        modelName: "",//机种
        workOrder: "",//工单
        buildConfig: "",//Config
        lineName: "",//线体
        panelNo: "",//大板码
        unitId: "",//小条码
        startTime: "",//起始时间
        endTime: "",//结束时间
        ...this.$config.pageConfig,
      }, //查询数据
      stationList: [],
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
        { title: "机种", key: "modelName", align: "center", width: 100, tooltip: true },
        { title: "工单", key: "workOrder", align: "center", width: 100, tooltip: true },
        { title: "Config", key: "buildConfig", align: "center", width: 100, tooltip: true },
        { title: "线体", key: "lineName", align: "center", width: 150, tooltip: true },
        { title: "大板码", key: "panelNo", align: "center", width: 200, tooltip: true },
        { title: "穴位号", key: "boardNo", align: "center", width: 50, tooltip: true },
        { title: "小条码", key: "unitId", align: "center", width: 200, tooltip: true },
        { title: "FAI55-1", key: "faI55_1", align: "center", width: 100, tooltip: true },
        { title: "FAI54-2", key: "faI54_2", align: "center", width: 100, tooltip: true },
        { title: "FAI53-3", key: "faI53_3", align: "center", width: 100, tooltip: true },
        { title: "FAI53-4", key: "faI53_4", align: "center", width: 100, tooltip: true },
        { title: "FAI54-5", key: "faI54_5", align: "center", width: 100, tooltip: true },
        { title: "FAI55-6", key: "faI55_6", align: "center", width: 100, tooltip: true },
        { title: "FID1-12", key: "fiD1_12", align: "center", width: 100, tooltip: true },
        { title: "FAI76-1", key: "faI76_1", align: "center", width: 100, tooltip: true },
        { title: "FAI73-2", key: "faI73_2", align: "center", width: 100, tooltip: true },
        { title: "FAI73-3", key: "faI73_3", align: "center", width: 100, tooltip: true },
        { title: "FAI73-4", key: "faI73_4", align: "center", width: 100, tooltip: true },
        { title: "FAI73-5", key: "faI73_5", align: "center", width: 100, tooltip: true },
        { title: "FAI76-6", key: "faI76_6", align: "center", width: 100, tooltip: true },
        { title: "FAI85", key: "faI85", align: "center", width: 100, tooltip: true },
        { title: "解析时间", key: "filecretetime", align: "center", width: 125, render: renderDate, tooltip: true },
      ], // 表格数据
    };
  },
  activated () {
    this.tableConfig.loading = false;
    this.autoSize();
    window.addEventListener("resize", () => this.autoSize());
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
      let { modelName, workOrder, buildConfig, lineName, panelNo, unitId, startTime, endTime } = this.req;
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          this.tableConfig.loading = true;
          let obj = {
            orderField: 'FILECRETETIME', // 排序字段
            ascending: true, // 是否升序
            pageSize: this.req.pageSize, // 分页大小
            pageIndex: this.req.pageIndex, // 当前页码
            data: {
              startTime: formatDate(startTime),
              endTime: formatDate(endTime),
              modelName: commaSplitString(modelName).join(),
              workOrder: workOrder.toString(),
              buildConfig: commaSplitString(buildConfig).join(),
              lineName: lineName.toString(),
              panelNo: commaSplitString(panelNo).join(),
              unitId: commaSplitString(unitId).join()
            },
          };
          getpagelistReq(obj)
            .then((res) => {
              this.tableConfig.loading = false;
              if (res.code === 200) {
                let { data, pageSize, pageIndex, total, totalPage } = res.result;
                this.data = data || [];
                this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
                this.searchPoptipModal = false;
              }
            })
            .catch(() => (this.tableConfig.loading = false));
        }
      });
    },
    // 导出
    exportClick () {
      let { modelName, workOrder, buildConfig, lineName, panelNo, unitId, startTime, endTime } = this.req;
      let obj = {
        startTime: formatDate(startTime),
        endTime: formatDate(endTime),
        modelName: commaSplitString(modelName).join(),
        workOrder: workOrder.toString(),
        buildConfig: commaSplitString(buildConfig).join(),
        lineName: lineName.toString(),
        panelNo: commaSplitString(panelNo).join(),
        unitId: commaSplitString(unitId).join()
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `CTE数据${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
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
