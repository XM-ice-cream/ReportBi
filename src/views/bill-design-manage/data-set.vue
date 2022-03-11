/* 数据集 */
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
            <i-col span="18" style="text-align: right;">
              <Dropdown size='small' @on-click='addClick'>
                <Button type="primary" custom-icon="iconfont icon-add">新增
                  <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu slot="list" size='small' style="text-align:left">
                  <DropdownItem name='sql'>SQL</DropdownItem>
                  <DropdownItem name='http'>HTTP</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <button-custom :btnData="btnData" @on-edit-click="editClick" @on-delete-click="deleteClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick" @on-select="selectClick">
          <template slot="operation" slot-scope="{ row }">
            <Button @click="dataview(row)" class="tableBtn">数据预览</Button>
          </template>
        </Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
    <!-- 数据预览 -->
    <data-view ref="DataView" :visib="dialogCaseResult" @handleClose="dialogCaseResult = false" />
    <!-- 新增编辑组件 -->
    <edit-view-set ref="EditDataSet" :dataSet="dataSet" :visib="dialogVisibleSetDataSet" @handleClose="dialogVisibleSetDataSet = false" @refreshList="pageLoad" />
  </div>
</template>

<script>
import { getpagelistReq } from "@/api/bill-design-manage/datasource.js";
import { getButtonBoolean, renderIsEnabled } from "@/libs/tools";
import dataView from './dataset/data-view.vue';
import EditViewSet from './dataset/edit-view-set.vue';

