<template>
  <!-- 流程卡 -->
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="12">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400"
                      trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent>
                    <!-- 进制程时间 -->
                    <FormItem :label="$t('inProcessTime')" prop="inProcessTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('inProcessTime')"
                                  format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"
                                  v-model="req.inProcessTime"></DatePicker>
                    </FormItem>
                    <!-- 出制程时间 -->
                    <FormItem :label="$t('outProcessTime')" prop="outProcessTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('outProcessTime')"
                                  format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"
                                  v-model="req.outProcessTime"></DatePicker>
                    </FormItem>
                    <!-- 工单 -->
                    <FormItem :label="$t('workOrder')" prop="workOrder">
                      <v-selectpage ref="workOrderSP" v-if="searchPoptipModal" class="select-page-style" key-field="workOrder"
                                    show-field="workOrder" :data="workerPageListUrl" v-model="req.workOrder"
                                    :placeholder="$t('pleaseSelect') + $t('workOrder')" @values="wordOrderChange"
                                    :result-format="
                          (res) => {
                            return {
                              totalRow: res.total,
                              list: res.data || [],
                            };
                          }
                        ">
                      </v-selectpage>
                    </FormItem>
                    <!-- 制程 -->
                    <FormItem :label="$t('process')" prop="processId" v-show="req.workOrder">
                      <Select v-model="req.processId" transfer filterable clearable
                              :placeholder="$t('pleaseSelect') + $t('process')" label-in-value>
                        <Option v-for="(item, i) in processList" :value="item.id" :key="i">
                          {{ item.name }}
                        </Option>
                      </Select>
                    </FormItem>
                    <!-- 线体 -->
                    <FormItem :label="$t('line')" prop="lineName">
                      <Select v-model="req.lineName" transfer filterable clearable
                              :placeholder="$t('pleaseSelect') + $t('line')">
                        <Option v-for="(item, i) in lineList" :value="item.name" :key="i">
                          {{ item.name }}
                        </Option>
                      </Select>
                    </FormItem>
                    <!-- 大条码 -->
                    <FormItem :label="$t('bigBarcode')" prop="panelNo">
                      <Input v-model.trim="req.panelNo" :placeholder="$t('pleaseEnter') + $t('bigBarcode')"
                             @keyup.native.enter="searchClick"/>
                    </FormItem>
                    <!-- 小条码 -->
                    <FormItem :label="$t('sn')" prop="unitId">
                      <Input v-model.trim="req.unitId" :placeholder="$t('pleaseEnter') + $t('sn')"
                             @keyup.native.enter="searchClick"/>
                    </FormItem>
                    <!-- 56条码 -->
                    <FormItem :label="$t('unitId56')" prop="unitId56">
                      <Input v-model="req.unitId56" :placeholder="$t('pleaseEnter') + $t('unitId56')"
                             @keyup.native.enter="searchClick"/>
                    </FormItem>
                    <!-- 56条码 -->
                    <FormItem :label="$t('boxCode')" prop="boxNo">
                      <Input v-model="req.boxNo" :placeholder="$t('pleaseEnter') + $t('boxCode')"
                             @keyup.native.enter="searchClick"/>
                    </FormItem>
                    <!-- 56条码 -->
                    <FormItem :label="$t('cartonCode')" prop="cartonNo">
                      <Input v-model="req.cartonNo" :placeholder="$t('pleaseEnter') + $t('cartonCode')"
                             @keyup.native.enter="searchClick"/>
                    </FormItem>
                    <!-- 56条码 -->
                    <FormItem :label="$t('palletCode')" prop="palletNo">
                      <Input v-model="req.palletNo" :placeholder="$t('pleaseEnter') + $t('palletCode')"
                             @keyup.native.enter="searchClick"/>
                    </FormItem>
                    <!-- 56条码 -->
                    <FormItem :label="$t('carrier')" prop="carrier">
                      <Input v-model="req.carrier" :placeholder="$t('pleaseEnter') + $t('carrier')"
                             @keyup.native.enter="searchClick"/>
                    </FormItem>
                    <div class="poptip-style-button">
                      <Button @click="resetClick">{{ $t("reset") }}</Button>
                      <Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
                    </div>
                  </Form>
                </div>
              </Poptip>
            </i-col>
            <i-col span="12">
              <button-custom :btnData="btnData" @on-jumpStation-click="jumpStationClick" @on-unlock-click="unlockClick"
                             @on-export-click="exportClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height"
               :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick"
               @on-sort-change="sortChange"></Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize"
                     @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
      </Card>
    </div>
    <JumpStation ref="refJumpStation"/>
    <Unlock ref="refUnlock"/>
  </div>
