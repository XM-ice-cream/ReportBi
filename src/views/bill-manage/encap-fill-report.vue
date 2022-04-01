/* EncapFill报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="12">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
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
                    <!-- 线体 -->
                    <FormItem :label="$t('line')" prop="line">
                      <v-selectpage class="select-page-style" multiple v-if="searchPoptipModal" key-field="name" show-field="name" :data="linePageListUrl" v-model="req.line" :placeholder="$t('pleaseEnter') + $t('line')" :result-format="
                          (res) => {
                            return {
                              totalRow: res.total,
                              list: res.data || [],
                            };
                          }
                        ">
                      </v-selectpage>
                    </FormItem>
                    <!-- 设备 -->
                    <!-- <FormItem :label="$t('equipment')" prop="eqpId">
                      <Select v-model="req.eqpId" filterable clearable transfer multiple :placeholder="$t('pleaseSelect') + $t('equipment')">
                        <Option v-for="(item, index) in eqpIdList" :value="item.id" :key="index">{{ item.name }}</Option>
                      </Select>
                    </FormItem> -->
                    <!-- 设备 -->
                    <FormItem :label="$t('equipment')" prop="eqpId">
                      <v-selectpage class="select-page-style" multiple v-if="searchPoptipModal" key-field="name" show-field="name" :data="eqpPageListUrl" v-model="req.eqpId" :placeholder="$t('pleaseSelect') + $t('equipment')" :result-format="
                          (res) => {
                            return {
                              totalRow: res.total,
                              list: res.data || [],
                            };
                          }
                        ">
                      </v-selectpage>
                    </FormItem>
                    <!-- 站点 -->
                    <FormItem :label="$t('stepName')" prop="stepName">
                      <Select v-model="req.stepName" transfer filterable :placeholder="$t('pleaseSelect') + $t('stepName')">
                        <Option value="OP50">OP50</Option>
                        <Option value="OP70">OP70</Option>
                      </Select>
                    </FormItem>
                  </Form>
                  <div class="poptip-style-button">
                    <Button @click="resetClick">{{ $t("reset") }}</Button>
                    <Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
                  </div>
                </div>
              </Poptip>
            </i-col>
          </Row>
        </div>
        <Tabs type="card" @on-click="handleClick" v-model="tabName">
          <TabPane label="线体查询" name="tab1">
            <TabTable ref="tab1" :query-obj="searchObj" :table-data="lineTableData" :btnData="btnData" />
          </TabPane>
          <TabPane label="良率查询" name="tab3">
            <TabTable3 ref="tab3" :query-obj="searchObj" :table-data="defectTableData" :btnData="btnData" />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, getEncapFillDamEqpId, eqpPageListUrl } from "@/api/bill-manage/encap-fill-report";
import { linePageListUrl } from "@/api/bill-manage/quality-yield-query-report";
import { formatDate, getButtonBoolean } from "@/libs/tools";
import TabTable from "./encap-fill-report/tabTable.vue";
import TabTable3 from "./encap-fill-report/tabTable3.vue";
//import { eqpPageListUrl } from "@/api/eqp-manage/eqp-info";

export default {
  components: { TabTable, TabTable3 },
  name: "encap-fill-report",
  data () {
    return {
      eqpPageListUrl: eqpPageListUrl(),
      linePageListUrl: linePageListUrl(),
      tabName: "tab1",
      tab1: true,
      tab3: false,
      tableConfig: { ...this.$config.tableConfig }, // table配置
      eqpIdList: [],
      lineTableData: [], // 线体表格数据
      defectTableData: [], // 良率表格数据
      dataModal: [], // 模态框表格数据
      currentRow: {}, // 当前点击表格行数据
      currentType: "", // 当前点击表格行数据类型
      searchPoptipModal: false,
      btnData: [],
      req: {
        startTime: "",
        endTime: "",
        stepName: "OP50",
        line: "", // 线体
        eqpId: "", //设备id
        ...this.$config.pageConfig,
      }, //查询数据
      searchObj: {},
      modalReq: {
        ...this.$config.pageConfig,
      },
    };
  },
  mounted () { },
  activated () {
    this.autoSize();
    window.addEventListener("resize", () => this.autoSize());
    getButtonBoolean(this, this.btnData);
    //this.getEqpIdList();
    this.pageLoad();
  },
  deactivated () {
    this.searchPoptipModal = false;
  },
  methods: {
    handleClick (name) {
      // this.$refs[name]
    },
    // 获取分页列表数据
    pageLoad () {
      this.$Spin.hide();
      const { startTime, endTime, stepName, line, eqpId } = this.req;
      if (startTime || endTime || line || eqpId) {
        this.$Spin.show();
        this.searchObj = {
          startTime: formatDate(startTime),
          endTime: formatDate(endTime),
          stepName,
          line: line ? line.split(",") : [],
          eqpId: eqpId ? eqpId.split(",") : [],
        };
        getpagelistReq(this.searchObj)
          .then((res) => {
            this.$Spin.hide();
            const {
              encapFILLByLineResponses,
              encapFILLByDefectResponses,
            } = res || {};
            this.lineTableData = encapFILLByLineResponses;
            this.defectTableData = encapFILLByDefectResponses;
            this.searchPoptipModal = false;
          })
          .catch(() => this.$Spin.hide());
      } else {
        this.$Msg.warning("请完善查询条件");
      }
    },
    // 获取设备数据
    getEqpIdList () {
      getEncapFillDamEqpId().then(res => {
        if (res.code === 200) {
          this.eqpIdList = res.result || {}
        }
      })
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
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 180;
    },
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
