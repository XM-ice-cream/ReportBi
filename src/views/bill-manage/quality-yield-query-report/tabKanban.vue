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
        <Table :border="tableConfig.border" :highlight-cell="tableConfig.highlightRow" :height="tableConfig.height" :loading="Yieldloading" :columns="columnsYield" :data="dataYield" @on-cell-click='yieldClick' :span-method="handleSpanYield">
        </Table>
      </div>
      <div class="wip-table">
        <span class="title">不良工站</span>
        <Table :border="tableConfig.border" ref="qty" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columnsQty" :data="dataQty" @on-cell-click='qtyClick' :span-method="handleSpanQty">
        </Table>
      </div>
    </Card>
    <kanban-yield ref="yield"></kanban-yield>
    <kanban-qty ref="qty"></kanban-qty>
  </TabPane>
</template>

<script>
import { getLpaYieldReq, getLpaDefeactYieldReq } from "@/api/bill-manage/quality-yield-query-report";
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
      Yieldloading: false,
      req: {
        startTime: '',
        endTime: ''
      }, //查询数据
      dataYield: [],
      columnsYield: [
        {
          title: 'Section',
          key: "section",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'Yield',
          key: "yieldtype",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L01',
          key: "L01",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L02',
          key: "L02",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L03',
          key: "L03",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L04',
          key: "L04",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L05',
          key: "L05",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L06',
          key: "L06",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L07',
          key: "L07",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L08',
          key: "L08",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L09',
          key: "L09",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }
      ],
      dataQty: [],
      columnsQty: [
        {
          title: 'Section',
          key: "section",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'Station',
          key: "station",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L01',
          key: "L01",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L02',
          key: "L02",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L03',
          key: "L03",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L04',
          key: "L04",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L05',
          key: "L05",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L06',
          key: "L06",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L07',
          key: "L07",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L08',
          key: "L08",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }, {
          title: 'L09',
          key: "L09",
          ellipsis: true,
          tooltip: true,
          align: "center",
        }
      ],

    };
  },
  mounted () {
    this.autoSize();
    this.tableConfig.loading = false;
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = true;
      this.Yieldloading = true;
      const { startTime, endTime } = this.req;
      let obj = {
        startTime: formatDate(startTime),
        endTime: formatDate(endTime)
      };
      if (startTime && endTime) {
        //获取良率
        this.getLpaYeild(obj);
        //获取不良率
        this.getLpaDefectYeild(obj);
      } else {
        this.$Message.warning('请输入查询条件!')
      }

    },
    //获取LPA良率
    async getLpaYeild (obj) {
      await getLpaYieldReq(obj).then((res) => {
        this.Yieldloading = false;
        if (res.code === 200) {
          let result = [];
          if (this.dataYield) {
            //站点与段别的对应关系
            const title = [
              { section: 'Overall', yieldtype: 'Overall' }, { section: 'SMT', yieldtype: 'Input' },
              { section: 'SMT', yieldtype: 'Output' }, { section: 'SMT', yieldtype: 'Defect' },
              { section: 'SMT', yieldtype: 'Fyp' }, { section: 'SMT', yieldtype: 'After_Rework' },
              { section: 'ENCAPE', yieldtype: 'Input' }, { section: 'ENCAPE', yieldtype: 'Output' },
              { section: 'ENCAPE', yieldtype: 'Defect' }, { section: 'ENCAPE', yieldtype: 'Rate' },
              { section: 'BE', yieldtype: 'Input' }, { section: 'BE', yieldtype: 'Output' },
              { section: 'BE', yieldtype: 'Defect' }, { section: 'BE', yieldtype: 'Rate' }];
            //创建空的表格信息
            result = title.map(item => {
              const { section, yieldtype } = item;
              return { section, yieldtype, 'L01': '', 'L02': '', 'L03': '', 'L04': '', 'L05': '', 'L06': '', 'L07': '', 'L08': '', 'L09': '' }
            });
            res.result.forEach((o, index) => {
              const lineName = res.result[index].lineName;
              Object.keys(o).forEach((key, keyIndex) => {
                if (key !== 'lineName') {
                  // const keySplit = key.split('-');
                  // const station = keySplit[1];
                  result[keyIndex - 1][lineName] = res.result[index][key];
                }
              })
            })
          }
          this.dataYield = result;
        }
      }).catch(() => (this.Yieldloading = false));
    },
    //获取LPA不良率
    async getLpaDefectYeild (obj) {
      await getLpaDefeactYieldReq(obj).then((res) => {
        this.tableConfig.loading = false;
        if (res.code === 200) {
          let result = [];
          if (this.dataYield) {
            //站点与段别的对应关系
            const title = [
              { section: 'SMT', station: 'Op40' }, { section: 'SMT', station: 'AutoOnoff' },
              { section: 'ENCAPE', station: 'Op45Op50' }, { section: 'ENCAPE', station: 'Autoonoff2' },
              { section: 'ENCAPE', station: 'Autoonoff3' }, { section: 'ENCAPE', station: 'Op60' },
              { section: 'ENCAPE', station: 'Op70' }, { section: 'BACK END', station: 'Function' },
              { section: 'BACK END', station: 'I16' }, { section: 'BACK END', station: 'Fvi' }];
            //创建空的表格信息
            result = title.map(item => {
              const { section, station } = item;
              return { section, station, 'L01': '', 'L02': '', 'L03': '', 'L04': '', 'L05': '', 'L06': '', 'L07': '', 'L08': '', 'L09': '' }
            });
            res.result.forEach((o, index) => {
              const lineName = res.result[index].lineName;
              Object.keys(o).forEach((key, keyIndex) => {
                if (key !== 'lineName') {
                  // const keySplit = key.split('-');
                  // const station = keySplit[1];
                  result[keyIndex - 1][lineName] = res.result[index][key];
                }
              })
            })
          }
          this.dataQty = result;

        }
      }).catch(() => (this.tableConfig.loading = false));
    },
    //合并单元格
    handleSpanYield ({ row, column, rowIndex, columnIndex }) {
      const cc = [
        { r: 0, c: 0, rspan: 1, cspan: 2 },
        { r: 1, c: 0, rspan: 5, cspan: 1 },
        { r: 6, c: 0, rspan: 4, cspan: 1 },
        { r: 10, c: 0, rspan: 4, cspan: 1 },
      ]
      for (let i = 0; i < cc.length; i++) {
        const o = cc[i];
        if (rowIndex === o.r && columnIndex === o.c) {
          return {
            rowspan: o.rspan,
            colspan: o.cspan
          }
        } else if ((!([0, 1, 6, 10].includes(rowIndex)) && columnIndex === 0) || (rowIndex === 0 && columnIndex === 1)) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    //合并单元格
    handleSpanQty ({ row, column, rowIndex, columnIndex }) {
      const cc = [
        { rowIndex: 0, rowspan: 2, colspan: 1 },
        { rowIndex: 2, rowspan: 5, colspan: 1 },
        { rowIndex: 7, rowspan: 3, colspan: 1 },
      ];
      for (let i = 0; i < cc.length; i++) {
        if (rowIndex === cc[i].rowIndex && columnIndex === 0) {
          return {
            rowspan: cc[i].rowspan,
            colspan: cc[i].colspan
          };
        } else if (!([0, 2, 7].includes(rowIndex)) && columnIndex === 0) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },

    yieldClick (row, column, data, event) {
      this.$refs.yield.modal = true;
    },
    qtyClick (row, column, data, event) {
      this.$refs.qty.modal = true;
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
      this.tableConfig.height = document.body.clientHeight / 2 - 130;
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
