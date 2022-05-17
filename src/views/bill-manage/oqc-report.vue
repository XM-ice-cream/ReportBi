/* OQC报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="500" trigger="manual">
                <Button type="primary" icon="ios-search" @click.stop="poptipModal = !poptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <!-- @submit.native.prevent @keyup.native.enter="searchClick" -->
                  <Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent>
                    <!-- 起始时间 -->
                    <FormItem :label="$t('startTime')" prop="startTime">
                      <DatePicker type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                      <DatePicker type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
                    </FormItem>
                    <!-- 制程 -->
                    <FormItem :label="$t('process')" prop="stepId">
                      <v-selectpage class="select-page-style" ref="processId" v-if="poptipModal" key-field="name" show-field="name" :data="processPageListUrl" v-model="req.stepName" :placeholder="$t('pleaseSelect') + $t('process')" :result-format="
                        (res) => {
                        return {
                            totalRow: res.total,
                            list: res.data || [],
                        };
                        }
                    ">
                      </v-selectpage>
                    </FormItem>
                    <!-- 工单 -->
                    <FormItem :label="$t('workOrder')" prop="workOrder">
                      <v-selectpage v-if="poptipModal" ref="workOrder" class="select-page-style" key-field="workOrder" show-field="workOrder" :data="workerPageListUrl" v-model="req.workOrder" :placeholder="$t('pleaseSelect') + $t('workOrder')" :result-format="
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
                      <Input type="textarea" :autosize="{minRows: 1,maxRows: 5}" v-model="req.unitId" :placeholder="$t('pleaseEnter') + $t('unitId')" />
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
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/oqc-report";
import { getButtonBoolean, formatDate, exportFile, renderDate, treeLoop } from "@/libs/tools";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { getlisttreeReq, processPageListUrl } from "@/api/basis-info/zone-manage";
export default {
  name: "oqc-report",
  data () {
    return {
      poptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      processList: [], // 制程列表
      btnData: [],
      workerPageListUrl: workerPageListUrl(),
      processPageListUrl: processPageListUrl(),
      req: {
        startTime: "",
        endTime: "",
        unitId: "",
        workOrder: "",
        stepName: '', // 站点
        stepId: null, // 站点
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
        { title: this.$t('workOrder'), key: "workOrder", align: "center", width: 150 },
        { title: this.$t('unitId'), key: "unitId", align: "center", width: 150 },
        { title: this.$t('stepName'), key: "stepName", align: "center", width: 120, tooltip: true },
        { title: this.$t('defectCode'), key: "defectCode", align: "center", width: 120, tooltip: true },
        { title: this.$t('description'), key: "description", align: "center", width: 140, tooltip: true },
        { title: this.$t('holdReason'), key: "holdReason", align: "center", width: 140, tooltip: true },
        { title: this.$t('createUserName'), key: "createUserName", align: "center", width: 100, tooltip: true },
        { title: this.$t('holdTime'), key: "holdTime", align: "center", width: 150, render: renderDate },
        { title: this.$t('remark'), key: "remark", align: "center", minWidth: 150, tooltip: true },
        { title: this.$t('unHoldTime'), key: "unHoldTime", align: "center", width: 150, render: renderDate },
        { title: this.$t('unHoldUserName'), key: "unHoldUserName", align: "center", width: 100 },
        { title: this.$t('unHoldRemark'), key: "unHoldRemark", align: "center", width: 150 },
      ], // 表格数据
    };
  },
  activated () {
    this.pageLoad();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    this.getProcessList();
    getButtonBoolean(this, this.btnData);
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.poptipModal = false;
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
      let { startTime, endTime, unitId, workOrder, stepName
      } = this.req;
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          this.tableConfig.loading = true;
          let obj = {
            orderField: "unitId", // 排序字段
            ascending: true, // 是否升序
            pageSize: this.req.pageSize, // 分页大小
            pageIndex: this.req.pageIndex, // 当前页码
            data: {
              startTime: formatDate(startTime),
              endTime: formatDate(endTime),
              unitId, workOrder, stepName
            },
          };
          getpagelistReq(obj)
            .then((res) => {
              this.tableConfig.loading = false;
              if (res.code === 200) {
                let { data, pageSize, pageIndex, total, totalPage } = res.result;
                this.data = data || [];
                this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
                this.poptipModal = false;
              }
            }).catch(() => (this.tableConfig.loading = false));
        }
      });
    },
    // 导出
    exportClick () {
      let { startTime, endTime, unitId, workOrder, stepName } = this.req;
      let obj = {
        orderField: "unitId", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          startTime: formatDate(startTime),
          endTime: formatDate(endTime),
          unitId, workOrder, stepName
        },
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("oqc-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
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
          const arr = ['BE', 'Encap', 'SMT', 'OQC']
          const processData = res.result.filter(o => arr.includes(o.name))
          treeLoop(this.processList, processData, (node) => {
            node.label = node.name;
            node.id = node.name;
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
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
      this.$refs.workOrder.remove();
      this.$refs.processId.remove();
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
  mounted () {
    // window.addEventListener('resize', () => {
    //   this.tableConfig.height = document.body.clientHeight - 120 - 60;
    // });
  }
};
</script>
<style lang="less" scoped>
.img_item {
  width: 30px;
  height: 30px;
  margin-left: 3px;
  cursor: pointer;
}
</style>
