/* 数据源 */
<template>
  <div class="page-style">
    <!-- 左侧抽屉 -->
    <!-- <Modal v-model="modal2" width="360"> -->
    <Modal v-model="drawerFlag" :title="drawerTitle" width="1000" :mask-closable="false" @on-close="cancelClick">
      <Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="100" :label-colon="true">
        <!-- 数据源类型 -->
        <FormItem :label="$t('dataSourceType')" prop="dataSourceType">
          <Select v-model="submitData.dataSourceType" clearable :placeholder="$t('pleaseSelect') + $t('status')" transfer>
            <Option v-for="(item, i) in dataSourceTypeList" :value="item.detailName" :key="i">
              {{ item.detailName }}
            </Option>
          </Select>
        </FormItem>
        <!-- 数据源编码 -->
        <FormItem :label="$t('dataSourceCode')" prop="dataSourceCode">
          <Input v-model.trim="submitData.dataSourceCode" :placeholder="$t('pleaseEnter') + $t('dataSourceCode')" />
        </FormItem>
        <!-- 数据源名称 -->
        <FormItem :label="$t('dataSourceName')" prop="dataSourceName">
          <Input v-model.trim="submitData.dataSourceName" :placeholder="$t('pleaseEnter') + $t('dataSourceName')" />
        </FormItem>
        <!-- 数据源描述 -->
        <FormItem :label="$t('dataSourceDesc')" prop="dataSourceDesc">
          <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model.trim="submitData.dataSourceDesc" :placeholder="$t('pleaseEnter') + $t('dataSourceDesc')" />
        </FormItem>
        <!-- 请求路径 -->
        <FormItem :label="$t('requestUrl')" prop="requestUrl">
          <Input v-model.trim="submitData.requestUrl" :placeholder="$t('pleaseEnter') + $t('requestUrl')" />
        </FormItem>
        <!-- 请求方式 -->
        <FormItem :label="$t('requestWay')" prop="requestWay">
          <Input v-model.trim="submitData.requestWay" :placeholder="$t('pleaseEnter') + $t('requestWay')" />
        </FormItem>
        <!-- 请求头 -->
        <FormItem :label="$t('requestHead')" prop="requestHead">
          <Input v-model.trim="submitData.requestHead" :placeholder="$t('pleaseEnter') + $t('requestHead')" />
        </FormItem>
        <!-- 请求体 -->
        <FormItem :label="$t('requestContent')" prop="requestContent">
          <Input v-model.trim="submitData.requestContent" :placeholder="$t('pleaseEnter') + $t('requestContent')" />
        </FormItem>

      </Form>
      <!-- 按钮 -->
      <div slot="footer">
        <Button size="mini" @click="cancelClick">取消</Button>
        <Button size="mini" @click="testClick" class="testBtn">测试</Button>
        <Button size="mini" @click="submitClick(true)">确定</Button>
      </div>
    </Modal>
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
                    <!-- 数据源编码 -->
                    <FormItem :label="$t('dataSourceCode')" prop="dataSourceCode">
                      <Input v-model="req.dataSourceCode" :placeholder="$t('pleaseEnter') + $t('dataSourceCode')" @on-search="searchClick" />
                    </FormItem>
                    <!-- 数据源名称 -->
                    <FormItem :label="$t('dataSourceName')" prop="dataSourceName">
                      <Input v-model="req.dataSourceName" :placeholder="$t('pleaseEnter') + $t('dataSourceName')" @on-search="searchClick" />
                    </FormItem>
                    <!-- 数据源类型 -->
                    <FormItem :label="$t('dataSourceType')" prop="dataSourceType">
                      <Select v-model="req.dataSourceType" clearable :placeholder="$t('pleaseSelect') + $t('status')" transfer>
                        <Option v-for="(item, i) in dataSourceTypeList" :value="item.detailName" :key="i">
                          {{ item.detailName }}
                        </Option>
                      </Select>
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
              <button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick" @on-delete-click="deleteClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick"></Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq } from "@/api/bill-manage/encap-op70";
import { getButtonBoolean, formatDate, renderIsEnabled } from "@/libs/tools";
import { getlistReq as getDataItemReq } from '@/api/system-manager/data-item'

