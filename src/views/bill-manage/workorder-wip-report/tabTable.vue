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
      <!-- 是否离线 -->
      <template slot-scope="{ row }" slot="status">
        <div @click="show(row.panelNo)" class="row-status-yes" v-if="row.status==='YES'">
          是
        </div>
        <div class="row-status-no" v-else>
          否
        </div>
      </template>
    </Table>
    <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
  </Card>
</template>

<script>
import { getWipSnlistReq as getpagelistReq, exportWipSnReq as exportReq } from "@/api/bill-manage/workorder-wip-report";
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
          title: "Panel号",
          key: "panelNo",
          minWidth: 120,
          ellipsis: true,
          tooltip: true,
          align: "center",
        },
        {
          title: "SN号",
          key: "unitId",
          ellipsis: true,
          tooltip: true,
          minWidth: 130,
          align: "center",
        },
        {
          title: "当前站点",
          key: "curprocessName",
          ellipsis: true,
          tooltip: true,
          minWidth: 130,
          align: "center",
        },
        {
          title: "当前站停留时间",
          key: "residenceTime",
          ellipsis: true,
          tooltip: true,
          minWidth: 150,
          align: "center",
        },
        {
          title: "是否离线",
          slot: "status",
          ellipsis: true,
          tooltip: true,
          width: 100,
          align: "center",
        },
        {
          title: "状态(产品当前状态)",
          key: "currentStatus",
          ellipsis: true,
          tooltip: true,
          width: 150,
          align: "center",
        }, {
          title: "不良现象",
          key: "description",
          ellipsis: true,
          tooltip: true,
          minWidth: 150,
          align: "center",
        }, {
          title: "不良原因",
          key: "description2",
          ellipsis: true,
          tooltip: true,
          width: 200,
          align: "center",
        }
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
        orderField: "panelNo", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: this.queryObj,
      };
      getpagelistReq(obj).then((res) => {
        this.tableConfig.loading = false;
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
          this.data = data || [];
        }
      }).catch(() => (this.tableConfig.loading = false));
    },
    show (panelNo) {
      this.$router.push({
        name: "offlinetracking-query",
        params: { panelNo },
      });
    },
    // 导出
    exportClick () {
      exportReq({ ...this.queryObj }).then(
        (res) => {
          let blob = new Blob([res], { type: "application/vnd.ms-excel" });
          const fileName = `${this.$t("workorder-wip-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
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
<style scoped>
.row-status-yes {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
  cursor: pointer;
  border: 1px solid;
  margin: 0 1.5rem;
  padding: 0.3rem;
}
.row-status-no {
  color: #f5222d;
  border: 1px solid;
  background: #fff1f0;
  border-color: #ffa39e;
  margin: 0 1.5rem;
  padding: 0.3rem;
}
</style>