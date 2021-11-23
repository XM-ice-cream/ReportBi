/* REEL查询 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="3">
              <Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="350">
                <Button type="primary" icon="ios-search" style="margin-bottom:5px">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="60" :label-colon="true" @submit.native.prevent>
                    <FormItem :label="$t('rId')" prop="id">
                      <Input v-model="req.id" :placeholder="$t('pleaseEnter') + $t('rId')" @keyup.native.enter="searchClick" />
                    </FormItem>
                    <FormItem :label="$t('pn')" prop="pn">
                      <Input v-model="req.pn" :placeholder="$t('pleaseEnter') + $t('pn')" @keyup.native.enter="searchClick" />
                    </FormItem>
                    <FormItem :label="$t('category')" prop="category">
                      <Select v-model="req.category" clearable :placeholder="$t('pleaseSelect') + $t('category')">
                        <Option v-for="(item, i) in reelQueryTypeList" :value="item.detailCode" :key="i">
                          {{ item.detailName }}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem :label="$t('issueFlag')" prop="issueFlag">
                      <Select v-model="req.issueFlag" clearable :placeholder="$t('pleaseSelect') + $t('issueFlag')">
                        <Option :value="-1">全部</Option>
                        <Option :value="0">未发料</Option>
                        <Option :value="1">已发料</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="DateCode" prop="dateCode">
                      <Input v-model="req.dateCode" :placeholder="$t('pleaseEnter') + 'DateCode'" @keyup.native.enter="searchClick" />
                    </FormItem>
                    <FormItem label="LotCode" prop="lotCode">
                      <Input v-model="req.lotCode" :placeholder="$t('pleaseEnter') + 'LotCode'" @keyup.native.enter="searchClick" />
                    </FormItem>
                    <FormItem :label="$t('packCode')" prop="packageId">
                      <Input v-model="req.packageId" :placeholder="$t('pleaseEnter') + $t('packCode')" @keyup.native.enter="searchClick" />
                    </FormItem>
                    <div class="poptip-style-button">
                      <Button @click="resetClick">{{ $t("reset") }}</Button>
                      <Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
                    </div>
                  </Form>
                </div>
              </Poptip>
            </i-col>
            <i-col span="21">
              <button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick" @on-sort-change="sortChange"></Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/reel-query";
import {
  renderIsEnabled,
  renderDate,
  getButtonBoolean,
  formatDate,
  exportFile,
} from "@/libs/tools";
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";

export default {
  name: "reel-query",

  data () {
    return {
      poptipModal: false,
      tableConfig: { ...this.$config.tableConfig }, // table配置
      selectObj: null, // 表格选中数据
      data: [], // 表格数据
      columns: [
        {
          type: "index",
          width: 50,
          align: "center",
          fixed: "left",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: this.$t("rId"), key: "id", sortable: "custom", width: 220, fixed: "left", align: 'center' },
        { title: this.$t("pn"), key: "pn", width: 140, tooltip: true, align: 'center' },
        {
          title: this.$t("category"),
          key: "category",
          width: 80,
          render: (h, params) => {
            let val = "";
            if (this.reelQueryTypeList.length) {
              let valItem =
                this.reelQueryTypeList.find((o) => o.detailCode === params.row.category) || {};
              val = valItem.detailName;
            }
            return h("div", val);
          },
          align: 'center'
        },
        {
          title: this.$t("issueFlag"),
          key: "issueFlag",
          width: 60,
          render: (h, params) => {
            return h("div", params.row.issueFlag ? "已发料" : "未发料");
          },
          align: 'center'
        },
        { title: this.$t("binCode"), key: "binCode", width: 120, align: 'center' },
        { title: this.$t("packCode"), key: "packageId", width: 200, align: 'center' },
        { title: "DateCode", key: "dateCode", width: 80, align: 'center' },
        { title: this.$t("expDate"), key: "expdate", width: 125, render: renderDate, align: 'center' },
        { title: this.$t("expDateCode"), key: "expDateCode", width: 120, align: 'center' },
        { title: "LotCode", key: "lotCode", width: 100, align: 'center' },
        { title: this.$t("manufacturer"), key: "vendorName", width: 180, align: 'center' },
        { title: this.$t("oQty"), key: "oqty", width: 60, align: 'center' },
        { title: this.$t("initialQTY"), key: "qty", width: 60, align: 'center' },
        { title: this.$t("remark"), key: "remark", minWidth: 120, align: 'center' },
        { title: this.$t("enabled"), key: "enabled", width: 70, render: renderIsEnabled, align: 'center' },
        { title: this.$t("createUser"), key: "createUserName", width: 80, align: 'center' },
        { title: this.$t("createDate"), key: "createDate", width: 125, render: renderDate, align: 'center' },
        { title: this.$t("modifyUserName"), key: "modifyUserName", width: 80, align: 'center' },
        { title: this.$t("modifyDate"), key: "modifyDate", width: 125, render: renderDate, align: 'center' }
      ], // 表格数据
      req: {
        id: "", //查询类别
        pn: "", //查询类别
        category: "", //查询类别
        packageId: "",
        dateCode: "",
        lotCode: "",
        issueFlag: -1,
        ...this.$config.pageConfig,
      }, //查询数据
      // 验证实体
      reelQueryTypeList: [], //查询类别列表
      btnData: [], //查询类别列表
    };
  },
  mounted () {
    this.req.orderField = "id";
    this.pageLoad();
  },
  activated () {
    getButtonBoolean(this, this.btnData);
    this.getDataItemData();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = true;
      const obj = {
        orderField: this.req.orderField, // 排序字段
        ascending: this.req.ascending, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          id: this.req.id,
          pn: this.req.pn,
          category: this.req.category,
          packageId: this.req.packageId,
          dateCode: this.req.dateCode,
          lotCode: this.req.lotCode,
          issueFlag: this.req.issueFlag,
          enabled: -1,
        },
        isFuzzyKey: ["id", "pn", "dateCode", "lotCode"],
      };
      getpagelistReq(obj)
        .then((res) => {
          this.poptipModal = this.tableConfig.loading = false;
          if (res.code === 200) {
            let { data, pageSize, pageIndex, total, totalPage } = res.result;
            this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
            this.data = data || [];
          }
        })
        .catch(() => (this.tableConfig.loading = false));
    },
    // 点击编码规则中的加号按钮触发
    async getDataItemData () {
      this.reelQueryTypeList = await this.getDataItemDetailList("reelQueryType");
    },
    async getDataItemDetailList (itemCode) {
      const obj = { itemCode, enabled: 1 };
      let arr = [];
      await getdataitemlistReq(obj).then((res) => {
        if (res.code === 200) arr = res.result || [];
      });
      return arr;
    },
    // 点击搜索按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
    },
    // 点击搜索按钮触发
    searchClick () {
      this.selectObj = null;
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 导出
    exportClick () {
      let { id, pn, category, enabled, packageId, dateCode, lotCode, issueFlag } = this.req;
      const obj = {
        id,
        pn,
        category,
        enabled,
        packageId,
        dateCode,
        lotCode,
        issueFlag,
        isFuzzyKey: ["id", "pn", "packageId", "dateCode", "lotCode"],
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        // 自定义文件名
        const fileName = `${this.$t("reel-query")}${formatDate(new Date())}.xlsx`;
        exportFile(blob, fileName);
      });
    },
    // 自动改变表格高度
    autoSize () {
      let height = document.body.clientHeight - 120;
      this.tableConfig.height = height - 60;
    },
    // 某一行高亮时触发
    currentClick (currentRow) {
      this.selectObj = currentRow;
    },
    // 排序时有效，当点击排序时触发
    sortChange (data) {
      this.req.orderField = data.key.toUpperCase();
      this.req.ascending = data.order === "asc";
      this.pageLoad();
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
