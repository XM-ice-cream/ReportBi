/* Insight上传信息查询 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="50" :label-colon="true" @submit.native.prevent>
                    <!-- 小条码 -->
                    <FormItem :label="$t('sn')" prop="unitId">
                      <Input v-model.trim="req.unitId" :placeholder="$t('pleaseEnter') + $t('sn')+$t('multiple,separated')" />
                    </FormItem>
                  </Form>
                  <div class="poptip-style-button">
                    <Button @click="resetClick()">{{ $t("reset") }}</Button>
                    <Button type="primary" @click="pageLoad()">{{ $t("query") }}</Button>
                  </div>
                </div>
              </Poptip>
            </i-col>
            <i-col span="18">
              <button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/insight-query";
import {
  formatDate,
  getButtonBoolean,
  exportFile,
  commaSplitString,
  renderDate,
} from "@/libs/tools";
export default {
  name: "insight-query",
  data () {
    return {
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      req: {
        unitId: "",
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
        // { title: "Recordid", key: "recordid", width: 120 },
        { title: "UnitSerialNumber", key: "unitSerialNumber", width: 160 },
        { title: "Origin", key: "origin", width: 60 },
        { title: "ActionFlag", key: "actionFlag", width: 80 },
        { title: "InfoCode", key: "infoCode", width: 100 },
        { title: "LineName", key: "lineName", width: 160 },
        { title: "Moduledescription", key: "moduledescription", width: 120 },
        { title: "Applepartnumber", key: "applepartnumber", width: 120 },
        { title: "TimeStamp", key: "timeStamp", width: 125, render: renderDate },
        { title: "LotCode", key: "lotCode", width: 120 },
        { title: "DateCode", key: "dateCode", width: 80 },
        { title: "VendorName", key: "vendorName", width: 120 },
        { title: "Site", key: "site", width: 120 },
      ], // 表格数据
    };
  },
  activated () {
    this.pageLoad();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = false;
      let { unitId } = this.req;
      if (unitId) {
        this.tableConfig.loading = true;
        let obj = {
          orderField: "UnitSerialNumber", // 排序字段
          ascending: true, // 是否升序
          pageSize: this.req.pageSize, // 分页大小
          pageIndex: this.req.pageIndex, // 当前页码
          data: {
            unitNo: commaSplitString(unitId).join(),
          },
        };
        getpagelistReq(obj)
          .then((res) => {
            this.tableConfig.loading = false;
            if (res.code === 200) {
              let { data, pageSize, pageIndex, total, totalPage } = res.result;
              this.data = data || [];
              this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
            }
          })
          .catch(() => (this.tableConfig.loading = false));
      } else {
        this.$Message.warning(this.$t("pleaseEnter") + this.$t("selectQuery"));
      }
    },
    // 导出
    exportClick () {
      let { unitId } = this.req;
      if (unitId) {
        const obj = {
          unitNo: commaSplitString(this.req.unitId).join(),
        };
        exportReq(obj).then((res) => {
          let blob = new Blob([res], { type: "application/vnd.ms-excel" });
          const fileName = `${this.$t("insight-query")}${formatDate(new Date())}.xlsx`; // 自定义文件名
          exportFile(blob, fileName);
        });
      } else {
        this.$Message.warning(this.$t("pleaseEnter") + this.$t("selectQuery"));
      }
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
      this.searchPoptipModal = false;
      this.$nextTick(() => {
        this.searchPoptipModal = true;
      });
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
};
</script>
