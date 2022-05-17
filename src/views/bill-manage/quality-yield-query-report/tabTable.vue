<template>
  <Card :bordered="false" dis-hover class="card-style">
    <div slot="title">
      <Row>
        <i-col span="24">
          <Button :btnData="btnData" @click="exportClick" type="primary" style="float:right">{{$t('export')}}</Button>
        </i-col>
      </Row>
    </div>
    <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data">
      <!-- 抽检UnitId -->
      <template slot-scope="{ row }" slot="unitid">
        <div @click="show(row.unitid)" style="color:blue;cursor:pointer">
          {{ row.unitid }}
        </div>
      </template>
    </Table>
    <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
  </Card>
</template>

<script>
import { getinputsReq, exportReq } from "@/api/bill-manage/quality-yield-query-report";
import { exportFile, formatDate } from "@/libs/tools";

export default {
  name: "tabTable",
  data () {
    return {
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      queryObj: {},
      req: {
        ...this.$config.pageConfig,
      }, //查询数据
      // 模态框表格数据
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
        {
          title: this.$t("workOrder"),
          key: "workorder",
          minWidth: 120,
          ellipsis: true,
          tooltip: true,
          align: "center",
        },
        {
          title: this.$t("unitId"),
          slot: "unitid",
          ellipsis: true,
          tooltip: true,
          minWidth: 130,
          align: "center",
        },
        {
          title: this.$t("pn"),
          key: "pn",
          ellipsis: true,
          tooltip: true,
          minWidth: 130,
          align: "center",
        },
        {
          title: this.$t("lineName"),
          key: "linename",
          ellipsis: true,
          tooltip: true,
          minWidth: 150,
          align: "center",
        },
        {
          title: this.$t("stepName"),
          key: "stepname",
          ellipsis: true,
          tooltip: true,
          width: 100,
          align: "center",
        },
        {
          title: this.$t("buildConfig"),
          key: "buildconfig",
          ellipsis: true,
          tooltip: true,
          width: 100,
          align: "center",
        }, {
          title: this.$t("eqpId"),
          key: "routename",
          ellipsis: true,
          tooltip: true,
          width: 100,
          align: "center",
        }, {
          title: this.$t("panelNo"),
          key: "panelno",
          ellipsis: true,
          tooltip: true,
          width: 200,
          align: "center",
        },
        {
          title: this.$t("defectCode"),
          key: "defectcode",
          ellipsis: true,
          tooltip: true,
          minWidth: 80,
          align: "center",
        },
        {
          title: this.$t("defectLocation"),
          key: "location",
          ellipsis: true,
          tooltip: true,
          minWidth: 100,
          align: "center",
        },
        {
          title: this.$t("FailureReason"),
          key: "failureReason",
          ellipsis: true,
          tooltip: true,
          minWidth: 150,
          align: "center",
        },
        {
          title: this.$t("defectDate"),
          key: "defectdate",
          ellipsis: true,
          tooltip: true,
          minWidth: 80,
          align: "center",
        },
        {
          title: this.$t("description"),
          key: "description",
          ellipsis: true,
          tooltip: true,
          minWidth: 130,
          align: "center",
        },

        {
          title: this.$t("status"),
          key: "status",
          width: 50,
          ellipsis: true,
          tooltip: true,
          align: "center",
        },
      ], // 表格数据
    };
  },
  mounted () {
    this.autoSize();
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = true;
      let obj = {
        orderField: "unitId", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: this.queryObj,
      };
      getinputsReq(obj)
        .then((res) => {
          this.tableConfig.loading = false;
          if (res.code === 200) {
            let { data, pageSize, pageIndex, total, totalPage } = res.result;
            this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
            this.data = data || [];
          }
        })
        .catch(() => (this.tableConfig.loading = false));
    },
    show (unitId) {
      this.$router.push({
        name: "flow-card",
        params: { unitId },
      });
    },
    // 导出
    exportClick () {
      let obj = {
        orderField: "unitId", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        total: 0,
        data: this.queryObj,
      };
      exportReq(obj).then(
        (res) => {
          let blob = new Blob([res], { type: "application/vnd.ms-excel" });
          const fileName = `${this.$t("quality-yield-query-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
          exportFile(blob, fileName);
        }
      );
    },
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 210;
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
