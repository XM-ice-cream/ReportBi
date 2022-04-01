/* LedWip看板报表 */
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
                        
                        <!-- workOrderInfo -->
                        <FormItem :label="$t('workOrderInfo')" prop="workOrderInfo">
                          <Input v-model.trim="req.workOrderInfo" :placeholder="
                              $t('pleaseEnter') +'指定格式的'+ $t('workOrderInfo')
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
              <!-- 线体 -->
              <template slot-scope="{ row }" slot="line">
                <div>{{ row.line }}</div>
              </template>
              <!-- 机种 -->
              <template slot-scope="{ row }" slot="mode">
                <div>{{ row.mode }}</div>
              </template>
              <!-- 段别 -->
              <template slot-scope="{ row }" slot="moType">
                <div>{{ row.moType }}</div>
              </template>
              <!-- 工单 -->
              <template slot-scope="{ row }" slot="moNumber">
                <div style="white-space:pre">{{ row.moNumber}}</div>
              </template>
              <!-- 工单数量 -->
              <template slot-scope="{ row }" slot="moQty">
                <div style="white-space:pre">{{ row.moQty }}</div>
              </template>
              <!-- category -->
              <template slot-scope="{ row }" slot="category">
                <div>{{ row.category }}</div>
              </template>
              <!-- AutoTape -->
              <template slot-scope="{ row }" slot="step1">
                <div>{{ row.step1 }}</div>
              </template>
              <!-- HBDispense -->
              <template slot-scope="{ row }" slot="step2">
                <div>{{ row.step2 }}</div>
              </template>
              <!-- OP40 -->
              <template slot-scope="{ row }" slot="step3">
                <div>{{ row.step3 }}</div>
              </template>
              <!-- AutoOnOff -->
              <template slot-scope="{ row }" slot="step4">
                <div>{{ row.step4 }}</div>
              </template>
              <!-- PreBake -->
              <template slot-scope="{ row }" slot="step5">
                <div>{{ row.step5 }}</div>
              </template>
              <!-- DamDispense -->
              <template slot-scope="{ row }" slot="step6">
                <div>{{ row.step6 }}</div>
              </template>
              <!-- FillDispense -->
              <template slot-scope="{ row }" slot="step7">
                <div>{{ row.step7 }}</div>
              </template>
              <!-- AttachIPPF -->
              <template slot-scope="{ row }" slot="step8">
                <div>{{ row.step8 }}</div>
              </template>
              <!-- TapePeeling -->
              <template slot-scope="{ row }" slot="step9">
                <div>{{ row.step9 }}</div>
              </template>
              <!-- I16 -->
              <template slot-scope="{ row }" slot="step10">
                <div>{{ row.step10 }}</div>
              </template>
              <!-- FVI -->
              <template slot-scope="{ row }" slot="step11">
                <div>{{ row.step11 }}</div>
              </template>
              <!-- OQC -->
              <template slot-scope="{ row }" slot="step12">
                <div>{{ row.step12 }}</div>
              </template>
              <!-- Packing1 -->
              <template slot-scope="{ row }" slot="step13">
                <div>{{ row.step13 }}</div>
              </template>
              <!-- Packing2 -->
              <template slot-scope="{ row }" slot="step14">
                <div>{{ row.step14 }}</div>
              </template>
            </Table>
          </Card>
        </TabPane>
        <TabPane label="投入数" name="tab2" :index="2" v-if="tab2">
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
        </TabPane>
        <!-- <TabKanban /> -->
      </Tabs>
    </div>
  </div>
</template>

<script>
import { getlistReq,exportReq} from "@/api/bill-manage/led-wip-report";
import { formatDate, getButtonBoolean } from "@/libs/tools";
import TabTable from "./quality-yield-query-report/tabTable.vue";
import { exportFile } from "@/libs/tools";

export default {
  components: { TabTable },
  name: "led-wip-report",
  data () {
    return {
      tabName: "tab1",
      tab1: true,
      tab2: false,
      tab3: false,
      tab4: false,
      tab5: false,
      tab6: false,
      tab7: false,
      tab8: true,
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      dataModal: [], // 模态框表格数据
      currentRow: {}, // 当前点击表格行数据
      currentType: "", // 当前点击表格行数据类型
      searchPoptipModal: false,
      btnData: [],
      req: {
        workOrderInfo: "", //workOrderInfo
        // ...this.$config.pageConfig,
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
          title: "line",
          key: "line",
          minWidth: 80,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "mode",
          minWidth: 80,
          align: "center",
          slot: "mode",
        },
        {
          title: "moType",
          minWidth: 80,
          align: "center",
          slot: "moType",
        },
        {
          title: "moNumber",
          minWidth: 100,
          align: "center",
          slot: "moNumber",
        },
        {
          title: "moQty",
          minWidth: 80,
          align: "center",
          slot: "moQty",
        },
        {
          title: "category",
          minWidth: 80,
          align: "center",
          slot: "category",
        },
        {
          title: "AutoTape",
          minWidth: 80,
          align: "center",
          slot: "step1",
        },
        {
          title: "HBDispense",
          minWidth: 80,
          align: "center",
          slot: "step2",
        },
        {
          title: "OP40",
          minWidth: 80,
          align: "center",
          slot: "step3",
        },
        {
          title: 'AutoOnOff',
          minWidth: 80,
          align: "center",
          slot: "step4",
        },
        {
          title: 'PreBake',
          minWidth: 80,
          align: "center",
          slot: "step5",
        },
        {
          title: 'DamDispense',
          minWidth: 85,
          align: "center",
          slot: "step6",
        },
        {
          title: 'FillDispense',
          minWidth: 80,
          align: "center",
          slot: "step7",
        },
        {
          title: 'AttachIPPF',
          minWidth: 80,
          align: "center",
          slot: "step8",
        },
        {
          title: 'TapePeeling',
          minWidth: 80,
          align: "center",
          slot: "step9",
        },
        {
          title: 'I16',
          minWidth: 80,
          align: "center",
          slot: "step10",
        },
        {
          title: 'FVI',
          minWidth: 80,
          align: "center",
          slot: "step11",
        },
        {
          title: 'OQC',
          minWidth: 80,
          align: "center",
          slot: "step12",
        },
        {
          title: 'Packing1',
          minWidth: 80,
          align: "center",
          slot: "step13",
        },
        {
          title: 'Packing2',
          minWidth: 80,
          align: "center",
          slot: "step14",
        }
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
      const { workOrderInfo } = this.req;
      console.log(this.req);
      console.log(workOrderInfo);
      if (workOrderInfo) {
        this.tableConfig.loading = true;
        this.searchObj = {
          condition : workOrderInfo
        };
        getlistReq(this.searchObj)
          .then((res) => {
            this.tableConfig.loading = false;
            if (res.code === 200) {
              this.data = res.result || [];
              this.searchPoptipModal = false;
            }
          })
          .catch(() => (this.tableConfig.loading = false));
      } else {
        this.$Message.warning("请完善查询条件");
      }
    },
    // 导出
    exportClick () {
      const {workOrderInfo } = this.req;
      if (workOrderInfo) {
        const obj = {
          condition:workOrderInfo
        };
        exportReq(obj).then((res) => {
          let blob = new Blob([res], { type: "application/vnd.ms-excel" });
          const fileName = `${this.$t("led-wip-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
          exportFile(blob, fileName);
        });
      } else {
        this.$Message.warning("请完善查询条件");
      }
    },
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