</template>

<script>
import {getpagelistReq, exportReq} from "@/api/bill-manage/flow-card";
import {formatDate, getButtonBoolean, exportFile, renderDate, renderState, renderColorSpan,} from "@/libs/tools";
import {workerPageListUrl} from "@/api/material-manager/order-info";
import JumpStation from "./flow-work/jump-station.vue";
import Unlock from "./flow-work/unlock.vue";
import {getallprocessReq} from "@/api/basis-info/wf-route";
import {getfloorlistReq} from "@/api/basis-info/area-floor";

export default {
  name: "flow-card",
  components: {JumpStation, Unlock},
  data() {
    return {
      tableConfig: {...this.$config.tableConfig}, // table配置
      selectObj: null, // 表格选中数据
      workerPageListUrl: workerPageListUrl(),
      searchPoptipModal: false,
      realTimeData: 1, //是否是实时天数
      dataDays: 2, //实时数据天数
      data: [], // 表格数据
      btnData: [],
      processList: [],
      lineList: [],
      columns: [
        {
          type: "index",
          width: 50,
          align: "center",
          fixed: "left",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        {title: this.$t("workOrder"), key: "workOrder", fixed: "left", width: 120, tooltip: true,align:'center'},
        {title: this.$t("bigBarcode"), key: "panelNo", fixed: "left", width: 140,align:'center'},
        {
          title: this.$t("sn"),
          key: "unitId",
          fixed: "left",
          width: 140,
          tooltip: true,
          render: (h, params) => {
            let color = params.row.splitFlag === "Y" ? "blue" : "";
            return renderColorSpan(h, color, params.row.unitId);
          },
          align:'center'
        },
        {
          title: this.$t("cavity"),
          key: "boardNo",
          width: 50,
          render: (h, params) => {
            let color = params.row.xFlag === "Y" ? "red" : "";
            return renderColorSpan(h, color, params.row.boardNo);
          },
          align:'center'
        },
        {
          title: this.$t("currentStatus"),
          key: "currentStatus",
          width: 70,
          render: (h, params) => {
            let color = params.row.currentStatus === "Pass" ? "#19be6b" : "#ff9900";
            return renderState(h, color, params.row.currentStatus);
          },
          align:'center'
        },
        {
          title: this.$t("curProcessName"),
          key: "curProcessName",
          width: 200,
          render: (h, params) => {
            let text = params.row.curProcessName + " / " + params.row.ruleName;
            return h("span", text);
          },
          align:'center'
        },
        {title: this.$t("nextProcessName"), key: "nextProcessName", width: 200, tooltip: true,align:'center'},
        {title: this.$t("partName"), key: "partName", width: 150,align:'center'},
        {title: this.$t("lineName"), key: "lineName", width: 120,align:'center'},
        {title: this.$t("equipmentId"), key: "eqpId", width: 150, tooltip: true,align:'center'},
        {title: this.$t("flow"), key: "routeName", width: 110,align:'center'},
        {title: this.$t("unitId56"), key: "unitId56", width: 200, tooltip: true,align:'center'},
        {title: 'KeyParts', key: "keyParts", width: 200, tooltip: true,align:'center'},
        {title: this.$t("inProcessTime"), key: "inProcessTime", width: 125, render: renderDate,align:'center'},
        {title: this.$t("outProcessTime"), key: "outProcessTime", width: 125, render: renderDate,align:'center'},
        {title: this.$t("palletCode"), key: "palletNo", width: 100,align:'center'},
        {title: this.$t("cartonCode"), key: "cartonNo", width: 100,align:'center'},
        {title: this.$t("boxCode"), key: "boxNo", width: 100,align:'center'},
        {title: this.$t("action"), key: "action", width: 80,align:'center'},
        {title: "carrier", key: "carrier", width: 180,align:'center'},
        {title: "magazine", key: "magazine", width: 180,align:'center'},
        {title: this.$t("remark"), key: "remark", width: 180,align:'center'},
        {title: this.$t("createUserName"), key: "createUserName", width: 125,align:'center'},
        {title: this.$t("operationDate"), key: "createDate", render: renderDate, width: 125,align:'center'},
      ], // 表格数据
      req: {
        inProcessTime: "", // 进制程时间
        outProcessTime: "", // 出制程时间
        workOrder: "", // 工单
        lineName: "", // 线体
        panelNo: "", // 大条码
        unitId: "", // 小条码
        unitId56: "", // 56条码
        processId: "", // 当前站点Id（根据工单获取ProcessId）
        boxNo: "", //彩盒数
        cartonNo: "", //箱数
        palletNo: "", //栈板数
        carrier: "", //载具
        xFlag: "Y",
        enabled: -1, // 是否有效
        ...this.$config.pageConfig,
      }, //查询数据
    };
  },
  mounted () {
    this.pageLoad();
  },
  activated() {
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
    this.getLineList();
    if (this.$route.params.unitId) {
      this.req.unitId = this.$route.params.unitId
      this.pageLoad()
    }
  },
  // 导航离开该组件的对应路由时调用
  deactivated() {
    this.searchPoptipModal = false;
  },
  methods: {
    // 获取分页列表数据
    pageLoad() {
      this.tableConfig.loading = false;
      let {inProcessTime, outProcessTime, workOrder, lineName, panelNo, unitId, unitId56, processId, boxNo, cartonNo, palletNo, carrier, enabled,} = this.req;
      this.tableConfig.loading = true;
      const obj = {
        orderField: "CreateDate", // 排序字段
        ascending: false, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          inProcessTime: inProcessTime ? formatDate(inProcessTime): '',
          outProcessTime: outProcessTime ? formatDate(outProcessTime): '',
          workOrder, lineName, panelNo, unitId, unitId56, processId, boxNo, cartonNo, palletNo, carrier, enabled,
        },
        isFuzzyKey: ["panelNo", "unitId", "unitId56", "carrier", "boxNo", "cartonNo", "palletNo",],
      };
      getpagelistReq(obj).then((res) => {
        this.tableConfig.loading = false;
        this.searchPoptipModal = false
        if (res.code === 200) {
          let {data, pageSize, pageIndex, total, totalPage} = res.result;
          this.req = {...this.req, pageSize, pageIndex, total, totalPage};
          this.data = data || [];
        }
      }).catch(() => (this.tableConfig.loading = false));
    },
    // 获取制程数据
    wordOrderChange (data) {
      this.processList = [];
      if (data.length) {
        //获取制程数据
        let { workOrder, routeId } = data[0];
        getallprocessReq({ workOrder, routeId }).then((res) => {
          if (res.code === 200) {
            this.processList = res.result || [];
          }
        });
      }
    },
    getLineList() {
      let obj = {
        userId: this.$store.state.id,
        systemFlag: this.$store.state.systemFlag,
        category: 4,
        enabled: 1,
      };
      getfloorlistReq(obj).then((res) => {
        if (res.code === 200) {
          this.lineList = res.result || [];
        }
      })
    },
    // 点击跳站按钮触发
    jumpStationClick() {
      this.$refs.refJumpStation.drawerFlag = true;
    },
    // 点击解锁按钮触发
    unlockClick() {
      this.$refs.refUnlock.drawerFlag = true;
    },
    // 导出
    exportClick() {
      let {inProcessTime, outProcessTime, workOrder, lineName, panelNo, unitId, unitId56, processId, boxNo, cartonNo, palletNo, carrier, enabled,} = this.req;
      if (!(inProcessTime || outProcessTime || workOrder || lineName || panelNo || unitId || unitId56 || processId
          || boxNo || cartonNo || palletNo || carrier)) return this.$Msg.warning('查询条件不允许为空')
      let obj = {
        inProcessTime: inProcessTime ? formatDate(inProcessTime): '',
        outProcessTime: outProcessTime ? formatDate(outProcessTime): '',
        workOrder, lineName, panelNo, unitId, unitId56, processId, boxNo, cartonNo, palletNo, carrier, enabled,
        isFuzzyKey: ["panelNo", "unitId", "unitId56", "carrier", "boxNo", "cartonNo", "palletNo",],
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], {type: "application/vnd.ms-excel"});
        const fileName = `${this.$t("flow-card")}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    // 点击搜索按钮触发
    searchClick() {
      this.selectObj = null;
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 点击重置按钮触发
    resetClick() {
      this.$refs.searchReq.resetFields();
      this.$refs.workOrderSP.remove(); //下拉分页插件选中项
    },
    // 自动改变表格高度
    autoSize() {
      let height = document.body.clientHeight - 120;
      this.tableConfig.height = height - 60;
    },
    // 某一行高亮时触发
    currentClick(currentRow) {
      this.selectObj = currentRow;
    },
    // 排序时有效，当点击排序时触发
    sortChange(data) {
      this.req.orderField = data.key.toUpperCase();
      this.req.ascending = data.order === "asc";
      this.pageLoad();
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
