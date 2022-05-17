/* 扩晶Pitch值查询报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="500" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
                    <!-- 起始时间 -->
                    <FormItem :label="$t('startTime')" prop="startTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
                    </FormItem>
                    <!-- 大板序号 -->
                    <FormItem label="WarferID">
                      <Input v-model.trim="req.barcode" :placeholder="$t('pleaseEnter') + 'WarferID' + $t('multiple,separated')"></Input>
                    </FormItem>
                  </Form>
                  <div class="poptip-style-button">
                    <Button @click="resetClick()">{{ $t("reset") }}</Button>
                    <Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
                  </div>
                </div>
              </Poptip>
            </i-col>
            <i-col span="18">
              <button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data">
        </Table>
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/expandpitch-query";
import { getButtonBoolean, formatDate, exportFile, commaSplitString, renderDate } from "@/libs/tools";
export default {
  name: "expandpitch-query",
  data () {
    return {
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      req: {
        startTime: "",
        endTime: "",
        barcode: "",
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
        { title: "WarferID", key: "barcode", align: "center" },
        { title: "CreateDate", key: "createdate", align: "center", width: 125, render: renderDate, },
        { title: "Polarity", key: "polarity", align: "center" },
        { title: "D1", key: "d1", align: "center" },
        { title: "D2", key: "d2", align: "center" },
        { title: "D3", key: "d3", align: "center" },
        { title: "D4", key: "d4", align: "center" },
        { title: "D5", key: "d5", align: "center" },
        { title: "D6", key: "d6", align: "center" },
        { title: "D7", key: "d7", align: "center" },
        { title: "D8", key: "d8", align: "center" },
        { title: "D9", key: "d9", align: "center" },
      ], // 表格数据
    };
  },
  activated () {
    this.pageLoad();
    this.autoSize();
    window.addEventListener("resize", () => this.autoSize());
    getButtonBoolean(this, this.btnData);
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 点击搜索按钮触发
    searchClick () {
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 获取分页列表数据
    pageLoad () {
      this.data = [];
      this.tableConfig.loading = false;
      let { startTime, endTime, barcode } = this.req;
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          this.tableConfig.loading = true;
          let obj = {
            orderField: 'barcode', // 排序字段
            ascending: true, // 是否升序
            pageSize: this.req.pageSize, // 分页大小
            pageIndex: this.req.pageIndex, // 当前页码
            data: {
              startTime: formatDate(startTime),
              endTime: formatDate(endTime),
              barcode: commaSplitString(barcode).join(),
            },
          };
          getpagelistReq(obj)
            .then((res) => {
              this.tableConfig.loading = false;
              if (res.code === 200) {
                let { data, pageSize, pageIndex, total, totalPage } = res.result;
                this.data = data || [];
                this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
                this.searchPoptipModal = false;
              }
            })
            .catch(() => (this.tableConfig.loading = false));
        }
      });
    },
    // 导出
    exportClick () {
      let { startTime, endTime, barcode } = this.req;
      let obj = {
        startTime: formatDate(startTime),
        endTime: formatDate(endTime),
        barcode: commaSplitString(barcode).join(),
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `${this.$t("expandpitch-query")}${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
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