export default {
  components: { dataView, EditViewSet },
  name: "dataset",
  data () {
    return {
      searchPoptipModal: false,
      dialogCaseResult: false,
      dialogVisibleSetDataSet: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      categoryList: [],// 类别下拉框
      selectObj: null,//表格选中
      selectArr: [],//表格多选
      dataSetTypeList: [],
      dataSet: {},
      isAdd: true,//新增编辑
      submitData: {

      },
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
        { title: this.$t("dataSetCode"), key: "setCode", align: "center", tooltip: true },
        { title: this.$t("dataSetName"), key: "setName", align: "center", tooltip: true, },
        { title: this.$t("dataSetDesc"), key: "setDesc", align: "center", tooltip: true, },
        { title: this.$t("dataSourceCode"), key: "sourceCode", align: "center", tooltip: true, },
        { title: this.$t("dataSetType"), key: "setType", align: "center", tooltip: true, },
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
      console.log('获取分页列表数据');
      this.data = [];
      this.tableConfig.loading = true;
      let obj = {
        orderField: "PN", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {

        },
      };
      getpagelistReq(obj).then((res) => {
        res = {
          "code": 200,
          "message": "操作成功",
          "args": null,
          "result": {
            "data": [
              {
                "id": 72,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-08-27 13:48:33",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-08-27 13:48:33",
                "version": 1,
                "setCode": "compare_ajreport",
                "setName": "柱状对比图示例数据",
                "setDesc": "",
                "setType": "sql",
                "sourceCode": "mysql_ajreport",
                "dynSentence": "SELECT time,type,nums from aj_report_comparestack",
                "caseResult": "[{\"time\":\"2021-08-23\",\"type\":\"成功\",\"nums\":12},{\"time\":\"2021-08-23\",\"type\":\"失败\",\"nums\":1},{\"time\":\"2021-08-24\",\"type\":\"成功\",\"nums\":24},{\"time\":\"2021-08-24\",\"type\":\"失败\",\"nums\":5},{\"time\":\"2021-08-25\",\"type\":\"成功\",\"nums\":13},{\"time\":\"2021-08-25\",\"type\":\"失败\",\"nums\":8},{\"time\":\"2021-08-26\",\"type\":\"成功\",\"nums\":19},{\"time\":\"2021-08-26\",\"type\":\"失败\",\"nums\":3},{\"time\":\"2021-08-27\",\"type\":\"成功\",\"nums\":9},{\"time\":\"2021-08-27\",\"type\":\"失败\",\"nums\":15}]",
                "enableFlag": 1,
                "deleteFlag": 0,
                "dataSetParamDtoList": null,
                "dataSetTransformDtoList": null,
                "contextData": null,
                "setParamList": null,
                "fieldLabel": null,
                "accessKey": "bf7e108e0631a9353ca59794e3f82bf0"
              },
              {
                "id": 71,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-07-27 19:50:52",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-08-16 14:08:51",
                "version": 7,
                "setCode": "barstack_ajreport",
                "setName": "柱状堆叠数据",
                "setDesc": "",
                "setType": "sql",
                "sourceCode": "mysql_ajreport",
                "dynSentence": "select time,type,nums from aj_report_barstack",
                "caseResult": "[{\"time\":\"2021-07-27\",\"type\":\"A\",\"nums\":12},{\"time\":\"2021-07-27\",\"type\":\"B\",\"nums\":20},{\"time\":\"2021-07-27\",\"type\":\"C\",\"nums\":11},{\"time\":\"2021-07-26\",\"type\":\"A\",\"nums\":11},{\"time\":\"2021-07-26\",\"type\":\"B\",\"nums\":30},{\"time\":\"2021-07-25\",\"type\":\"B\",\"nums\":20},{\"time\":\"2021-07-25\",\"type\":\"C\",\"nums\":15}]",
                "enableFlag": 1,
                "deleteFlag": 0,
                "dataSetParamDtoList": null,
                "dataSetTransformDtoList": null,
                "contextData": null,
                "setParamList": null,
                "fieldLabel": null,
                "accessKey": "616029ab84c3d8da36f34a5b822040c6"
              },
              {
                "id": 70,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-07-14 16:17:14",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-07-15 10:35:21",
                "version": 2,
                "setCode": "per",
                "setName": "百分比",
                "setDesc": "",
                "setType": "sql",
                "sourceCode": "mysql_ajreport",
                "dynSentence": "select doub from aj_report_nums where id =2;",
                "caseResult": "[{\"doub\":55.33}]",
                "enableFlag": 1,
                "deleteFlag": 0,
                "dataSetParamDtoList": null,
                "dataSetTransformDtoList": null,
                "contextData": null,
                "setParamList": null,
                "fieldLabel": null,
                "accessKey": "1cf3c7125dd35ae693aa472a79377319"
              },
              {
                "id": 69,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-07-06 17:56:23",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-07-07 10:59:34",
                "version": 4,
                "setCode": "logis_table",
                "setName": "表格测试",
                "setDesc": "",
                "setType": "sql",
                "sourceCode": "mysql_ajreport",
                "dynSentence": "select date,address,name from aj_report_table;",
                "caseResult": "[{\"date\":\"2021-05-01\",\"address\":\"这是一条测试表格事件1\",\"name\":\"上汽安吉\"},{\"date\":\"2021-05-02\",\"address\":\"这是一条测试表格事件2\",\"name\":\"上汽大通\"},{\"date\":\"2021-05-03\",\"address\":\"这是一条测试表格事件3\",\"name\":\"上汽智行\"},{\"date\":\"2021-05-04\",\"address\":\"这是一条测试表格事件4\",\"name\":\"上汽国际\"},{\"date\":\"2021-05-05\",\"address\":\"这是一条测试表格事件5\",\"name\":\"上汽国内\"},{\"date\":\"2021-05-06\",\"address\":\"这是一条测试表格事件6\",\"name\":\"上汽运输\"},{\"date\":\"2021-05-07\",\"address\":\"这是一条测试表格事件7\",\"name\":\"上汽大众\"}]",
                "enableFlag": 1,
                "deleteFlag": 0,
                "dataSetParamDtoList": null,
                "dataSetTransformDtoList": null,
                "contextData": null,
                "setParamList": null,
                "fieldLabel": null,
                "accessKey": "c66842446f0095833c9d03a4749002a0"
              },
              {
                "id": 68,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-07-06 17:24:16",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-07-06 17:30:15",
                "version": 2,
                "setCode": "logis_3",
                "setName": "收发车情况",
                "setDesc": "",
                "setType": "sql",
                "sourceCode": "mysql_ajreport",
                "dynSentence": "select time,collect,start from aj_report_common3;",
                "caseResult": "[{\"start\":8,\"time\":\"1月\",\"collect\":10},{\"start\":12,\"time\":\"2月\",\"collect\":15},{\"start\":22,\"time\":\"3月\",\"collect\":20},{\"start\":28,\"time\":\"4月\",\"collect\":30},{\"start\":35,\"time\":\"5月\",\"collect\":28},{\"start\":38,\"time\":\"6月\",\"collect\":40},{\"start\":100,\"time\":\"7月\",\"collect\":80},{\"start\":120,\"time\":\"8月\",\"collect\":90},{\"start\":89,\"time\":\"9月\",\"collect\":65},{\"start\":50,\"time\":\"10月\",\"collect\":50},{\"start\":34,\"time\":\"11月\",\"collect\":35},{\"start\":23,\"time\":\"12月\",\"collect\":27}]",
                "enableFlag": 1,
                "deleteFlag": 0,
                "dataSetParamDtoList": null,
                "dataSetTransformDtoList": null,
                "contextData": null,
                "setParamList": null,
                "fieldLabel": null,
                "accessKey": "bf7db6cbf4aa7d064d8ead5ab9c641ac"
              },
              {
                "id": 67,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-07-06 16:51:27",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-07-06 16:51:27",
                "version": 1,
                "setCode": "logis_2",
                "setName": "收车量",
                "setDesc": "",
                "setType": "sql",
                "sourceCode": "mysql_ajreport",
                "dynSentence": "select name,nums from aj_report_common2 order by nums;",
                "caseResult": "[{\"name\":\"武汉\",\"nums\":20},{\"name\":\"河南\",\"nums\":50},{\"name\":\"西安\",\"nums\":70},{\"name\":\"北京\",\"nums\":100},{\"name\":\"上海\",\"nums\":200}]",
                "enableFlag": 1,
                "deleteFlag": 0,
                "dataSetParamDtoList": null,
                "dataSetTransformDtoList": null,
                "contextData": null,
                "setParamList": null,
                "fieldLabel": null,
                "accessKey": "898fbed3b59ccb7285981231e4862307"
              },
              {
                "id": 66,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-07-06 15:44:41",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-07-06 15:54:16",
                "version": 3,
                "setCode": "logis_1",
                "setName": "库存",
                "setDesc": "",
                "setType": "sql",
                "sourceCode": "mysql_ajreport",
                "dynSentence": "select name,nums from aj_report_common1 order by nums",
                "caseResult": "[{\"name\":\"上海\",\"nums\":500},{\"name\":\"北京\",\"nums\":600},{\"name\":\"西安\",\"nums\":1000},{\"name\":\"河南\",\"nums\":1200},{\"name\":\"武汉\",\"nums\":2000}]",
                "enableFlag": 1,
                "deleteFlag": 0,
                "dataSetParamDtoList": null,
                "dataSetTransformDtoList": null,
                "contextData": null,
                "setParamList": null,
                "fieldLabel": null,
                "accessKey": "34d01193f3348f302f205db4f39ae721"
              },
              {
                "id": 65,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-07-05 15:00:18",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-07-05 15:00:18",
                "version": 1,
                "setCode": "amount_1",
                "setName": "amount1",
                "setDesc": "",
                "setType": "sql",
                "sourceCode": "mysql_ajreport",
                "dynSentence": "SELECT sum(success)as nums from aj_report_wifiamount;",
                "caseResult": "[{\"nums\":1514}]",
                "enableFlag": 1,
                "deleteFlag": 0,
                "dataSetParamDtoList": null,
                "dataSetTransformDtoList": null,
                "contextData": null,
                "setParamList": null,
                "fieldLabel": null,
                "accessKey": "edb7b3558b27512d4c93d6b97651f2eb"
              },
              {
                "id": 62,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-06-30 15:16:37",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-07-01 16:06:00",
                "version": 2,
                "setCode": "acc_ajrt",
                "setName": "访问-系统RT",
                "setDesc": "",
                "setType": "sql",
                "sourceCode": "mysql_ajreport",
                "dynSentence": "SELECT datetime,rt from aj_report_exper ORDER BY datetime;",
                "caseResult": "[{\"datetime\":\"2021-06-18\",\"rt\":90.92},{\"datetime\":\"2021-06-19\",\"rt\":100.02},{\"datetime\":\"2021-06-20\",\"rt\":98.89},{\"datetime\":\"2021-06-21\",\"rt\":110.99},{\"datetime\":\"2021-06-22\",\"rt\":89.78}]",
                "enableFlag": 1,
                "deleteFlag": 0,
                "dataSetParamDtoList": null,
                "dataSetTransformDtoList": null,
                "contextData": null,
                "setParamList": null,
                "fieldLabel": null,
                "accessKey": "483667d92c6be545226a74df2bedc0fa"
              }
            ],
            "total": 27,
            "pageSize": 10,
            "pageIndex": 1,
            "totalPage": 3
          },

        }
        this.tableConfig.loading = false;
        if (res.code === 200) {
          console.log('123');
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.data = data || [];
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
        }
      }).catch(() => (this.tableConfig.loading = false));
      this.searchPoptipModal = false;
    },
    // 新增按钮
    addClick (type) {
      this.dialogVisibleSetDataSet = true;
      this.dataSet = {};
      this.isAdd = true;
      this.$refs.EditDataSet.addOrEditDataSet(this.dataSet, type, this.isAdd);
    },
    // 点击编辑按钮触发
    editClick () {
      if (this.selectObj) {
        this.dataSet = this.selectObj;
        const type = this.selectObj.setType;
        this.dialogVisibleSetDataSet = true;
        this.isAdd = false;
        // this.submitData = {
        //   ...this.selectObj
        // };
        this.$refs.EditDataSet.addOrEditDataSet(this.dataSet, type, this.isAdd);
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
    //数据预览
    dataview (data) {
      this.dialogCaseResult = true;
      this.$refs.DataView.dataViewPreview(
        data.setName,
        JSON.parse(data.caseResult)
      );
    },
    cancelClick () {
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
.tableBtn {
  padding: 0px 0.4rem;
  color: #252ab099;
  background: none;
  border: none;
  border-radius: 0.2rem;
}
</style>
<style>
.ivu-btn > .ivu-icon {
  font-size: 12px;
  line-height: 0.5;
}
</style>