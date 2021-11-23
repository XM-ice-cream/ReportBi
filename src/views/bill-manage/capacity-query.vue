/* 产能查询 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="18">
              <Form ref="searchReq" :model="req" :rules="ruleValidate" inline class="card-style-form" @submit.native.prevent>
                <!-- 工单 -->
                <FormItem :label="$t('workOrder')" prop="workOrder">
                  <v-selectpage style="width:250px" class="select-page-style" key-field="workOrder" show-field="workOrder" :data="workerPageListUrl" v-model="req.workOrder" :placeholder="$t('pleaseSelect') + $t('workOrder')" @values="pageLoad()" :result-format="
                      (res) => {
                        return {
                          totalRow: res.total,
                          list: res.data || [],
                        };
                      }
                    ">
                  </v-selectpage>
                </FormItem>
                <!-- 起始时间 -->
                <FormItem :label="$t('startTime')" prop="startTime">
                  <DatePicker transfer type="datetime" style="width:200px" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime" @on-open-change="
                      (e) => {
                        if (!e) {
                          this.pageLoad();
                        }
                      }
                    "></DatePicker>
                </FormItem>
                <!-- 结束时间 -->
                <FormItem :label="$t('endTime')" prop="endTime">
                  <DatePicker transfer type="datetime" style="width:200px" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime" @on-open-change="
                      (e) => {
                        if (!e) {
                          this.pageLoad();
                        }
                      }
                    "></DatePicker>
                </FormItem>
              </Form>
            </i-col>
            <i-col span="6">
              <button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
      </Card>
    </div>
  </div>
</template>

<script>
import { getlistReq, exportReq } from "@/api/bill-manage/capacity-query";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { formatDate, getButtonBoolean, exportFile } from "@/libs/tools";
export default {
  name: "capacity-query",
  data () {
    return {
      workerPageListUrl: workerPageListUrl(),
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      req: {
        startTime: "",
        endTime: "",
        workOrder: "", //工单
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
        { title: this.$t("workOrder"), key: "workOrder" },
        { title: this.$t("stationId"), key: "processName" },
        { title: this.$t("input_PassQty"), key: "input_PassQty", width: 100 },
        { title: this.$t("output_PassQty"), key: "output_PassQty", width: 100 },
        { title: this.$t("input_HoldQty"), key: "input_HoldQty", width: 100 },
        { title: this.$t("input_DefectQty"), key: "input_DefectQty", width: 100 },
        { title: this.$t("output_HoldQty"), key: "output_HoldQty", width: 100 },
        { title: this.$t("yield_Rate"), key: "yield_Rate", width: 80 },
      ], // 表格数据
      // 验证实体
      ruleValidate: {
        workOrder: [
          {
            required: true,
            message: " ",
            trigger: "change",
          },
        ],
      },
    };
  },
  activated () {
    this.pageLoad();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = false;
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          this.tableConfig.loading = true;
          const obj = {
            startTime: formatDate(this.req.startTime),
            endTime: formatDate(this.req.endTime),
            workOrder: this.req.workOrder,
          };
          getlistReq(obj)
            .then((res) => {
              this.tableConfig.loading = false;
              if (res.code === 200) {
                this.data = res.result || [];
              }
            })
            .catch(() => (this.tableConfig.loading = false));
        }
      });
    },
    // 导出
    exportClick () {
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          const obj = {
            startTime: formatDate(this.req.startTime),
            endTime: formatDate(this.req.endTime),
            workOrder: this.req.workOrder,
          };
          exportReq(obj).then((res) => {
            let blob = new Blob([res], { type: "application/vnd.ms-excel" });
            const fileName = `${this.$t("capacity-query")}${formatDate(new Date())}.xlsx`; // 自定义文件名
            exportFile(blob, fileName);
          });
        } else {
          this.$Message.warning(this.$t("pleaseEnter") + this.$t("selectQuery"));
        }
      });
    },
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 130;
    },
  },
};
</script>
