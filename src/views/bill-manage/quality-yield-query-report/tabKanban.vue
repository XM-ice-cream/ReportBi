<template>
  <TabPane label="质量良率看板" name="tab8" :index="8" :closable="false" v-if="tab8">
    <Card :bordered="false" dis-hover class="card-style">
      <div slot="title">
        <Row>
          <Form :label-width="70" inline :label-colon="true" @submit.native.prevent ref="searchReq" :model="req" @keyup.native.enter="pageLoad">
            <!-- 起始时间 -->
            <FormItem :label="$t('startTime')" prop="startTime">
              <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
            </FormItem>
            <!-- 结束时间 -->
            <FormItem :label="$t('endTime')" prop="endTime">
              <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="pageLoad">{{ $t("query") }}</Button>
            </FormItem>
          </Form>
        </Row>
      </div>
      <div class="wip-table">
        <span class="title">WIP 不良</span>
        <Table :border="tableConfig.border" :highlight-cell="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columnsYield" :data="dataYield" @on-cell-click='yieldClick'>
        </Table>
      </div>
      <div class="wip-table">
        <span class="title">不良工站</span>
        <Table :border="tableConfig.border" ref="qty" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columnsQty" :data="dataQty" @on-cell-click='qtyClick'>
        </Table>
      </div>
    </Card>
    <kanban-yield ref="yield"></kanban-yield>
    <kanban-qty ref="qty"></kanban-qty>
  </TabPane>
</template>

<script>
import { getinputsReq, exportReq } from "@/api/bill-manage/quality-yield-query-report";
import { exportFile, formatDate } from "@/libs/tools";
import kanbanYield from './kanbanYield.vue';
import KanbanQty from './kanbanQty.vue';

export default {
  components: { kanbanYield, KanbanQty },
  name: "tabKanban",
  data () {
    return {
      tab8: true,
      tableConfig: { ...this.$config.tableConfig }, // table配置
      btnData: [],
      queryObj: {},
      req: {
        startTime: '',
        endTime: ''
      }, //查询数据
      dataYield: [{
        station: 'SMT',
        yield: 'FYP',
        workorder: '100%'
      }, {
        station: 'SMT',
        yield: 'After Reworked',
        workorder: '100%'
      }, {
        station: 'SMT',
        yield: 'Fail Qty',
        workorder: '100%'
      }],
      columnsYield: [
        {
          title: 'Station/Lines',
          key: "station",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'Yield',
          key: "yield",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'Overall Yield',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L1',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L2',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L3',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L4',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L5',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L6',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L7',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L8',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L9',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }
      ],
      dataQty: [{
        station: 'SMT',
        yield: 'FYP',
        workorder: '100%'
      }, {
        station: 'SMT',
        yield: 'After Reworked',
        workorder: '100%'
      }, {
        station: 'SMT',
        yield: 'Fail Qty',
        workorder: '100%'
      }],
      columnsQty: [
        {
          title: 'Station/Lines',
          key: "station",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'Yield',
          key: "yield",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'Overall Yield',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L1',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L2',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L3',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L4',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L5',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L6',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L7',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L8',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L9',
          key: "workorder",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }
      ],

    };
  },
  mounted () {
    this.autoSize();
    this.pageLoad();
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
            this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
            this.data = data || [];
          }
        })
        .catch(() => (this.tableConfig.loading = false));
    },
    yieldClick (row, column, data, event) {
      this.$refs.yield.modal = true;
      console.log(row, column, data, event);
    },
    qtyClick (row, column, data, event) {
      this.$refs.qty.modal = true;
      console.log(row, column, data, event);
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
      this.tableConfig.height = document.body.clientHeight / 2 - 150;
    },
  },
};
</script>
<style scoped lang='less'>
.wip-table {
  .title {
    font-weight: bold;
    margin: 0.3rem;
    padding: 0.4rem 1rem;
    display: inline-block;
    font-size: 13px;
    color: #fffdfd;
    background: #f1a739;
    /* text-align: center; */
    border-radius: 1px 10px;
  }
}
</style>
