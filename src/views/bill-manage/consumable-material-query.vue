/* LED耗材信息查询 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="320" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="60" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
                    <!-- 大板序号 -->
                    <FormItem :label="$t('panelNo')">
                      <Input type="text" v-model="req.panel" :placeholder="$t('pleaseEnter') + $t('panelNo') + $t('multiple,separated')"></Input>
                    </FormItem>
                    <!-- 小板序号 -->
                    <FormItem :label="$t('smallBoardCode')">
                      <Input type="text" v-model="req.unitId" :placeholder="$t('pleaseEnter') + $t('smallBoardCode') + $t('multiple,separated')"></Input>
                    </FormItem>
                    <!-- 站点 -->
                    <FormItem :label="$t('stepName')">
                      <Input type="text" v-model="req.stepName" placeholder="请输入站点(输入小条码时才有效)"></Input>
                    </FormItem>
                    <!-- 工单 -->
                    <FormItem :label="$t('workOrder')">
                      <v-selectpage v-if="searchPoptipModal" ref="workOrder" class="select-page-style" key-field="workOrder" show-field="workOrder" :data="workerPageListUrl" v-model="req.workOrder" :placeholder="$t('pleaseSelect') + $t('workOrder')" :result-format="
                          (res) => {
                            return {
                              totalRow: res.total,
                              list: res.data || [],
                            };
                          }
                        ">
                      </v-selectpage>
                    </FormItem>
                    <!-- rid -->
                    <FormItem :label="$t('rId')">
                      <Input type="text" v-model="req.rid" :placeholder="$t('pleaseEnter') + $t('rId') + $t('multiple,separated')"></Input>
                    </FormItem>
                    <!-- lotCode -->
                    <FormItem :label="$t('lotCode')">
                      <Input type="text" v-model="req.lotCode" :placeholder="$t('pleaseEnter') + $t('lotCode') + $t('multiple,separated')"></Input>
                    </FormItem>
                    <!-- tfencode -->
                    <FormItem :label="$t('tfencode')">
                      <Input type="text" v-model="req.tfencode" :placeholder="$t('pleaseEnter') + $t('tfencode') + $t('multiple,separated')"></Input>
                    </FormItem>
                    <div class="poptip-style-button">
                      <Button @click="resetClick">{{ $t("reset") }}</Button>
                      <Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
                    </div>
                  </Form>
                </div>
              </Poptip>
            </i-col>
            <i-col span="18">
              <button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/consumable-material-query";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { getButtonBoolean, commaSplitString, formatDate, exportFile } from "@/libs/tools";

export default {
  name: "consumable-material-query",
  data () {
    return {
      workerPageListUrl: workerPageListUrl(),
      searchPoptipModal: false, //刷新数据的时候不重复刷新pageLoad
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      req: {
        totalPage: 5,
        pageIndex: 1,
        pageSize: 10,
        total: 50,
        panel: "", //大板序号
        unitId: "", // 小板序号
        stepName: "",
        workOrder: "", //工单
        rid: "", 
        lotCode: "", 
        tfencode: "", 
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [
        {
          type: "index", fixed: "left", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: this.$t("panel"), key: "panel", width: 120 },
        { title: this.$t("stepName"), key: "stepName", width: 130, tooltip: true },
        { title: this.$t("category"), key: "category", width: 100 },
        { title: this.$t("partNo"), key: "partNo", width: 140 },
        { title: this.$t("dateCode"), key: "dateCode", width: 80 },
        { title: this.$t("lotCode"), key: "lotCode", width: 130 },
        { title: this.$t("vendorName"), key: "vendorName", minWidth: 150, tooltip: true },
        { title: this.$t("expdate"), key: "expdate", width: 130 },
        { title: this.$t("dataValue"), key: "dataValue", width: 130 },
        { title: this.$t("trackTime"), key: "trackTime", width: 125 },
        { title: 'RID', key: "rid", width: 100 },
        { title: 'UnitID', key: "unitid", width: 100 },
      ],
    };
  },
  mounted () {
    this.tableConfig.loading = false
    this.pageLoad();
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
      let { pageSize, pageIndex, panel, unitId, stepName, workOrder, rid, lotCode, tfencode } = this.req;
      if (!panel && !unitId && !stepName && !workOrder && !rid && !lotCode && !tfencode) return this.$Msg.error('请输入查询条件')
      this.tableConfig.loading = true;
      const obj = {
        orderField: "panel", // 排序字段
        ascending: true, // 是否升序
        pageSize, // 分页大小
        pageIndex, // 当前页码
        data: {
          panel: commaSplitString(panel).join(),
          unitId: commaSplitString(unitId).join(),
          stepName,
          workOrder,
          rid, 
          lotCode, 
          tfencode, 
        },
      };
      getpagelistReq(obj).then((res) => {
        this.tableConfig.loading = false;
        if (res.code === 200) {
          let data = res.result;
          this.data = data.data ? data.data : [];
          this.req.pageSize = data.pageSize;
          this.req.pageIndex = data.pageIndex;
          this.req.total = data.total;
          this.req.totalPage = data.totalPage;
        }
      }).catch(() => (this.tableConfig.loading = false));
    },
    searchClick () {
      this.req.pageIndex = 1;
      this.pageLoad();
      this.searchPoptipModal = false;
    },
    // 点击重置按钮触发
    resetClick () {
      this.req.panel = "";
      this.req.unitId = "";
      this.$refs.workOrder.remove()
      this.req.rid = "";
      this.req.lotCode = "";
      this.req.tfencode = "";
    },
    // 导出
    exportClick () {
      let { panel, unitId, stepName, workOrder, rid, lotCode, tfencode } = this.req;
      if (!panel && !unitId && !stepName && !workOrder && !rid && !lotCode && !tfencode) return this.$Msg.error('请输入查询条件')
      const obj = {
        panel: commaSplitString(panel).join(),
        unitId: commaSplitString(unitId).join(),
        stepName,
        workOrder,
        rid, 
        lotCode, 
        tfencode, 
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("consumable-material-query")}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
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
  },
};
</script>
