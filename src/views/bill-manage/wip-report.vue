/* WIP报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400"
                      trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent
                        @keyup.native.enter="searchClick">
                    <!-- 起始时间 -->
                    <FormItem :label="$t('startTime')" prop="startTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')"
                                  format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"
                                  v-model="req.startTime"></DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')"
                                  format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"
                                  v-model="req.endTime"></DatePicker>
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
                    <!-- 料号 -->
                    <FormItem :label="$t('pn')" prop="pn">
                      <Input v-model.trim="req.pn" placeholder="请输入料号,多个以英文逗号分隔"
                             @on-search="searchClick"/>
                    </FormItem>
                    <!-- 产品代码 -->
                    <FormItem :label="$t('modelName')" prop="modelname">
                      <Input v-model.trim="req.modelname" :placeholder="$t('pleaseEnter') + $t('modelName')"
                             @on-search="searchClick"/>
                    </FormItem>
                    <!-- 制程类型 -->
                    <FormItem :label="$t('modelType')" prop="modelType">
                      <RadioGroup v-model="req.modelType">
                        <Radio label="SMT">SMT</Radio>
                        <Radio label="BE">BE</Radio>
                      </RadioGroup>
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
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height"
               :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize"
                     @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
      </Card>
    </div>
  </div>
</template>

<script>
import {getpagelistReq, exportReq} from "@/api/bill-manage/wip-report";
import {getButtonBoolean, formatDate, exportFile, renderDate} from "@/libs/tools";
import { workerPageListUrl } from "@/api/material-manager/order-info";

export default {
  name: "wip-report",
  data() {
    return {
      workerPageListUrl: workerPageListUrl(),
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: {...this.$config.tableConfig}, // table配置
      data: [], // 表格数据
      btnData: [],
      req: {
        startTime: "",
        endTime: "",
        workOrder: "", //工单
        pn: "",
        modelname: "",
        modelType: "",
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [
        {
          type: "index", fixed: "left", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        {title: this.$t("workOrder"), key: "workorder", align: "center", width: 140, tooltip: true},
        {title: this.$t("pn"), key: "pn", align: "center", width: 120, tooltip: true},
        {title: this.$t("modelName"), key: "modelname", align: "center", width: 140, tooltip: true},
        {title: this.$t("customerModel"), key: "customerno", align: "center", width: 90, tooltip: true},
        {title: this.$t("workOrderInfo"), key: "workordeR_INFO", align: "center", width: 140, tooltip: true},
        {title: this.$t("createDate"), key: "createdate", align: "center", render: renderDate, width: 140, tooltip: true},
        {title: this.$t("scheduleEndDate"), key: "scheduleenddate", align: "center", render: renderDate, width: 140, tooltip: true},
        {title: this.$t("workOrderQTY"), key: "qty", align: "center", width: 80, tooltip: true},
        {title: this.$t("inputQTY"), key: "inputqty", align: "center", width: 80, tooltip: true},
        {title: this.$t("finishQTY"), key: "finishqty", align: "center", width: 80, tooltip: true},
        {title: this.$t("processName"), key: "curprocessname", align: "center", width: 100, tooltip: true},
        {title: this.$t("curProcessNameQTY"), key: "curprocessnameqty", align: "center", width: 120, tooltip: true},
      ], // 表格数据
    };
  },
  activated() {
    this.pageLoad();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave(to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 点击搜索按钮触发
    searchClick() {
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 获取分页列表数据
    pageLoad() {
      this.data = [];
      this.tableConfig.loading = false;
      let {startTime, endTime, workOrder, pn, modelname, modelType} = this.req;
      if (startTime && endTime) {
        if(workOrder || pn || modelname || modelType) {
            this.$refs.searchReq.validate((validate) => {
            if (validate) {
                this.tableConfig.loading = true;
                let obj = {
                orderField: "PN", // 排序字段
                ascending: true, // 是否升序
                pageSize: this.req.pageSize, // 分页大小
                pageIndex: this.req.pageIndex, // 当前页码
                data: {
                    startTime: formatDate(startTime),
                    endTime: formatDate(endTime),
                    workOrder, //工单
                    pn,
                    modelname,
                    modelType,
                },
                };
                getpagelistReq(obj).then((res) => {
                this.tableConfig.loading = false;
                if (res.code === 200) {
                    let {data, pageSize, pageIndex, total, totalPage} = res.result;
                    this.data = data || [];
                    this.req = {...this.req, pageSize, pageIndex, total, totalPage};
                }
                })
                .catch(() => (this.tableConfig.loading = false));
                this.searchPoptipModal = false;
            }
            });
        }else {
            this.$Message.warning('除时间以外，其它条件不能全为空');
        }
      } else {
        this.$Message.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
      }
    },
    // 导出
    exportClick() {
      let {startTime, endTime, workOrder, pn, modelname, modelType} = this.req;
      if (startTime && endTime) {
        let obj = {
            startTime: formatDate(startTime),
            endTime: formatDate(endTime),
            workOrder, //工单
            pn,
            modelname,
            modelType,
        };
        exportReq(obj).then((res) => {
          let blob = new Blob([res], {type: "application/vnd.ms-excel"});
          const fileName = `${this.$t("wip-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
          exportFile(blob, fileName);
        });
      } else {
        this.$Message.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
      }
    },
    // 点击重置按钮触发
    resetClick() {
      this.$refs.searchReq.resetFields();
    },
    // 自动改变表格高度
    autoSize() {
      this.tableConfig.height = document.body.clientHeight - 120 - 60;
    },
    // 选择第几页
    pageChange(index) {
      this.req.pageIndex = index;
      this.pageLoad();
    },
    // 选择一页有条数据
    pageSizeChange(index) {
      this.req.pageIndex = 1;
      this.req.pageSize = index;
      this.pageLoad();
    },
  },
};
</script>
