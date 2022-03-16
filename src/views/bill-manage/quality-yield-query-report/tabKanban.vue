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
      req: {
        startTime: '',
        endTime: ''
      }, //查询数据
      dataYield: [],
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
      dataQty: [],
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
    this.tableConfig.loading = false;
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = true;
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
    getLpaYeild (obj) {
      //   getLpaYieldReq(obj).then((res) => {
      const res = {
        "code": 200,
        "errorCode": -1,
        "hasPage": false,
        "message": null,
        "elapsedMilliseconds": 158786,
        "result": [
          {
            "lineName": "L02",
            "smt_Input_Qty": "6845",
            "smt_Output_Qty": "6436",
            "smt_Defect_Qty": "400",
            "smt_Fyp_Rate": "6.02%",
            "smt_After_Rework_Rate": "0.00%",
            "encap_Input_Qty": "6243",
            "encap_Output_Qty": "6521",
            "encap_Defect_Qty": "12",
            "encap_Rate": "0.00%",
            "be_Input_Qty": "6399",
            "be_Output_Qty": "6439",
            "be_Defect_Qty": "27",
            "be_Rate": "99.59%"
          },
          {
            "lineName": "L03",
            "smt_Input_Qty": "7935",
            "smt_Output_Qty": "7735",
            "smt_Defect_Qty": "238",
            "smt_Fyp_Rate": "3.05%",
            "smt_After_Rework_Rate": "0.00%",
            "encap_Input_Qty": "7390",
            "encap_Output_Qty": "7449",
            "encap_Defect_Qty": "11",
            "encap_Rate": "99.97%",
            "be_Input_Qty": "7246",
            "be_Output_Qty": "7153",
            "be_Defect_Qty": "21",
            "be_Rate": "99.71%"
          },
          {
            "lineName": "L04",
            "smt_Input_Qty": "4126",
            "smt_Output_Qty": "3940",
            "smt_Defect_Qty": "178",
            "smt_Fyp_Rate": "4.41%",
            "smt_After_Rework_Rate": "0.00%",
            "encap_Input_Qty": "3255",
            "encap_Output_Qty": "1479",
            "encap_Defect_Qty": "6",
            "encap_Rate": "99.93%",
            "be_Input_Qty": "1385",
            "be_Output_Qty": "1438",
            "be_Defect_Qty": "44",
            "be_Rate": "97.00%"
          },
          {
            "lineName": "L05",
            "smt_Input_Qty": "6933",
            "smt_Output_Qty": "6778",
            "smt_Defect_Qty": "147",
            "smt_Fyp_Rate": "2.15%",
            "smt_After_Rework_Rate": "0.00%",
            "encap_Input_Qty": "7148",
            "encap_Output_Qty": "6428",
            "encap_Defect_Qty": "6",
            "encap_Rate": "0.00%",
            "be_Input_Qty": "6280",
            "be_Output_Qty": "6283",
            "be_Defect_Qty": "71",
            "be_Rate": "98.87%"
          },
          {
            "lineName": "L06",
            "smt_Input_Qty": "1001",
            "smt_Output_Qty": "902",
            "smt_Defect_Qty": "99",
            "smt_Fyp_Rate": "10.70%",
            "smt_After_Rework_Rate": "0.00%",
            "encap_Input_Qty": "979",
            "encap_Output_Qty": "600",
            "encap_Defect_Qty": "21",
            "encap_Rate": "99.68%",
            "be_Input_Qty": "489",
            "be_Output_Qty": "285",
            "be_Defect_Qty": "5",
            "be_Rate": "98.48%"
          },
          {
            "lineName": "L07",
            "smt_Input_Qty": "128",
            "smt_Output_Qty": "95",
            "smt_Defect_Qty": "20",
            "smt_Fyp_Rate": "19.05%",
            "smt_After_Rework_Rate": "0.00%",
            "encap_Input_Qty": "185",
            "encap_Output_Qty": "0",
            "encap_Defect_Qty": "1",
            "encap_Rate": "0.00%",
            "be_Input_Qty": "0",
            "be_Output_Qty": "0",
            "be_Defect_Qty": "0",
            "be_Rate": "0.00%"
          },
          {
            "lineName": "L08",
            "smt_Input_Qty": "0",
            "smt_Output_Qty": "21",
            "smt_Defect_Qty": "0",
            "smt_Fyp_Rate": "0.00%",
            "smt_After_Rework_Rate": "0.00%",
            "encap_Input_Qty": "20",
            "encap_Output_Qty": "0",
            "encap_Defect_Qty": "0",
            "encap_Rate": "0.00%",
            "be_Input_Qty": "0",
            "be_Output_Qty": "0",
            "be_Defect_Qty": "0",
            "be_Rate": "0.00%"
          },
          {
            "lineName": "L09",
            "smt_Input_Qty": "0",
            "smt_Output_Qty": "0",
            "smt_Defect_Qty": "0",
            "smt_Fyp_Rate": "0.00%",
            "smt_After_Rework_Rate": "0.00%",
            "encap_Input_Qty": "0",
            "encap_Output_Qty": "0",
            "encap_Defect_Qty": "0",
            "encap_Rate": "0.00%",
            "be_Input_Qty": "0",
            "be_Output_Qty": "0",
            "be_Defect_Qty": "0",
            "be_Rate": "0.00%"
          }
        ]
      }
      this.tableConfig.loading = false;
      if (res.code === 200) {
        this.dataQty = res.result || [];
      }
      //   }).catch(() => (this.tableConfig.loading = false));
    },
    //获取LPA不良率
    getLpaDefectYeild (obj) {
      //   getLpaDefeactYieldReq(obj).then((res) => {
      const res = {
        "code": 200,
        "errorCode": -1,
        "hasPage": false,
        "message": null,
        "elapsedMilliseconds": 138817,
        "result": [
          {
            "lineName": "L02",
            "smt_Op40_Rate": "0.00%",
            "smt_AutoOnoff_smt_Rate": "2.98%",
            "encap_Op45Op50_Rate": "0.00%",
            "encap_Autoonoff2_Rate": "0.00%",
            "encap_Autoonoff3_Rate": "0.00%",
            "encap_Op60_Rate": "0.00%",
            "encap_Op70_Rate": "0.00%",
            "bE_Function_Rate": "0.06%",
            "bE_I16_Rate": "0.11%",
            "bE_Fvi_Rate": "0.01%"
          },
          {
            "lineName": "L03",
            "smt_Op40_Rate": "0.03%",
            "smt_AutoOnoff_smt_Rate": "1.27%",
            "encap_Op45Op50_Rate": "0.00%",
            "encap_Autoonoff2_Rate": "0.00%",
            "encap_Autoonoff3_Rate": "0.00%",
            "encap_Op60_Rate": "0.00%",
            "encap_Op70_Rate": "0.03%",
            "bE_Function_Rate": "0.04%",
            "bE_I16_Rate": "0.18%",
            "bE_Fvi_Rate": "0.00%"
          },
          {
            "lineName": "L04",
            "smt_Op40_Rate": "0.00%",
            "smt_AutoOnoff_smt_Rate": "1.83%",
            "encap_Op45Op50_Rate": "0.04%",
            "encap_Autoonoff2_Rate": "0.00%",
            "encap_Autoonoff3_Rate": "0.00%",
            "encap_Op60_Rate": "0.00%",
            "encap_Op70_Rate": "0.07%",
            "bE_Function_Rate": "0.76%",
            "bE_I16_Rate": "1.36%",
            "bE_Fvi_Rate": "0.00%"
          },
          {
            "lineName": "L05",
            "smt_Op40_Rate": "0.00%",
            "smt_AutoOnoff_smt_Rate": "0.89%",
            "encap_Op45Op50_Rate": "0.00%",
            "encap_Autoonoff2_Rate": "0.00%",
            "encap_Autoonoff3_Rate": "0.00%",
            "encap_Op60_Rate": "0.00%",
            "encap_Op70_Rate": "0.00%",
            "bE_Function_Rate": "0.19%",
            "bE_I16_Rate": "0.13%",
            "bE_Fvi_Rate": "0.24%"
          },
          {
            "lineName": "L06",
            "smt_Op40_Rate": "0.00%",
            "smt_AutoOnoff_smt_Rate": "2.49%",
            "encap_Op45Op50_Rate": "0.27%",
            "encap_Autoonoff2_Rate": "0.00%",
            "encap_Autoonoff3_Rate": "0.00%",
            "encap_Op60_Rate": "0.00%",
            "encap_Op70_Rate": "0.32%",
            "bE_Function_Rate": "0.00%",
            "bE_I16_Rate": "0.66%",
            "bE_Fvi_Rate": "0.00%"
          },
          {
            "lineName": "L07",
            "smt_Op40_Rate": "0.00%",
            "smt_AutoOnoff_smt_Rate": "6.67%",
            "encap_Op45Op50_Rate": "0.00%",
            "encap_Autoonoff2_Rate": "0.00%",
            "encap_Autoonoff3_Rate": "0.00%",
            "encap_Op60_Rate": "0.00%",
            "encap_Op70_Rate": "0.00%",
            "bE_Function_Rate": "0.00%",
            "bE_I16_Rate": "0.00%",
            "bE_Fvi_Rate": "0.00%"
          },
          {
            "lineName": "L08",
            "smt_Op40_Rate": "0.00%",
            "smt_AutoOnoff_smt_Rate": "0.00%",
            "encap_Op45Op50_Rate": "0.00%",
            "encap_Autoonoff2_Rate": "0.00%",
            "encap_Autoonoff3_Rate": "0.00%",
            "encap_Op60_Rate": "0.00%",
            "encap_Op70_Rate": "0.00%",
            "bE_Function_Rate": "0.00%",
            "bE_I16_Rate": "0.00%",
            "bE_Fvi_Rate": "0.00%"
          },
          {
            "lineName": "L09",
            "smt_Op40_Rate": "0.00%",
            "smt_AutoOnoff_smt_Rate": "0.00%",
            "encap_Op45Op50_Rate": "0.00%",
            "encap_Autoonoff2_Rate": "0.00%",
            "encap_Autoonoff3_Rate": "0.00%",
            "encap_Op60_Rate": "0.00%",
            "encap_Op70_Rate": "0.00%",
            "bE_Function_Rate": "0.00%",
            "bE_I16_Rate": "0.00%",
            "bE_Fvi_Rate": "0.00%"
          }
        ]
      }
      this.tableConfig.loading = false;
      if (res.code === 200) {
        this.dataYield = res.result || [];
        if (this.dataYield) {
          const title = []
        }
      }
      //   }).catch(() => (this.tableConfig.loading = false));
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
