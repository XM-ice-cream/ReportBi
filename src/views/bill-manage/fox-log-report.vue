/* FoxLog报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400"
                      trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent
                        @keyup.native.enter="searchClick">
                    <!-- 起始时间 -->
                    <FormItem :label="$t('startTime')" prop="startTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')"
                                  format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"
                                  v-model="req.startTime"></DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')"
                                  format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"
                                  v-model="req.endTime"></DatePicker>
                    </FormItem>
                    <!-- 小条码 -->
                    <FormItem :label="$t('smallBoardCode')" prop="unitID">
                      <Input v-model.trim="req.unitID" placeholder="请输入小条码,多个以英文逗号或空格分隔"
                             @on-search="searchClick"/>
                    </FormItem>
                    <!-- 站点 -->
                    <FormItem :label="$t('station')" prop="station">
                      <Input v-model.trim="req.station" :placeholder="$t('pleaseEnter') + $t('station')"
                             @on-search="searchClick"/>
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
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height"
               :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize"
                     @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
      </Card>
    </div>
  </div>
</template>

<script>
import {getpagelistReq, exportReq} from "@/api/bill-manage/fox-log-report";
import {getButtonBoolean, formatDate, exportFile, renderDate, commaSplitString} from "@/libs/tools";

export default {
  name: "fox-log-report",
  data() {
    return {
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: {...this.$config.tableConfig}, // table配置
      data: [], // 表格数据
      btnData: [],
      categoryList: [],// 类别下拉框
      req: {
        startTime: "",
        endTime: "",
        unitID: "",
        station: "",
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [
        {
          type: "index", fixed: "left", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        {title: this.$t("smallBoardCode"), key: "barcode", align: "center", width: 150, tooltip: true, fixed: 'left'},
        {title: this.$t("station"), key: "station", align: "center", width: 150, tooltip: true},
        {title: this.$t("fileName"), key: "fileName", align: "center", width: 350, tooltip: true},
        {title: "上传状态", key: "uploadStatus", align: "center", width: 60, tooltip: true},
        {title: "文件状态", key: "fileStatu", align: "center", width: 60, tooltip: true},
        {title: "创建时间", key: "jsonCreatetime", align: "center", width: 130, render: renderDate,},
        {title: "上传时间", key: "uploadTime", align: "center", width: 130, render: renderDate,},
        {title: "反馈信息", key: "feedBackMsg", align: "center", width: 300, tooltip: true},
      ], // 表格数据
    };
  },
  activated() {
    this.pageLoad();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave(to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 点击搜索按钮触发
    searchClick() {
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 获取分页列表数据
    pageLoad() {
      this.data = [];
      this.tableConfig.loading = false;
      let {startTime, endTime, unitID, station} = this.req;
      if ((startTime && endTime) || unitID || station) {
        this.$refs.searchReq.validate((validate) => {
          if (validate) {
            this.tableConfig.loading = true;
            let obj = {
              orderField: "barcode", // 排序字段
              ascending: true, // 是否升序
              pageSize: this.req.pageSize, // 分页大小
              pageIndex: this.req.pageIndex, // 当前页码
              data: {
                startTime: formatDate(startTime),
                endTime: formatDate(endTime),
                unitID: commaSplitString(unitID).join(),
                station,
              },
            };
            getpagelistReq(obj).then((res) => {
              this.tableConfig.loading = false;
              if (res.code === 200) {
                let {data, pageSize, pageIndex, total, totalPage} = res.result;
                this.data = data || [];
                this.req = {...this.req, pageSize, pageIndex, total, totalPage};
              }
            })
              .catch(() => (this.tableConfig.loading = false));
            this.searchPoptipModal = false;
          }
        });
      } else {
        this.$Message.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
      }
    },
    // 导出
    exportClick() {
      let {startTime, endTime, unitID, station} = this.req;
      if ((startTime && endTime) || unitID || station) {
        let obj = {
          startTime: formatDate(startTime),
          endTime: formatDate(endTime),
          unitID: commaSplitString(unitID).join(),
          station,
        };
        exportReq(obj).then((res) => {
          let blob = new Blob([res], {type: "application/vnd.ms-excel"});
          const fileName = `${this.$t("fox-log-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
          exportFile(blob, fileName);
        });
      } else {
        this.$Message.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
      }
    },
    // 点击重置按钮触发
    resetClick() {
      this.$refs.searchReq.resetFields();
    },
    // 自动改变表格高度
    autoSize() {
      this.tableConfig.height = document.body.clientHeight - 120 - 60;
    },
    // 选择第几页
    pageChange(index) {
      this.req.pageIndex = index;
      this.pageLoad();
    },
    // 选择一页有条数据
    pageSizeChange(index) {
      this.req.pageIndex = 1;
      this.req.pageSize = index;
      this.pageLoad();
    },
  },
};
</script>
