/* 报表管理 */
<template>
  <div class="page-style">
    <!-- 左侧抽屉 -->
    <Modal v-model="drawerFlag" :title="drawerTitle" width="1000" :mask-closable="false" :closable="true" :before-close="cancelClick">
      <Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="100" :label-colon="true">
        <Row :gutter="10">
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <!-- 报表名称 -->
          <FormItem :label="$t('reportName')" prop="reportName">
            <Input v-model.trim="submitData.reportName" :placeholder="$t('pleaseEnter') + $t('reportName')" cleabler/>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <!-- 报表编码 -->
          <FormItem :label="$t('reportCode')" prop="reportCode">
            <Input v-model.trim="submitData.reportCode" :placeholder="$t('pleaseEnter') + $t('reportCode')" v-if="this.isAdd" cleabler/>
            <span v-else>{{ submitData.reportCode }}</span>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <!-- 报表类型 -->
            <FormItem :label="$t('reportType')" prop="reportType">
                <Select v-model="submitData.reportType" clearable :placeholder="$t('pleaseSelect') + $t('status')" cleabler transfer v-if="this.isAdd">
                <Option v-for="(item, i) in reportTypeList" :value="item.detailValue" :key="i">
                    {{ item.detailName }}
                </Option>
                </Select>
                <span v-else>{{ submitData.reportType }}</span>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <!-- 报表分类 -->
            <FormItem label="报表分类" prop="remark">
                <Select v-model="submitData.remark" clearable :placeholder="$t('pleaseSelect') +'报表分类'" transfer cleabler>
                    <Option v-for="(item, i) in remarkList" :value="item.detailName" :key="i">
                        {{ item.detailName }}
                    </Option>
                </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <!-- 描述 -->
            <FormItem :label="$t('reportDesc')" prop="reportDesc">
                <Input v-model.trim="submitData.reportDesc" :placeholder="$t('pleaseEnter') + $t('reportDesc')" cleabler/>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <!-- 状态 -->
          <FormItem :label="$t('enabled')" prop="enabled">
            <i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
              <span slot="open">有效</span>
              <span slot="close">失效</span>
            </i-switch>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <!-- 按钮 -->
      <div slot="footer">
        <Button size="small" @click="cancelClick">取消</Button>
        <Button size="small" @click="submitClick">确定</Button>
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
                    <!-- 报表类型 -->
                    <FormItem :label="$t('reportType')" prop="reportType">
                      <Select v-model="req.reportType" clearable :placeholder="$t('pleaseSelect') + $t('reportType')" transfer cleabler>
                        <Option v-for="(item, i) in reportTypeList" :value="item.detailValue" :key="i">
                          {{ item.detailName }}
                        </Option>
                      </Select>
                    </FormItem>
                    <!-- 报表名称 -->
                    <FormItem :label="$t('reportName')" prop="reportName">
                      <Input v-model="req.reportName" :placeholder="$t('pleaseEnter') + $t('reportName')" @on-search="searchClick" cleabler/>
                    </FormItem>
                    <!-- 报表编码 -->
                    <FormItem :label="$t('reportCode')" prop="reportCode">
                      <Input v-model="req.reportCode" :placeholder="$t('pleaseEnter') + $t('reportCode')" @on-search="searchClick" cleabler/>
                    </FormItem>
                    <!-- 报表分类 -->
                    <FormItem label="报表分类" prop="remark">
                        <Select v-model="req.remark" clearable :placeholder="$t('pleaseSelect') +'报表分类'" transfer cleabler>
                            <Option v-for="(item, i) in remarkList" :value="item.detailName" :key="i">
                                {{ item.detailName }}
                            </Option>
                        </Select>
                    </FormItem>
                    <!-- 制作人 -->
                    <FormItem :label="$t('reportAuthor')" prop="reportAuthor">
                      <Input v-model="req.reportAuthor" :placeholder="$t('pleaseEnter') + $t('reportAuthor')" @on-search="searchClick" cleabler/>
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
        <Table :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick" @on-selection-change="selectClick">
          <template slot-scope="{ row }" slot="reportType">
            <Tag v-if="row.reportType === 'excel'" color="blue">Excel报表</Tag>
            <Tag v-else-if="row.reportType === 'largescreen'" color="green">大屏报表</Tag>
          </template>
          <template slot='operator' slot-scope="{row}">
            <Button class="tableBtn" type="text" @click="design(row)">设计</Button>&nbsp;
            <Button class="tableBtn" type="text" @click="preview(row)">预览</Button>
          </template>
        </Table>
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
    <!-- Excel 的设计与预览 -->
    <!-- <excelreport-design :visib.sync="excelVisib" :reportCode="selectObj.reportCode" />
    <excelreport-preview :visib.sync="previewVisib" :reportCode="selectObj.reportCode" /> -->

    <!-- 大屏的设计与预览 -->
    <!-- <screenreport-design :visib.sync="screenVisib" :reportCode="selectObj.reportCode" /> -->
    <!-- <screenreport-preview :visib.sync="previewScreenVisib" :reportCode="selectObj.reportCode" /> -->
  </div>
</template>

<script>
import {
  getpagelistReq,
  insertReportReq,
  deleteReportReq,
  modifyReportReq
} from "@/api/bill-design-manage/report-manage.js";
import { getButtonBoolean, renderIsEnabled } from "@/libs/tools";
import excelreportDesign from './report-manage/excelreport-design.vue';
import ExcelreportPreview from './report-manage/excelreport-preview.vue';
import ScreenreportDesign from './report-manage/screenreport-design.vue';
import ScreenreportPreview from './report-manage/screenreport-preview.vue';
import { getlistReq as getDataItemReq } from '@/api/system-manager/data-item'

