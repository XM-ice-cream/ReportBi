/* omm配置 */
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
        <!-- 站点 -->
        <FormItem label="站点" prop="station">
          <Input v-model="submitData.station" :placeholder="$t('pleaseEnter') + '站点'" />
        </FormItem>
        <!-- 编号名称 -->
        <FormItem label="编号名称" prop="name">
          <Input v-model="submitData.name" :placeholder="$t('pleaseEnter') + '编号名称'" />
        </FormItem>
        <!-- 通道名称 -->
        <FormItem label="通道名称" prop="channelType">
          <Input v-model="submitData.channelType" :placeholder="$t('pleaseEnter') + '通道名称'" />
        </FormItem>
        <!-- 通道参数 -->
        <FormItem label="通道参数" prop="channelParamter">
          <Input
            v-model="submitData.channelParamter"
            :placeholder="$t('pleaseEnter') + '通道参数'"
          />
        </FormItem>
        <!-- 下限值 -->
        <FormItem label="下限值" prop="specLimitLower">
          <Input v-model="submitData.specLimitLower" :placeholder="$t('pleaseEnter') + '下限值'" />
        </FormItem>
        <!-- 目标值 -->
        <FormItem label="目标值" prop="specLimitTarget">
          <Input v-model="submitData.specLimitTarget" :placeholder="$t('pleaseEnter') + '目标值'" />
        </FormItem>
        <!-- 上限值 -->
        <FormItem label="上限值" prop="specLimitUpper">
          <Input v-model="submitData.specLimitUpper" :placeholder="$t('pleaseEnter') + '上限值'" />
        </FormItem>
        <!-- 备注 -->
        <FormItem label="备注" prop="remark">
          <Input v-model="submitData.remark" :placeholder="$t('pleaseEnter') + '备注'" />
        </FormItem>
        <!-- 是否有效 -->
        <FormItem :label="$t('enabled')" prop="enabled">
          <i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
            <span slot="open">{{ $t("open") }}</span>
            <span slot="close">{{ $t("close") }}</span>
          </i-switch>
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
                  >
                    <!-- 站点 -->
                    <FormItem label="站点" prop="station">
                      <Input
                        v-model.trim="req.station"
                        :placeholder="$t('pleaseEnter') + '站点'"
                        @keyup.native.enter="searchClick"
                      />
                    </FormItem>
                    <!-- 编号名称 -->
                    <FormItem label="编号名称" prop="name">
                      <Input
                        v-model.trim="req.name"
                        :placeholder="$t('pleaseEnter') + '编号名称'"
                        @keyup.native.enter="searchClick"
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
          @on-sort-change="sortChange"
        ></Table>
        <page-custom
          :total="req.total"
          :totalPage="req.totalPage"
          :pageIndex="req.pageIndex"
          :page-size="req.pageSize"
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
        />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, addReq, modifyReq } from "@/api/bill-manage/omm-config";
import { getButtonBoolean, errorType, renderIsEnabled, renderDate } from "@/libs/tools";
export default {
  name: "omm-config",
  data() {
    return {
      poptipModal: false,
      isAdd: true,
      drawerFlag: false,
      drawerTitle: this.$t("add"),
      tableConfig: { ...this.$config.tableConfig }, // table配置
      // 表格表头
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
        { title: "站点", key: "station" },
        { title: "编号名称", key: "name" },
        { title: "通道名称", key: "channelType" },
        { title: "通道参数", key: "channelParamter" },
        { title: "下限值", key: "specLimitLower" },
        { title: "目标值", key: "specLimitTarget" },
        { title: "上限值", key: "specLimitUpper" },
        { title: this.$t("remark"), key: "remark" },
        { title: this.$t("enabled"), key: "enabled", width: 70, render: renderIsEnabled },
        { title: this.$t("createUser"), key: "createUserName", width: 80 },
        { title: this.$t("createDate"), key: "createDate", width: 125, render: renderDate },
        { title: this.$t("modifyUser"), key: "modifyUserName", width: 80 },
        { title: this.$t("modifyDate"), key: "modifyDate", width: 125, render: renderDate },
      ], // 表格数据
      data: [], // 表格数据
      selectObj: null, // 表格选中数据
      req: {
        station: "",
        name: "",
        ...this.$config.pageConfig,
      },
      submitData: {
        id: "",
        station: "", //站点（必填）
        name: "", //编号名称（必填）
        channelType: "", //通道名称（必填）
        channelParamter: "", //通道参数（必填）
        specLimitLower: "", //下限值（必填）
        specLimitTarget: "", //目标值（必填）
        specLimitUpper: "", //上限值（必填）
        remark: "", //备注（非必填）
        enabled: 1, //是否有效
      },
      // 验证实体
      ruleValidate: {
        station: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}站点`,
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}编号名称`,
            trigger: "change",
          },
        ],
        channelType: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}通道名称`,
            trigger: "change",
          },
        ],
        channelParamter: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}通道参数`,
            trigger: "change",
          },
        ],
        specLimitLower: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}下限值`,
            trigger: "change",
          },
        ],
        specLimitTarget: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}目标值`,
            trigger: "change",
          },
        ],
        specLimitUpper: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}上限值`,
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
      let { pageIndex, pageSize, ascending, orderField, station, name } = this.req;
      const obj = {
        orderField, // 排序字段
        ascending, // 是否升序
        pageSize, // 分页大小
        pageIndex, // 当前页码
        data: { station, name, enabled: -1 },
        isFuzzyKey: [],
      };
      getpagelistReq(obj)
        .then((res) => {
          this.tableConfig.loading = false;
          if (res.code === 200) {
            let data = res.result;
            this.data = data.data || [];
            this.req.pageSize = data.pageSize;
            this.req.pageIndex = data.pageIndex;
            this.req.total = data.total;
            this.req.totalPage = data.totalPage;
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
    // 排序时有效，当点击排序时触发
    sortChange(data) {
      this.req.orderField = data.key.toUpperCase();
      this.req.ascending = data.order === "asc";
      this.pageLoad();
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
