/*淀山湖质量 查询 报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Tabs type="card" closable @on-tab-remove="handleTabRemove" v-model="tabName">
        <TabPane label="质量良率" name="tab1" :index="1" v-if="tab1" :closable="false">
          <Card :bordered="false" dis-hover class="card-style">
            <div slot="title">
              <Row>
                <i-col span="12">
                  <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
                    <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">{{ $t("selectQuery") }}</Button>
                    <div class="poptip-style-content" slot="content">
                      <Form :label-width="70" :label-colon="true" @submit.native.prevent ref="searchReq" :model="req" @keyup.native.enter="searchClick">
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
                          <v-selectpage v-if="searchPoptipModal" ref="workOrder" class="select-page-style" key-field="workOrder" show-field="workOrder" :data="workerPageListUrl" v-model="req.workOrder" :placeholder="$t('pleaseSelect') + $t('workOrder')" :result-format="
                          (res) => {
                            return {
                              totalRow: res.total,
                              list: res.data || [],
                            };
                          }
                        ">
                          </v-selectpage>
                        </FormItem>
                        <!-- config -->
                        <FormItem :label="$t('config')" prop="config">
                          <Input v-model.trim="req.config" :placeholder="$t('pleaseEnter') + $t('config')
                            " @on-keyup.enter="searchClick" />
                        </FormItem>
                      </Form>
                      <div class="poptip-style-button">
                        <Button @click="resetClick">{{ $t("reset") }}</Button>
                        <Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
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
              <!-- Cum Input @click="show(row, 1) style="color:blue;cursor:pointer""-->
              <template slot-scope="{ row }" slot="inputs">
                <div>
                  {{ row.inputs }}
                </div>
              </template>
              <!-- 产出 @click="show(row, 2)"-->
              <template slot-scope="{ row }" slot="outputs">
                <div>
                  {{ row.outputs }}
                </div>
              </template>
              <!-- 一次检查pass @click="show(row, 3)-->
              <template slot-scope="{ row }" slot="firstPass">
                <div>
                  {{ row.firstPass }}
                </div>
              </template>
              <!-- Cum RePass @click="show(row, 4)-->
              <template slot-scope="{ row }" slot="rePass">
                <div>
                  {{ row.rePass }}
                </div>
              </template>
              <!-- 良率 -->
              <template slot-scope="{ row }" slot="yield">
                <div>{{ (row.yield * 100).toFixed(2) }}%</div>
              </template>
            </Table>
          </Card>
        </TabPane>
        <!-- <TabPane label="投入数" name="tab2" :index="2" v-if="tab2">
          <TabTable ref="tab2" />
        </TabPane>
        <TabPane label="一次检测通过" name="tab3" :index="3" v-if="tab3">
          <TabTable ref="tab3" />
        </TabPane>
        <TabPane label="重测pass" name="tab4" :index="4" v-if="tab4">
          <TabTable ref="tab4" />
        </TabPane>
        <TabPane label="所有不良" name="tab5" :index="5" v-if="tab5">
          <TabTable ref="tab5" />
        </TabPane>
        <TabPane label="最终不良" name="tab6" :index="6" v-if="tab6">
          <TabTable ref="tab6" />
        </TabPane>
        <TabPane label="产出" name="tab7" :index="7" v-if="tab7">
          <TabTable ref="tab7" />
        </TabPane> -->
      </Tabs>
    </div>
  </div>
</template>

<script>
import { getlistReq, trackOutExportReq } from "@/api/bill-manage/quality-yield-lake-report";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { formatDate, getButtonBoolean } from "@/libs/tools"; //commaSplitString
// import TabTable from "./quality-yield-query-report/tabTable.vue";
import { exportFile } from "@/libs/tools";

export default {
  //   components: { TabTable },
  name: "quality-yield-lake-report",
  data () {
    return {
      tabName: "tab1",
      tab1: true,
      //   tab2: false,
      //   tab3: false,
      //   tab4: false,
      //   tab5: false,
      //   tab6: false,
      //   tab7: false,
      workerPageListUrl: workerPageListUrl(),
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      dataModal: [], // 模态框表格数据
      currentRow: {}, // 当前点击表格行数据
      currentType: "", // 当前点击表格行数据类型
      searchPoptipModal: false,
      btnData: [],
      req: {
        startTime: "",
        endTime: "",
        workOrder: "", //工单
        pn: "", // 料号,
        linename: "", // 线体
        subline: '',
        buildtype: "", //段别
        unitid: "", //unidId
        config: "",
        ...this.$config.pageConfig,
      }, //查询数据
      searchObj: {},
      modalReq: {
        ...this.$config.pageConfig,
      },
      columns: [
        {
          type: "index",
          fixed: "left",
          width: 50,
          align: "center",
          indexMethod: (row) => {
            return row._index + 1;
          },
        },
        {
          title: 'MSTEPID',
          key: "stepName",
          minWidth: 140,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: 'Cum Input',
          minWidth: 80,
          align: "center",
          slot: "inputs",
        },
        {
          title: "Cum Output",
          minWidth: 80,
          align: "center",
          slot: "outputs",
        },
        {
          title: "Cum 1stPass",
          minWidth: 80,
          align: "center",
          slot: "firstPass",
        },
        {
          title: "Cum RePass",
          minWidth: 80,
          align: "center",
          slot: "rePass",
        },
        {
          title: "Cum Yield",
          minWidth: 80,
          align: "center",
          slot: "yield",
        },
      ],
    };
  },
  activated () {
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
  },
  deactivated () {
    this.searchPoptipModal = false;
  },
  methods: {
    handleTabRemove (name) {
      this[name] = false;
    },
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = false;
      const { workOrder, config, startTime, endTime } = this.req;
      this.tableConfig.loading = true;
      this.searchObj = {
        startDate: formatDate(startTime),
        endDate: formatDate(endTime),
        workorder: workOrder, //commaSplitString(workOrder).join()
        config,
      };
      getlistReq(this.searchObj).then((res) => {
        this.tableConfig.loading = false;
        if (res.code === 200) {
          this.data = res.result || [];
          this.searchPoptipModal = false;
        }
      })
        .catch(() => (this.tableConfig.loading = false));
    },
    // 导出
    exportClick () {
      const { workOrder, config, startTime, endTime } = this.req;
      const obj = {
        startDate: formatDate(startTime),
        endDate: formatDate(endTime),
        workorder: workOrder,//commaSplitString(workOrder).join(),
        config
      };
      trackOutExportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("quality-yield-query-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    // 表格单元格点击事件
    show (row, type) {
      let obj = { ...this.searchObj, tracktype: String(type), stepname: row.stepname };
      let index = type + 1;
      this.tabName = "tab" + index;
      this["tab" + index] = true;
      this.$nextTick(() => {
        this.$refs["tab" + index].req.pageIndex = 1;
        this.$refs["tab" + index].queryObj = obj;
        this.$refs["tab" + index].pageLoad(obj);
      });
    },
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 180;
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
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
      this.$refs.workOrder.remove();
    },
    // 点击搜索按钮触发
    searchClick () {
      this.req.pageIndex = 1;
      this.pageLoad();
    },
  },
  mounted () {
    this.pageLoad();
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-tabs-nav-container {
  line-height: 2;
}
/deep/ .ivu-tabs-bar {
  margin-bottom: 0;
}
</style>
