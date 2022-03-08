/* 数据集 */
<template>
  <div class="page-style">
    <!-- 左侧抽屉 -->
    <!-- <Modal v-model="modal2" width="360"> -->
    <Modal v-model="drawerFlag" :title="drawerTitle" width="1000" :mask-closable="false" :closable="false">
      <Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="100" :label-colon="true">
        <!-- 数据集类型 -->
        <FormItem :label="$t('dataSetType')" prop="SetType" inline>
          <Select v-model="submitData.SetType" clearable :placeholder="$t('pleaseSelect') + $t('status')" transfer>
            <Option v-for="(item, i) in dataSetTypeList" :value="item.detailName" :key="i">
              {{ item.detailName }}
            </Option>
          </Select>
        </FormItem>
        <!-- 数据集编码 -->
        <FormItem :label="$t('dataSetCode')" prop="SetCode" inline>
          <Input v-model.trim="submitData.SetCode" :placeholder="$t('pleaseEnter') + $t('dataSetCode')" />
        </FormItem>
        <!-- 数据集名称 -->
        <FormItem :label="$t('dataSetName')" prop="SetName" inline>
          <Input v-model.trim="submitData.SetName" :placeholder="$t('pleaseEnter') + $t('dataSetName')" />
        </FormItem>
        <!-- 数据集描述 -->
        <FormItem :label="$t('dataSetDesc')" prop="dataSetDesc">
          <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model.trim="submitData.dataSetDesc" :placeholder="$t('pleaseEnter') + $t('dataSetDesc')" />
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
                    <!-- 数据集编码 -->
                    <FormItem :label="$t('dataSetCode')" prop="dataSetCode">
                      <Input v-model="req.dataSetCode" :placeholder="$t('pleaseEnter') + $t('dataSetCode')" @on-search="searchClick" />
                    </FormItem>
                    <!-- 数据集名称 -->
                    <FormItem :label="$t('dataSetName')" prop="dataSetName">
                      <Input v-model="req.dataSetName" :placeholder="$t('pleaseEnter') + $t('dataSetName')" @on-search="searchClick" />
                    </FormItem>
                    <!-- 数据源 -->
                    <FormItem :label="$t('dataSource')" prop="dataSource">
                      <Select v-model="req.dataSetType" clearable :placeholder="$t('pleaseSelect') + $t('status')" transfer>
                        <Option v-for="(item, i) in dataSetTypeList" :value="item.detailName" :key="i">
                          {{ item.detailName }}
                        </Option>
                      </Select>
                    </FormItem>
                    <!-- 数据集类型 -->
                    <FormItem :label="$t('dataSetType')" prop="dataSetType">
                      <Select v-model="req.dataSetType" clearable :placeholder="$t('pleaseSelect') + $t('status')" transfer>
                        <Option v-for="(item, i) in dataSetTypeList" :value="item.detailName" :key="i">
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
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick" @on-select="selectClick">
          <template slot="operation">
            <p>数据预览</p>
          </template>
        </Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq } from "@/api/bill-manage/encap-op70";
import { getButtonBoolean, formatDate, renderIsEnabled } from "@/libs/tools";

export default {
  name: "dataset",
  data () {
    return {
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      drawerTitle: this.$t("add"),
      btnData: [],
      categoryList: [],// 类别下拉框
      selectObj: null,//表格选中
      selectArr: [],//表格多选
      dataSetTypeList: [],
      submitData: {

      },
      drawerFlag: false,
      req: {
        dataSetCode: "",
        dataSetName: "",
        dataSetType: "",
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          type: "index", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: this.$t("dataSetCode"), key: "SetCode", align: "center", tooltip: true },
        { title: this.$t("dataSetName"), key: "SetName", align: "center", tooltip: true, },
        { title: this.$t("dataSetDesc"), key: "SetDesc", align: "center", tooltip: true, },
        { title: this.$t("dataSetType"), key: "SetType", align: "center", tooltip: true, },
        { title: this.$t("enabled"), key: "enableFlag", align: "center", tooltip: true, render: renderIsEnabled, },
        { title: '操作', slot: "operation", align: "center", width: '80' },
      ], // 表格数据
      // 验证实体
      ruleValidate: {
        dataSetType: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("dataSetType"),
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
      this.data = [
        {
          "id": null,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "SetCode": "mysql_ajreport",
          "SetName": "mysql数据集",
          "SetDesc": null,
          "SetType": null,
          "SetConfig": null,
          "enableFlag": 1,
          "deleteFlag": null
        }, {
          "id": null,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "SetCode": "mysql_ajreport",
          "SetName": "mysql数据集",
          "SetDesc": null,
          "SetType": null,
          "SetConfig": null,
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
    },
    // 点击编辑按钮触发
    editClick () {
      console.log(this.selectObj);
      if (this.selectObj) {
        // let {

        // } = this.selectObj;
        this.submitData = {
          ...this.selectObj
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
    },
    //删除
    deleteClick () {
      this.$Modal.confirm({
        title: "确认要删除该数据吗?",
        onOk: () => {
          console.log(this.selectArr);
        },
        //   onCancel: () => this.clearGraphData(),
      });

    },
    //测试连接
    testClick () {

    },

    // 某一行高亮时触发
    currentClick (currentRow) {
      this.selectObj = currentRow;
    },
    //删除选择的数据
    selectClick (selection) {
      this.selectArr = selection;
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