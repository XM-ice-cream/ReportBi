/* spc 自动配置 */
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
                     <!-- 起始时间 -->
                     <FormItem :label="$t('startTime')" prop="startTime">
                          <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                      <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
                    </FormItem>
                    <!-- 数据集编码 -->
                    <FormItem label="channelName" prop="channelName">
                      <Input v-model="req.channelName" :placeholder="$t('pleaseEnter') +'channelName'" @on-search="searchClick" />
                    </FormItem>
                    <!-- 数据集名称 -->
                    <FormItem label="channelParameter" prop="channelParameter">
                      <Input v-model="req.channelParameter" :placeholder="$t('pleaseEnter') + 'channelParameter'" @on-search="searchClick" />
                    </FormItem>
                  </Form>
                  <div class="poptip-style-button">
                    <Button @click="resetClick()">{{ $t("reset") }}</Button>
                    <Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
                  </div>
                </div>
              </Poptip>
            </i-col>
            <i-col span="18" style="text-align: right;">
              <button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick" @on-delete-click="deleteClick" @on-copy-click="copyClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick">
          
        </Table>
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
    <!-- 新增编辑组件 -->
    <edit-spc ref="spc"  @refreshList="pageLoad" />
  </div>
</template>

<script>
import { getpagelistReq, deleteReq } from "@/api/bill-design-manage/spc.js";
import { getButtonBoolean, renderIsEnabled,formatDate } from "@/libs/tools";
import EditSpc from './spc/edit-spc.vue';

export default {
  components: {  EditSpc },
  name: "spc",
  data () {
    return {
      searchPoptipModal: false,
      dialogVisible: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      selectObj: null,//表格选中
      isAdd: true,//新增编辑
      req: {
        startTime: "",
        endTime: "",
        channelName: "",//模板名称
        channelParameter:"",//模板参数
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [
        {
          type: "index", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: 'channelName', key: "channelName", align: "center", tooltip: true,minWidth:200 },
        { title: 'channelParameter', key: "channelParameter", align: "center", tooltip: true,minWidth:150 },
        { title: '描述', key: "remark", align: "center", tooltip: true,minWidth:100 },
        { title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true,width:100, render: renderIsEnabled, },
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
    // 点击搜索按钮触发
    searchClick () {
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 获取分页列表数据
    pageLoad () {
      this.tableConfig.loading = true;
      const {  startTime,endTime,channelName,channelParameter } = this.req;
      let obj = {
        orderField: "channelName", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
            startTime:formatDate(startTime),
            endTime:formatDate(endTime),
            channelName,
            channelParameter 
        },
      };
      getpagelistReq(obj).then((res) => {
        this.tableConfig.loading = false;
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.data = data || [];
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
        }
      }).catch(() => (this.tableConfig.loading = false));
      this.searchPoptipModal = false;
    },
    // 新增按钮
    addClick () {
      this.dialogVisible = true;
      this.isAdd = true;
      this.$refs.spc.pageLoad({}, this.isAdd);
    },
    // 点击编辑按钮触发
    editClick () {
      if (this.selectObj) {
        this.dialogVisible = true;
        this.isAdd = false;
        this.$refs.spc.pageLoad(this.selectObj, this.isAdd);
      } else this.$Msg.warning(this.$t("oneData"));
    },
     // 点击编辑按钮触发
     copyClick () {
      if (this.selectObj) {
        this.dialogVisible = true;
        this.isAdd = false;
        this.$refs.spc.pageLoad(this.selectObj, this.isAdd,'copy');
      } else this.$Msg.warning(this.$t("oneData"));
    },
    cancelClick () {
      this.$refs.submitReq.resetFields(); //清除表单红色提示
    },
    //删除
    deleteClick () {
      if (this.selectObj) {
        this.$Modal.confirm({
        title: "确认要删除该数据吗?",
        onOk: () => {
          deleteReq({ id: this.selectObj.id }).then(res => {
            if (res.code === 200) {
              this.$Message.success("删除成功");
              this.pageLoad();
            }
          })
        },
      });
    } else this.$Msg.warning(this.$t("oneData"));
     

    },

    // 某一行高亮时触发
    currentClick (currentRow) {
      this.selectObj = currentRow;
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
<style lang='less' scope>
</style>
<style>
.ivu-btn > .ivu-icon {
  font-size: 12px;
  line-height: 0.5;
}
.ace-jsoneditor.ace_editor {
  min-height: 21rem;
}
</style>