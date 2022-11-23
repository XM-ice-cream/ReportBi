/* EPM上下限配置 */
<template>
  <div class="page-style">
    <!-- 右侧抽屉 Form表单 -->
    <Drawer
      v-model="drawerFlag"
      :title="drawerTitle"
      width="500"
      :mask-closable="false"
      @on-close="cancelClick"
    >
      <Form
        ref="submitReq"
        :model="submitData"
        :rules="ruleValidate"
        :label-width="90"
        :label-colon="true"
        @submit.native.prevent
      >
        <!-- 项目 -->
        <FormItem label="项目" prop="item">
            <Input v-model="submitData.item" :placeholder="$t('pleaseEnter') + '项目'" />
        </FormItem>
        <!-- 站点 -->
        <FormItem label="站点" prop="station">
            <Input v-model="submitData.station" :placeholder="$t('pleaseEnter') + '站点'" />
        </FormItem>
        <!-- 检测项字段 -->
        <FormItem label="检测项字段" prop="tesT_PARAMETER_NAME">
          <Input v-model="submitData.tesT_PARAMETER_NAME" :placeholder="$t('pleaseEnter') + '检测项字段'" />
        </FormItem>
        <!-- 单位 -->
        <FormItem label="单位" prop="unit">
          <Input v-model="submitData.unit" :placeholder="$t('pleaseEnter') + '单位'" />
        </FormItem>
        <!-- 上限 -->
        <FormItem label="USL" prop="usl">
          <Input v-model="submitData.usl" :placeholder="$t('pleaseEnter') + 'USL'" />
        </FormItem>
        <!-- 下限 -->
        <FormItem label="LSL" prop="lsl">
          <Input v-model="submitData.lsl" :placeholder="$t('pleaseEnter') + 'LSL'" />
        </FormItem>
         <!-- 上限 -->
         <FormItem label="UCL" prop="ucl">
          <Input v-model="submitData.ucl" :placeholder="$t('pleaseEnter') + 'UCL'" />
        </FormItem>
        <!-- 下限 -->
        <FormItem label="LCL" prop="lcl">
          <Input v-model="submitData.lcl" :placeholder="$t('pleaseEnter') + 'LCL'" />
        </FormItem>
        <!-- 下限 -->
        <FormItem label="Line_Categy" prop="line_Categy">
          <Input v-model="submitData.line_Categy" :placeholder="$t('pleaseEnter') + 'Line_Categy'" />
        </FormItem>
        <!-- 备注 -->
        <FormItem label="备注" prop="remark">
          <Input v-model="submitData.remark" :placeholder="$t('pleaseEnter') + '备注'" />
        </FormItem>
        <!-- 按钮 -->
        <FormItem>
          <drawer-button
            :text="drawerTitle"
            @on-cancel="cancelClick"
            @on-ok="submitClick"
            @on-okAndClose="submitClick(true)"
          ></drawer-button>
        </FormItem>
      </Form>
    </Drawer>
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <!-- 查询条件与按钮 -->
        <div slot="title">
          <Row>
            <!-- 查询条件 -->
            <i-col span="12">
              <Poptip
                v-model="poptipModal"
                class="poptip-style"
                placement="right-start"
                width="400"
                transfer
              >
                <Button type="primary" icon="ios-search">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form
                    ref="searchReq"
                    :model="req"
                    :label-width="60"
                    :label-colon="true"
                    @submit.native.prevent
                    @keyup.native.enter="searchClick"
                  >
                    <!-- 项目 -->
                    <FormItem label="项目" prop="item">
                      <Input
                        v-model.trim="req.item"
                        :placeholder="$t('pleaseEnter') + '项目'"                        
                      />
                    </FormItem>
                    <div class="poptip-style-button">
                      <Button @click="resetClick">{{ $t("reset") }}</Button>
                      <Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
                    </div>
                  </Form>
                </div>
              </Poptip>
            </i-col>
            <!-- 按钮 -->
            <i-col span="12">
              <button-custom
                :btnData="btnData"
                @on-add-click="addClick"
                @on-edit-click="editClick"
              ></button-custom>
            </i-col>
          </Row>
        </div>
        <!-- 显示列表 -->
        <Table
          :border="tableConfig.border"
          :highlight-row="tableConfig.highlightRow"
          :height="tableConfig.height"
          :loading="tableConfig.loading"
          :columns="columns"
          :data="data"
          @on-current-change="currentClick"
        ></Table>
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, addReq, modifyReq } from "@/api/bill-manage/epm-config";
import { getButtonBoolean, errorType, renderDate } from "@/libs/tools";
export default {
  name: "epm-config",
  data() {
    return {
      poptipModal: false,
      isAdd: true,
      drawerFlag: false,
      tableConfig: { ...this.$config.tableConfig }, // table配置
      drawerTitle: this.$t("add"),
      // 表格表头
      stationList: [],
      columns: [
        {
          type: "index",
          width: 50,
          align: "center",
          fixed: "left",
        },
        { title: "项目", key: "item", align: "center", minWidth: 120, tooltip: true  },
        { title: "站点", key: "station", align: "center", minWidth: 140, tooltip: true  },
        { title: "检测项字段", key: "tesT_PARAMETER_NAME", align: "center", minWidth: 250, tooltip: true  },
        { title: "单位", key: "unit", align: "center", minWidth: 100, tooltip: true },
        { title: "USL", key: "usl", align: "center", minWidth: 100, tooltip: true  },
        { title: "LSL", key: "lsl", align: "center", minWidth: 100, tooltip: true  },
        { title: "UCL", key: "ucl", align: "center", minWidth: 100, tooltip: true  },
        { title: "LCL", key: "lcl", align: "center", minWidth: 100, tooltip: true },
        { title: "Line_Categy", key: "line_Categy", align: "center", minWidth: 100, tooltip: true },
        { title: this.$t("remark"), key: "remark", align: "center", width: 150, tooltip: true  },
        { title: this.$t("createUser"), key: "createUserName", align: "center", width: 80 },
        { title: this.$t("createDate"), key: "createDate", align: "center", width: 125, render: renderDate },
        { title: this.$t("modifyUser"), key: "modifyUserName", align: "center", width: 80 },
        { title: this.$t("modifyDate"), key: "modifyDate", align: "center", width: 125, render: renderDate },
      ], // 表格数据
      data: [], // 表格数据
      selectObj: null, // 表格选中数据
      req: {
        item:"",//项目
      },
      submitData: {
        id:"",
        station: "",
        item: "",
        tesT_PARAMETER_NAME: "",
        unit: "",
        usl: 0,
        lsl:0,
        ucl: 0,
        lcl: 0,
        line_Categy: "",
        remark:"",
      },
      // 验证实体
      ruleValidate: {
        tesT_PARAMETER_NAME: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}测试项字段`,
            trigger: "change",
          },
        ],
      },
      btnData: [],
    };
  },
  activated() {
    this.pageLoad();
    this.autoSize();
    window.addEventListener("resize", () => this.autoSize());
    getButtonBoolean(this, this.btnData);
  },

  methods: {
    // 获取分页列表数据
    pageLoad() {
      this.tableConfig.loading = true;
      let {  item } = this.req;
      getpagelistReq({item})
        .then((res) => {
          this.tableConfig.loading = false;
          if (res.code === 200) {
            this.data = res.result || [];
          }
        })
        .catch(() => (this.tableConfig.loading = false));
    },
    // 点击重置按钮触发
    resetClick() {
      this.$refs.searchReq.resetFields();
    },
    // 点击搜索按钮触发
    searchClick() {
      this.selectObj = null;
      this.poptipModal = false;
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 点击新增按钮触发
    addClick() {
      this.drawerFlag = true;
      this.isAdd = true;
      this.drawerTitle = this.$t("add");
    },
    // 点击编辑按钮触发
    editClick() {
      if (this.selectObj) {
        this.submitData = { ...this.selectObj };
        this.drawerFlag = true;
        this.isAdd = false;
        this.drawerTitle = this.$t("edit");
      } else this.$Msg.warning(`${this.$t("oneData")}`);
    },
    //提交
    submitClick(isClose = false) {
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          let obj = { ...this.submitData };
          let request = this.isAdd ? addReq(obj) : modifyReq(obj);
          request.then((res) => {
            if (res.code === 200) {
              this.selectObj = null;
              this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
              this.pageLoad();
              if (isClose) this.cancelClick();
            } else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
          });
        }
      });
    },
    // 左侧抽屉取消
    cancelClick() {
      this.drawerFlag = false;
      this.$refs.submitReq.resetFields(); //清除表单红色提示
      this.submitData.id = "";
    },
    // 自动改变表格高度
    autoSize() {
      let height = document.body.clientHeight - 120;
      this.tableConfig.height = height - 60;
    },
    // 某一行高亮时触发
    currentClick(currentRow) {
      this.selectObj = currentRow;
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
