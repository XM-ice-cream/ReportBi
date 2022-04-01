/* LedWip看板报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
     
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
              
              <!-- 工单 -->
              <template slot-scope="{ row }" slot="moNumber">
                <div style="white-space:pre">{{ row.moNumber}}</div>
              </template>
              <!-- 工单数量 -->
              <template slot-scope="{ row }" slot="moQty">
                <div style="white-space:pre">{{ row.moQty }}</div>
              </template>
              
            </Table>
          </Card>
        <!-- <TabKanban /> -->
    </div>
  </div>
</template>

<script>
import { getlistReq,exportReq} from "@/api/bill-manage/led-wip-report";
import { formatDate, getButtonBoolean } from "@/libs/tools";
import { exportFile } from "@/libs/tools";

export default {
  components: {  },
  name: "led-wip-report",
  data () {
    return {
     
      data: [], // 表格数据
      btnData: [],
      searchPoptipModal:false,
      req: {
        workOrderInfo: "", //workOrderInfo
        // ...this.$config.pageConfig,
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
          title: "line",
          key: "line",
          minWidth: 80,
          ellipsis: true,
          tooltip: true,
          align: "center",
        },
        {
          title: "mode",
          minWidth: 80,
          align: "center",
          key: "mode",
        },
        {
          title: "moType",
          minWidth: 80,
          align: "center",
          key: "moType",
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
          key: "category",
        },
        {
          title: "AutoTape",
          minWidth: 80,
          align: "center",
          key: "step1",
        },
        {
          title: "HBDispense",
          minWidth: 80,
          align: "center",
          key: "step2",
        },
        {
          title: "OP40",
          minWidth: 80,
          align: "center",
          key: "step3",
        },
        {
          title: 'AutoOnOff',
          minWidth: 80,
          align: "center",
          key: "step4",
        },
        {
          title: 'PreBake',
          minWidth: 80,
          align: "center",
          key: "step5",
        },
        {
          title: 'DamDispense',
          minWidth: 85,
          align: "center",
          key: "step6",
        },
        {
          title: 'FillDispense',
          minWidth: 80,
          align: "center",
          key: "step7",
        },
        {
          title: 'AttachIPPF',
          minWidth: 80,
          align: "center",
          key: "step8",
        },
        {
          title: 'TapePeeling',
          minWidth: 80,
          align: "center",
          key: "step9",
        },
        {
          title: 'I16',
          minWidth: 80,
          align: "center",
          key: "step10",
        },
        {
          title: 'FVI',
          minWidth: 80,
          align: "center",
          key: "step11",
        },
        {
          title: 'OQC',
          minWidth: 80,
          align: "center",
          key: "step12",
        },
        {
          title: 'Packing1',
          minWidth: 80,
          align: "center",
          key: "step13",
        },
        {
          title: 'Packing2',
          minWidth: 80,
          align: "center",
          key: "step14",
        }
      ],
       tableConfig: { ...this.$config.tableConfig }, // table配置
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

</style>