export default {
  name: "datasource",
  data () {
    return {
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      drawerTitle: this.$t("add"),
      btnData: [],
      categoryList: [],// 类别下拉框
      selectObj: {},//表格选中
      dataSourceTypeList: [],
      submitData: {

      },
      drawerFlag: false,
      req: {
        dataSourceCode: "",
        dataSourceName: "",
        dataSourceType: "",
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [
        {
          type: "index", fixed: "left", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: this.$t("dataSourceCode"), key: "sourceCode", align: "center", tooltip: true },
        { title: this.$t("dataSourceName"), key: "sourceName", align: "center", tooltip: true, },
        { title: this.$t("dataSourceDesc"), key: "sourceDesc", align: "center", tooltip: true, },
        { title: this.$t("dataSourceType"), key: "sourceType", align: "center", tooltip: true, },
        { title: this.$t("enabled"), key: "enableFlag", align: "center", tooltip: true, render: renderIsEnabled, },
      ], // 表格数据
      // 验证实体
      ruleValidate: {
        dataSourceType: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("dataSourceType"),
            trigger: "change",
          },
        ],
      }
    };
  },
  activated () {
    this.pageLoad();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
    this.getDataItemData();
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
      this.data = [{
        "id": null,
        "createBy": null,
        "createTime": null,
        "updateBy": null,
        "updateTime": null,
        "version": null,
        "sourceCode": "mysql_ajreport",
        "sourceName": "mysql数据源",
        "sourceDesc": null,
        "sourceType": null,
        "sourceConfig": null,
        "enableFlag": 1,
        "deleteFlag": null
      }];
      this.tableConfig.loading = false;
      let { startTime, endTime, workOrder, panelNo, unitId, status } = this.req;
      if ((startTime && endTime) || workOrder || panelNo || unitId || status) {
        this.$refs.searchReq.validate((validate) => {
          if (validate) {
            this.tableConfig.loading = true;
            let obj = {
              orderField: "PN", // 排序字段
              ascending: true, // 是否升序
              pageSize: this.req.pageSize, // 分页大小
              pageIndex: this.req.pageIndex, // 当前页码
              data: {
                startTime: formatDate(startTime),
                endTime: formatDate(endTime),
                workOrder,
                panelNo,
                unitId,
                status,
              },
            };
            getpagelistReq(obj).then((res) => {
              this.tableConfig.loading = false;
              if (res.code === 200) {
                let { data, pageSize, pageIndex, total, totalPage } = res.result;
                this.data = data || [];
                this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
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
    // 点击新增按钮触发
    addClick () {
      this.drawerFlag = true;
      this.isAdd = true;
      this.drawerTitle = this.$t("add");
      this.submitData.parentId = this.req.id;
      this.submitData.category = this.req.treeCategory;
      this.$autoSelectContent(this, 'nameRef')
    },
    // 点击编辑按钮触发
    editClick () {
      if (this.selectObj) {
        let {

        } = this.selectObj;
        this.submitData = {
        };
        this.drawerFlag = true;
        this.isAdd = false;
        this.drawerTitle = this.$t("edit");
      } else this.$Msg.warning(this.$t("oneData"));
    },
    //提交 isClose = false
    submitClick () {
      //   this.$refs.submitReq.validate((validate) => {
      //     if (validate) {
      //       const href =
      //         this.submitData.component === "Main"
      //           ? `/${this.submitData.name}`
      //           : this.submitData.name;
      //       const apis = this.submitData.apis.join(",");
      //       let obj = { ...this.submitData, href, apis };
      //       // 添加上传文件参数并上传文件
      //       this.uploadFile()

      //   let request = this.isAdd ? addReq(obj) : modifyReq(obj);
      //   request.then((res) => {
      //     if (res.code === 200) {
      //       this.selectObj = null;
      //       this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
      //       this.getLeftMenu();
      //       if (isClose) {
      //         this.treeCancel();
      //         this.cancelClick();
      //       }
      //     } else
      //       this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
      //   });
      //     }
      //   });
    },
    cancelClick () {
      this.drawerFlag = false;
      this.$refs.submitReq.resetFields(); //清除表单红色提示
      this.submitData.id = "0";
      this.submitData.parentId = "0";
      this.apis = "";
      this.file = ''
    },
    //删除
    deleteClick () {

    },
    // 某一行高亮时触发
    currentClick (currentRow) {
      this.selectObj = currentRow;
    },
    // 获取数据字典数据
    getDataItemData () {
      const obj = { itemCode: 'EncapReport', enabled: 1 }
      getDataItemReq(obj).then((res) => {
        if (res.code === 200) {
          this.categoryList = res.result || [];
        }
      })
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
.testBtn {
  padding: 5px 16px;
  color: #fff;
  background: #e6a23c;
  border: 1px solid #e6a23c;
  border-radius: 0;
}
</style>