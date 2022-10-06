/* MaverickFaca */
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
                  <Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
                    <!-- ID -->
                    <FormItem label="ID" prop="id">
                      <Input v-model.trim="req.id" @on-search="searchClick" />
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
              <button-custom :btnData="btnData" @on-reply-click="replyClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-selection-change="currentClick">
          <template slot-scope="{ row }" slot="action">
            <Button size="small" class="replydetail" @click="replyDetail(row)">回复明细</Button>
          </template>
        </Table>
      </Card>
      <reply-maverick :selectArr="selectArr" ref="replymaverick" />
      <expand-row ref="expandrow" />
    </div>
  </div>
</template>

<script>
import { getlistReq } from "@/api/bill-manage/maverick-faca";
import { getButtonBoolean, renderDate } from "@/libs/tools";
import ReplyMaverick from './maverick-faca/reply-maverick.vue';
import expandRow from './maverick-faca/expent-row.vue';

export default {
  components: { ReplyMaverick, expandRow },
  name: "maverick-faca",
  data () {
    return {
      searchPoptipModal: false,
      btnData: [],
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      req: {
        id: "",
      }, //查询数据
      columns: [
        { type: "index", fixed: "left", width: 50, align: "center" },
        { type: "selection", width: 60, align: 'center' },
        { title: "ID", key: "id", align: "center", width: 50, tooltip: true },
        { title: "序列号", key: "serial_Number", align: "center", minWidth: 150, tooltip: true },
        { title: "机种", key: "product", align: "center", width: 150, tooltip: true },
        { title: "ResultDate", key: "resultdate", align: "center", width: 150, tooltip: true, render: renderDate },
        { title: "Stage", key: "stage", align: "center", width: 100, tooltip: true },
        { title: "工站", key: "station", align: "center", width: 100, tooltip: true },
        { title: "线体", key: "line", align: "center", minWidth: 150, tooltip: true },
        { title: "TestStation", key: "teststationcode", align: "center", minWidth: 90, tooltip: true },
        { title: "FailSymptom", key: "failuresymptom", align: "center", minWidth: 90, tooltip: true },
        { title: "Category", key: "category", align: "center", minWidth: 90, tooltip: true },
        { title: "Location", key: "location", align: "center", minWidth: 90, tooltip: true },
        { title: "RootCause", key: "rootcause", align: "center", minWidth: 90, tooltip: true },
        { title: "NextDRI", key: "nextDRI", align: "center", minWidth: 90, tooltip: true },
        { title: "Status", key: "status", align: "center", minWidth: 90, tooltip: true },
        { title: 'Action', slot: 'action', width: 100, align: 'center' }
      ], // 表格数据
      selectArr: [],//表格选中数据
    };
  },
  activated () {
    this.autoSize();
    this.tableConfig.loading = false;
    window.addEventListener('resize', () => this.autoSize);
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
      this.tableConfig.loading = false;
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          this.tableConfig.loading = true;
          let obj = {
            id: this.req.id,
          };
          getlistReq(obj).then((res) => {
            this.tableConfig.loading = false;
            if (res.code === 200) {
              this.data = res?.result||[];
            }
          }).catch(() => (this.tableConfig.loading = false));
          this.searchPoptipModal = false;
        }
      });
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
    },
    //回复信息
    replyClick () {
      if (this.selectArr.length > 0) {
        this.$refs.replymaverick.drawerFlag = true;
      } else {
        this.$Message.error("请选择至少一笔数据进行信息回复！")
      }

    },
    // 某一行高亮时触发
    currentClick (selection) {
      const status = selection[0]?.status || "";
      const isRight = selection.every(item => item.status === status && status !== "Closed");
      if (isRight) {
        this.selectArr = selection;
      } else {
        this.$Message.error("选择状态必须一致,并且状态不可为Closed,请核对~");
      }

    },
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 120 - 60;
    },
    //获取url参数
    getUrlParams () {
      let url = window.location.href;
      if (url.indexOf('?') != -1) {
        let obj = {};
        let arr = url.slice(url.indexOf('?') + 1).split('&');
        arr.forEach(item => {
          let param = item.split('=');
          obj[param[0]] = param[1];
        })
        return obj;
      } else {
        return null;
      }
    },
    //查看回复明细
    replyDetail (row) {
      this.$refs.expandrow.pageLoad(row);
    },
  },
  mounted () {
    const params = this.getUrlParams();
    this.req.id = params?.id || "";
    this.searchClick();
  },
}
</script>
<style scoped>
.replydetail {
  color: #0078dd;
  background-color: #4127ce00;
  border-color: #0189fd;
}
</style>