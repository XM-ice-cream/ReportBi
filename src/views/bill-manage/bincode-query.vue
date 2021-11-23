/* bincode */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="18">
              <Form ref="searchReq" :model="req" inline :label-colon="true" class="card-style-form" @submit.native.prevent>
                <!-- 起始时间 -->
                <FormItem :label="$t('startTime')" prop="startTime">
                  <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime" style="width: 200px"></DatePicker>
                </FormItem>
                <!-- 结束时间 -->
                <FormItem :label="$t('endTime')" prop="endTime">
                  <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime" style="width: 200px"></DatePicker>
                </FormItem>
                <!-- pn -->
                <FormItem :label="$t('pn')" prop="pn">
                  <Input search enter-button v-model="req.pn" :placeholder="$t('pleaseEnter') + $t('pn')" @on-search="pageLoad" />
                </FormItem>
              </Form>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
      </Card>
    </div>
  </div>
</template>

<script>
import { getlistReq } from "@/api/bill-manage/bincode-query";
import { getButtonBoolean, formatDate } from "@/libs/tools";
export default {
  name: "bincode-query",
  data () {
    return {
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      req: {
        startTime: "",
        endTime: "",
        pn: "", //工单
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
        { title: this.$t("pn"), key: "pn", align: "center" },
        { title: "BinCode", key: "binCode", align: "center" },
        { title: this.$t("count"), key: "count", align: "center" },
      ], // 表格数据
      data: [], // 表格数据
      btnData: [],
    };
  },
  activated () {
    this.pageLoad();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = false;
      let { startTime, endTime, pn } = this.req;
      if (startTime && endTime && pn) {
        this.$refs.searchReq.validate((validate) => {
          if (validate) {
            this.tableConfig.loading = true;
            const obj = {
              startTime: formatDate(startTime),
              endTime: formatDate(endTime),
              pn: this.req.pn,
            };
            getlistReq(obj)
              .then((res) => {
                this.tableConfig.loading = false;
                if (res.code === 200) this.data = res.result || [];
              })
              .catch(() => (this.tableConfig.loading = false));
          }
        });
      } else {
        this.$Message.warning(this.$t("pleaseEnter") + this.$t("selectQuery"));
      }
    },
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 130;
    },
  },
};
</script>