export default {
  components: { excelreportDesign, ExcelreportPreview, ScreenreportDesign, ScreenreportPreview },
  name: "design-report-manage",
  data () {
    return {
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      remarkList:[],//报表类型下拉
      drawerTitle: this.$t("add"),
      btnData: [],
      isAdd: true,
      selectObj: {},//表格选中
      selectArr: [],//表格多选
      reportTypeList: [{ detailValue: 'excel', detailName: 'Excel报表' }, { detailValue: 'largescreen', detailName: '大屏报表' }],
      submitData: {
        enabled: 1,
        remark: "",
        reportCode: "",
        reportDesc: "",
        reportType: "",
        reportAuthor: "",
        reportName: "",
        remark:"",//报表类型
      },
      drawerFlag: false,
      req: {
        reportType: "",
        reportName: "",
        reportCode: "",
        reportAuthor: "",
        reportDesc: "",
        setCode:"",
        remark:"",//报表类型
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
        { title: this.$t("reportName"), key: "reportName", align: "center", tooltip: true, },
        { title: this.$t("reportCode"), key: "reportCode", align: "center", tooltip: true, },
        { title: this.$t("reportType"), key: "reportType", align: "center", slot: "reportType", width: 120 },
        { title: this.$t("reportAuthor"), key: "reportAuthor", align: "center", tooltip: true },
        { title:"报表分类",key:"remark",align:"center",tooltip:true},
        { title: this.$t("dataSetDesc"), key: "reportDesc", align: "center", tooltip: true, },
        { title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled, width: 80 },
        { title: this.$t("operator"), slot: "operator", align: "center", width: '100' },
      ], // 表格数据
      // 验证实体
      ruleValidate: {
        reportCode: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("reportCode"),
            trigger: "change",
          },
        ], reportType: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("reportType"),
          },
        ], reportName: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("reportName"),
          },
        ],
      },
      excelVisib: false,
      previewVisib: false,
      screenVisib: false,
      previewScreenVisib: false,
    };
  },
  activated () {
    if(this.$route.query.setCode){
        this.req.setCode = this.$route.query.setCode;
    }
    this.pageLoad();
    this.getDataItemData();
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
      this.req.setCode = "";
      this.pageLoad();
    },
    // 获取分页列表数据
    pageLoad () {
      this.data = [];
      this.tableConfig.loading = true;
      const { reportType, reportName, reportAuthor, reportCode,setCode,remark } = this.req
      let obj = {
        orderField: "reportType", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          reportType, reportName, reportAuthor, reportCode,setCode,remark
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
    // 点击新增按钮触发
    addClick () {
      this.drawerFlag = true;
      this.isAdd = true;
      this.drawerTitle = this.$t("add");
    },
    // 点击编辑按钮触发
    editClick () {
      if (this.selectObj) {
        let { reportType, sourceConnect, reportCode, reportName, reportAuthor, reportDesc, enabled ,remark} = this.selectObj;
        this.submitData = { reportType, sourceConnect, reportCode, reportName, reportAuthor, reportDesc, enabled,remark };
        this.drawerFlag = true;
        this.isAdd = false;
        this.drawerTitle = this.$t("edit");
      } else this.$Msg.warning(this.$t("oneData"));
    },
    //提交
    submitClick () {
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          let obj = { ...this.submitData };
          let request = this.isAdd ? insertReportReq(obj) : modifyReportReq(obj);
          request.then((res) => {
            if (res.code === 200) {
              this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
              this.pageLoad();//刷新表格
              this.cancelClick();
            } else
              this.$Msg.error(`${this.drawerTitle}${this.$t("fail")}` + '报表编码不可重复!');
          });
        }
      });
    },
    cancelClick () {
      this.drawerFlag = false;
      this.$refs.submitReq.resetFields(); //清除表单红色提示
    },
    //删除
    deleteClick () {
      const deleteData = this.selectArr.length > 0 ? this.selectArr : (this.selectObj ? [{ ...this.selectObj }] : []);
      if (deleteData.length == 0) {
        this.$Message.error('无选中删除数据');
        return;
      }
      this.$Modal.confirm({
        title: "确认要删除该数据吗?",
        onOk: () => {
          const deleteArr = deleteData.map(o => o.reportCode);
          deleteReportReq(deleteArr).then(res => {
            if (res.code === 200) {
              this.$Message.success("删除成功");
              this.pageLoad();
            }
          })

        },
        //   onCancel: () => this.clearGraphData(),
      });

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
    //设计
    design (data) {
      this.selectObj = { ...data };
     const { reportCode,reportName } = data;
      const href = this.skipUrl(data.reportType + 'Design', reportCode,reportName);
      window.open(href, '_blank');
    },
    // 预览
    preview (data) {
      this.selectObj = { ...data };
      const { reportCode,reportName } = data;
      const href = this.skipUrl(data.reportType + 'Preview', reportCode,reportName);
      window.open(href, '_blank');
    },
     // 获取业务数据
    async getDataItemData () {
      this.remarkList = await this.getDataItemDetailList("reportDesignType"); // 获取站点数据
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
    skipUrl (key, reportCode,reportName) {
      const obj = {
        excelPreview: '/bill-design-manage/excelreport-preview',
        largescreenPreview: '/bill-design-manage/screenreport-preview',
        excelDesign: '/bill-design-manage/excelreport-design',
        largescreenDesign: '/bill-design-manage/screenreport-design'
      }
      const { href } = this.$router.resolve({
        path: obj[key],
        query: { reportCode ,reportName}
      });
      return href;
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

<style scoped lang='less'>
.tableBtn {
  padding: 0 0.2rem;
  color: #1890ff;
}
</style>
