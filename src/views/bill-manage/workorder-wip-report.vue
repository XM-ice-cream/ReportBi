/* 工单WIP报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Tabs type="card" closable @on-tab-remove="handleTabRemove" v-model="tabName">
        <TabPane label="WorkOrderWip" name="tab1" :index="1" v-if="tab1" :closable="false">
          <Card :bordered="false" dis-hover class="card-style">
            <div slot="title">
              <Row>
                <i-col span="12">
                  <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
                    <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">{{ $t("selectQuery") }}</Button>
                    <div class="poptip-style-content" slot="content">
                      <Form :label-width="70" :label-colon="true" @submit.native.prevent ref="searchReq" :model="req" @keyup.native.enter="searchClick">
                        <!-- 工单 -->
                        <FormItem :label="$t('workOrder')" prop="workOrder">
                          <v-selectpage style="width:250px" class="select-page-style" key-field="workOrder" show-field="workOrder" :data="workerPageListUrl" multiple ref="workOrder" v-model="req.workOrder" :placeholder="$t('pleaseSelect') + $t('workOrder')" :result-format="
                      (res) => {
                        return {
                          totalRow: res.total,
                          list: res.data || [],
                        };
                      }
                    ">
                          </v-selectpage>
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
              <!-- WIP -->
              <template slot-scope="{ row }" slot="wip">
                <div @click="show(row, 1)" style="color:blue;cursor:pointer">
                  {{ row.wip }}
                </div>
              </template>
              <!-- 报废数量 -->
              <template slot-scope="{ row }" slot="scrapNumber">
                <div @click="skipTo(row.workorder)" style="color:blue;cursor:pointer">
                  {{ row.scrapNumber }}
                </div>
              </template>

            </Table>
            <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
          </Card>
        </TabPane>
        <TabPane label="WipSn" name="tab2" :index="2" v-if="tab2">
          <TabTable ref="tab2" />
        </TabPane>
        <!-- <TabKanban /> -->
      </Tabs>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/workorder-wip-report";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { formatDate, getButtonBoolean } from "@/libs/tools";
import TabTable from "./workorder-wip-report/tabTable.vue";
import { exportFile } from "@/libs/tools";

export default {
  components: { TabTable },
  name: "workorder-wip-report",
  data () {
    return {
      tabName: "tab1",
      tab1: true,
      tab2: false,
      workerPageListUrl: workerPageListUrl(),
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      dataModal: [], // 模态框表格数据
      currentRow: {}, // 当前点击表格行数据
      currentType: "", // 当前点击表格行数据类型
      searchPoptipModal: false,
      btnData: [],
      req: {
        workOrder: "", //工单
        ...this.$config.pageConfig,
      }, //查询数据
      searchObj: {},
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
          title: "工单",
          key: "workorder",
          minWidth: 140,
          ellipsis: true,
          align: "center",
          tooltip: true,
        },
        {
          title: "工单总数",
          minWidth: 80,
          align: "center",
          key: "allIn",
        },
        {
          title: "工单已投入数量",
          minWidth: 80,
          align: "center",
          key: "inPut",
        },
        {
          title: "报废数量",
          minWidth: 80,
          align: "center",
          slot: "scrapNumber",
        },
        {
          title: "报废率",
          minWidth: 80,
          align: "center",
          key: "scrapPage",
        },
        {
          title: "WIP",
          minWidth: 80,
          align: "center",
          slot: "wip",
        }
      ],
    };
  },
  activated () {
    this.tableConfig.loading = false;
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
      const { workOrder } = this.req;
      this.tableConfig.loading = true;
      this.searchObj = {
        orderField: "workOrder", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        total: 0,
        data: {
          workOrder, //工单
        },
      };
      getpagelistReq(this.searchObj)
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
    },
    // 导出
    exportClick () {
      const { workOrder } = this.req;
      const obj = {
        workOrder
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("workorder-wip-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    // 表格单元格点击事件
    show (row, type) {
      let obj = { workOrder: row.workorder };
      let index = type + 1;
      this.tabName = "tab" + index;
      this["tab" + index] = true;
      this.$nextTick(() => {
        this.$refs["tab" + index].req.pageIndex = 1;
        this.$refs["tab" + index].queryObj = obj;
        this.$refs["tab" + index].pageLoad(obj);
      });
    },
    //跳转到报废报表
    skipTo (workorder) {
      this.$router.push({
        name: "scrap-report",
        params: { workorder },
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
      this.$refs.workOrder.remove()
      this.searchPoptipModal = false;
      this.$nextTick(() => {
        this.searchPoptipModal = true;
      });
      //   this.searchClick();
    },
    // 点击搜索按钮触发
    searchClick () {
      this.req.pageIndex = 1;
      this.pageLoad();
    },
  },
  mounted () {
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
