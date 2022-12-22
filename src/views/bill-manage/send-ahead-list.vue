/* SendAheadList */
<template>
  <div class="page-style">
    <!-- 右侧抽屉 Form表单 -->
    <Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
      <Form ref="submitData" :model="submitData" :rules="ruleValidate" :label-width="120" :label-colon="true" @submit.native.prevent>
        <!-- 员工工号 -->
        <FormItem label="员工工号" prop="userID">
            <Input v-model="submitData.userID" :placeholder="$t('pleaseEnter') + '员工工号'" :disabled="!isAdd"/>
        </FormItem>
         <!-- 员工姓名 -->
         <FormItem label="员工姓名" prop="userName">
            <Input v-model="submitData.userName" :placeholder="$t('pleaseEnter') + '员工姓名'"/>
        </FormItem>
         <!-- 部门名称 -->
         <FormItem label="部门名称" prop="deptName">
            <Select v-model="submitData.deptName" clearable filterable :placeholder="$t('pleaseSelect') + '部门名称'" transfer>
              <Option v-for="(item, i) in deptList" :value="item.detailName" :key="i">
                {{ item.detailName }}
              </Option>
            </Select>
        </FormItem>
        <!-- Enabled-->
         <FormItem label="是否在职" prop="enabled">
            <i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
                <span slot="open">{{ $t("yes") }}</span>
                <span slot="close">{{ $t("no") }}</span>
            </i-switch>
        </FormItem>
         <!-- 备注 -->
         <FormItem :label="$t('remark')" prop="remark">
            <Input v-model="submitData.remark" :placeholder="$t('pleaseEnter') + $t('remark')"/>
        </FormItem>

        <!-- 按钮 -->
        <FormItem>
          <drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
        </FormItem>
      </Form>
    </Drawer>
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
                    <!-- 员工工号 -->
                    <FormItem label="员工工号" prop="userID">
                      <Input v-model="req.userID" :placeholder="$t('pleaseEnter') + '员工工号'"/>
                    </FormItem>
                     <!-- 员工姓名 -->
                    <FormItem label="员工姓名" prop="userName">
                      <Input v-model="req.userName" :placeholder="$t('pleaseEnter') + '员工姓名'"/>
                    </FormItem>
                    <!-- 部门名称 -->
                    <FormItem label="部门名称" prop="deptName">
                      <Select v-model="req.deptName" clearable filterable :placeholder="$t('pleaseSelect') + '部门名称'" transfer>
                        <Option v-for="(item, i) in deptList" :value="item.detailName" :key="i">
                          {{ item.detailName }}
                        </Option>
                      </Select>
                    </FormItem>
                    <!-- 是否在职 -->
                    <FormItem label="是否在职" prop="enabled">
                      <Select v-model="req.enabled" transfer filterable clearable :placeholder="$t('pleaseSelect') + '是否在职'">
                        <Option value=1>是</Option>
                        <Option value=0>否</Option>
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
              <button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick" @on-import-click="importClick" @on-export-click="exportClick"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"  @on-current-change="currentClick"></Table>
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
    <!-- 批量导入 -->
    <Modal
        v-model="modalFlag"
        title="批量导入"
        @on-cancel="cancelClick">
       <upload-custom class="upload-con" :uploadUrl="uploadUrl" :uploadHeight="33" uploadIcon="ios-cloud-upload-outline" :uploadFormat="['xlsx']" @upload-success="uploadSuccess">
          <div slot="button">
            <Button type="success">{{ $t("clickUpload") }}</Button>
          </div>
        </upload-custom>
    </Modal>
  </div>
</template>

<script>
import { getpagelistReq ,addReq,modifyReq,uploadUrl, exportReq } from "@/api/bill-manage/db-user";
import {  getButtonBoolean,formatDate, renderDate,renderIsEnabled,exportFile } from "@/libs/tools";
import { getlistReq as getDataItemReq } from '@/api/system-manager/data-item'
import { errorType } from "@/libs/tools";
import UploadCustom from "@/components/upload-custom";

