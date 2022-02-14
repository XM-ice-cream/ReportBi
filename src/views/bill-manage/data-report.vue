/* 数据报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="350" trigger="manual">
                <Button type="primary" icon="ios-search" @click.stop="poptipModal = !poptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent>
                    <!-- 起始时间 -->
                    <FormItem :label="$t('startTime')" prop="startTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
                    </FormItem>
                    <!-- 工单 -->
                    <FormItem :label="$t('workOrder')" prop="workOrder">
                      <v-selectpage class="select-page-style" v-if="poptipModal" key-field="workOrder" show-field="workOrder" :data="workerPageListUrl" v-model="req.workOrder" :placeholder="$t('pleaseSelect') + $t('workOrder')" :result-format="
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
                      <v-selectpage class="select-page-style" v-if="poptipModal" key-field="pn" show-field="pn" :data="pnPageListUrl" v-model="req.pn" :placeholder="$t('pleaseSelect') + $t('pn')" :result-format="
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
                      <Select v-model="req.lineName" clearable filterable :placeholder="`${$t('pleaseEnter')}${$t('line')}`">
                        <Option v-for="(item, i) in lineList" :value="item.name" :key="i">{{ item.name }}</Option>
                      </Select>
                    </FormItem>
                    <!-- 机种 -->
                    <FormItem :label="$t('model')" prop="model">
                      <v-selectpage class="select-page-style" v-if="poptipModal" key-field="modelName" show-field="modelName" :data="modelPageListUrl" v-model="req.model" :placeholder="$t('pleaseSelect') + $t('model')" :result-format="
                            (res) => {
                              return {
                                totalRow: res.total,
                                list: res.data || [],
                              };
                            }
                          ">
                      </v-selectpage>
                    </FormItem>
                    <!-- unitId -->
                    <FormItem :label="$t('unitId')" prop="unitId">
                      <Input v-model="req.unitId" :placeholder="$t('pleaseEnter') + $t('unitId')" @keyup.native.enter="searchClick" />
                    </FormItem>
                    <!-- panelNo -->
                    <FormItem :label="$t('panelNo')" prop="panelno">
                      <Input v-model="req.panelno" :placeholder="$t('pleaseEnter') + $t('panelNo')" @keyup.native.enter="searchClick" />
                    </FormItem>
                    <!-- 站点 -->
                    <FormItem :label="$t('stepName')" prop="stepId">
                      <treeselect v-model="req.stepId" :options="processList" :show-count="true" :disable-branch-nodes="true" trans @input="processInput" @select="value => req.stepName = value.label" :placeholder="$t('pleaseSelect') + $t('stepName')" />
                    </FormItem>
                    <!-- 机台编号 -->
                    <FormItem :label="$t('machineNumber')" prop="eqpId">
                      <v-selectpage class="select-page-style" v-if="poptipModal" key-field="enCode" show-field="enCode" :params="{ category: 'Auto' }" :data="eqpPageListUrl" v-model="req.eqpId" :placeholder="$t('pleaseSelect') + $t('machineNumber')" :result-format="
                        (res) => {
                          return {
                            totalRow: res.total,
                            list: res.data || [],
                          };
                        }
                      ">
                      </v-selectpage>
                    </FormItem>
                    <!-- pcbBin -->
                    <FormItem label="pcbBin" prop="pcbBin">
                      <Input v-model="req.pcbBin" :placeholder="$t('pleaseEnter') + 'pcbBin'" @keyup.native.enter="searchClick" />
                    </FormItem>
                    <!-- ledBin -->
                    <FormItem label="ledBin" prop="ledBin">
                      <Input v-model="req.ledBin" :placeholder="$t('pleaseEnter') + 'ledBin'" @keyup.native.enter="searchClick" />
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/data-report";
import { getButtonBoolean, initTreeList, renderDate, treeLoop, formatDate, exportFile } from "@/libs/tools";
import { modelPageListUrl } from "@/api/basis-info/model-manager";
import { pnPageListUrl } from "@/api/basis-info/part-master";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { getlisttreeauthReq } from "@/api/basis-info/area-floor";
import { eqpPageListUrl } from "@/api/eqp-manage/eqp-info";
import { getlisttreeReq } from "@/api/basis-info/zone-manage";

export default {
  name: "data-report",
  data () {
    return {
      modelPageListUrl: modelPageListUrl(),
      pnPageListUrl: pnPageListUrl(),
      workerPageListUrl: workerPageListUrl(),
      eqpPageListUrl: eqpPageListUrl(),
      poptipModal: false,
      noRepeatRefresh: false, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      req: {
        startTime: '',
        endTime: '',
        workOrder: '', // 工单
        pn: '', // 料号
        unitId: '', // unitId
        panelno: '', // panelno
        lineName: '', // 线体
        stepName: '', // 站点
        stepId: null, // 站点
        model: '', // 机种
        eqpId: '', // 机台编号
        pcbBin: '', // pcbBin
        ledBin: '', // ledBin
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [
        {
          type: "index", fixed: "left", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: this.$t("workOrder"), key: "workOrder", align: "center", width: 140, },
        { title: this.$t("pn"), key: "pn", align: "center", width: 140, },
        { title: this.$t("lineName"), key: "lineName", align: "center", width: 140, },
        { title: this.$t("model"), key: "model", align: "center", width: 140, },
        { title: this.$t("stepName"), key: "stepName", align: "center", width: 140, },
        { title: 'unitId', key: "unitId", align: "center", width: 140, },
        { title: this.$t("machineNumber"), key: "eqpId", align: "center", width: 140, },
        { title: 'pcbBin', key: "pcbBin", align: "center", width: 140, },
        { title: 'ledBin', key: "ledBin", align: "center", width: 140, },
        { title: this.$t("description"), key: "description", minWidth: 120, tooltip: true, align: "center" },
        { title: this.$t("createUser"), key: "createUserName", width: 80, align: "center" },
        { title: this.$t("createDate"), key: "createDate", width: 125, align: "center", render: renderDate, },
        { title: this.$t("modifyUser"), key: "modifyUserName", width: 80, align: "center" },
        { title: this.$t("modifyDate"), key: "modifyDate", width: 125, align: "center", render: renderDate, },
      ], // 表格数据
      data: [], // 表格数据
      btnData: [],
      lineList: [], // 线体数据
      processList: [], // 制程列表
    };
  },
  mounted () {
    this.pageLoad();
  },
  activated () {
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    this.getLineListData()
    this.getProcessList()
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
      const { workOrder, pn, unitId, panelno, lineName, stepName, model, eqpId, pcbBin, ledBin, startTime, endTime } = this.req
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          this.tableConfig.loading = true;
          let obj = {
            orderField: this.req.orderField, // 排序字段
            ascending: this.req.ascending, // 是否升序
            pageSize: this.req.pageSize, // 分页大小
            pageIndex: this.req.pageIndex, // 当前页码
            data: {
              workOrder, pn, unitId, panelno, lineName, stepName, model, eqpId, pcbBin, ledBin,
              startTime: formatDate(startTime),
              endTime: formatDate(endTime),
            },
          };
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
    // 导出
    exportClick () {
      const { workOrder, pn, unitId, panelno, lineName, stepName, model, eqpId, pcbBin, ledBin, startTime, endTime } = this.req
      const obj = {
        workOrder, pn, unitId, panelno, lineName, stepName, model, eqpId, pcbBin, ledBin,
        startTime: formatDate(startTime),
        endTime: formatDate(endTime),
      }
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("data-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    // 获取线体数据
    getLineListData () {
      const obj = {
        userId: this.$store.state.id,
        systemFlag: this.$store.state.systemFlag,
        enabled: 1,
      };
      getlisttreeauthReq(obj).then((res) => {
        if (res.code === 200) {
          let arr = [];
          initTreeList(arr, res.result || []);
          this.lineList = arr.filter((o) => o.category === 4);
        }
      });
    },
    // 获取制程数据
    getProcessList () {
      const obj = {
        systemFlag: this.$store.state.systemFlag,
        id: "",
        parentId: "0",
        name: "",
        category: 0,
        enabled: -1,
      };
      getlisttreeReq(obj).then(res => {
        if (res.code === 200) {
          this.processList = []
          const arr = ['BE', 'Encap', 'SMT']
          const processData = res.result.filter(o => arr.includes(o.name))
          treeLoop(this.processList, processData, (node) => {
            node.label = node.name;
          });
        }
      })
    },
    // 制程选择操作
    processInput (value) {
      if (!value) {
        this.req.stepName = '';
      }
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