export default {
  name: "db-user",
  components: { UploadCustom },
  data () {
    return {
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      uploadUrl:uploadUrl(),
      modalFlag:false,//批量上传
      drawerFlag:false,
      drawerTitle:"新增",
      isAdd:false,
      selectObj:null,// 表格选中数据
      data: [], // 表格数据
      btnData: [],
      deptList: [],// 部门下拉框
      req: {
        startTime: "",
        endTime: "",
        userID: "", 
        userName:"",
        deptName: "",
        enabled: "",
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [
        {
          type: "index", fixed: "left", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: "员工工号", key: "userID", align: "center", minWidth: 140, tooltip: true },
        { title: "员工姓名", key: "userName", align: "center", minWidth: 140, tooltip: true },
        { title: "部门名称", key: "deptName", align: "center", minWidth: 140, tooltip: true },
        { title: "是否在职", key: "enabled", align: "center", tooltip: true, render: renderIsEnabled, width: 80 },
        { title: "备注", key: "remark", align: "center", minWidth: 200, tooltip: true },
        { title: "创建人", key: "createUserName", align: "center", minWidth: 120, tooltip: true },
        { title: "创建时间", key: "createDate", align: "center", render: renderDate, minWidth: 120, tooltip: true },
        { title: "修改人", key: "modifyUserName", align: "center", minWidth: 120, tooltip: true },
        { title: "修改时间", key: "modifyDate", align: "center", render: renderDate, minWidth: 120, tooltip: true },
      ], // 表格数据
      submitData:{
        userID: "",
        userName: "",
        deptName: "",
        remark: "",
        enabled: 1,
        id: ""  
      },
      ruleValidate: {
        userID: [
          { required: true, message: "员工工号必填", trigger: "blur" },{ validator: this.checkUserID, trigger: 'blur' }
        ],
        userName:[
             { required: true, message: "员工姓名必填", trigger: "blur" },
        ]
      }
    };
  },
  activated () {
    this.pageLoad();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
    this.getDataItemData();
    this.tableConfig.loading = false;
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 点击搜索按钮触发
    searchClick () {
      this.selectObj = null;
      this.req.pageIndex = 1;     
      this.pageLoad();
    },
    // 获取分页列表数据
    pageLoad () {
        this.data = [];
        this.tableConfig.loading = false;
        const { startTime, endTime,userID,userName, deptName, enabled} = this.req;
        this.$refs.searchReq.validate((validate) => {
            if (validate) {
            this.tableConfig.loading = true;
            let obj = {
                orderField: "CREATEDATE", // 排序字段
                ascending: false, // 是否升序
                pageSize: this.req.pageSize, // 分页大小
                pageIndex: this.req.pageIndex, // 当前页码
                data: {
                    startTime: formatDate(startTime),
                    endTime: formatDate(endTime),
                    userID,
                    userName,
                    deptName,
                    enabled
                },
            };
            getpagelistReq(obj).then((res) => {
                this.tableConfig.loading = false;
                if (res.code === 200) {
                    let { data, pageSize, pageIndex, total, totalPage } = res.result;
                    this.data = data || [];
                    this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
                }
            })
                .catch(() => (this.tableConfig.loading = false));
            this.searchPoptipModal = false;
            }
        });
    },
    // 导出
    exportClick () {
      let { startTime, endTime,userID,userName, deptName, enabled } = this.req;
      let obj = {
        startTime: formatDate(startTime),
        endTime: formatDate(endTime),
        userID,
        userName,
        deptName,
        enabled
      };
      exportReq(obj).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = `员工信息${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    // 获取业务数据
    async getDataItemData () {
      this.deptList = await this.getDataItemDetailList("DBUserDept");
    },
    // 获取数据字典数据
    async getDataItemDetailList (itemCode) {
      let arr = [];
      await getDataItemReq({ itemCode, enabled: 1 }).then((res) => {
        if (res.code === 200) {
          arr = res.result || [];
        }
      });
      return arr;
    },
    //提交
    submitClick (isClose = false) {      
      this.$refs.submitData.validate((validate) => {
        if (validate) {
          const { userID,userName, deptName, remark, enabled, id } = this.submitData;
          const obj = {
            userID,userName, deptName, remark, enabled, id
          }
          const requestApi = this.isAdd?addReq:modifyReq;
          requestApi(obj).then((res) => {
            if (res.code === 200) {
              this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
              this.pageLoad();
              if (isClose) this.cancelClick();
            } else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
          });
        }
      });
    },
     checkUserID(rule, value, callback) {
        if (value) {
          if (/[\u4E00-\u9FA5]/g.test(value)) {
            this.submitData.userID = value.replace(/[^a-zA-Z0-9_]/g,'');
            callback(new Error('不能输入中文!'))
          } else {
            callback()
          }
        }
        callback()
    },
     // 点击新增按钮触发
    addClick () {
      this.isAdd = true;
      this.drawerFlag = true;
      this.drawerTitle = this.$t("add");
      
    },
     // 点击编辑按钮触发
    editClick () {
      if (this.selectObj) {
        let {
            userID,userName, deptName, remark, enabled, id
        } = this.selectObj;
        this.submitData = {
            userID,userName, deptName, remark, enabled, id
        };
        this.isAdd = false;
        this.drawerFlag = true;
        this.drawerTitle = this.$t("edit");
      } else this.$Msg.warning(this.$t("oneData"));
    },
     // 右侧弹窗打开
     importClick () {
      this.modalFlag= true;
    },
    uploadSuccess () {
      this.searchClick ();//刷新
      this.$Message.success(`${this.$t("import")}${this.$t("success")}`);
      //关闭弹框
      this.modalFlag = false;
    },
    // 某一行高亮时触发
    currentClick (currentRow) {
      this.selectObj = currentRow;
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
    },
     // 左侧抽屉取消
    cancelClick () {
      this.drawerFlag = false;
      this.modalFlag = false;
      this.$refs.submitData.resetFields();
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
