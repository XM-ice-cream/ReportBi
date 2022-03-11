/* 数据源 */
<template>
  <div class="page-style">
    <!-- 左侧抽屉 -->
    <Modal v-model="drawerFlag" :title="drawerTitle" width="1000" :mask-closable="false" :closable="false">
      <Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="100" :label-colon="true">
        <Row :gutter="10">
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <!-- 报表名称 -->
          <FormItem :label="$t('reportName')" prop="reportName">
            <Input v-model.trim="submitData.reportName" :placeholder="$t('pleaseEnter') + $t('reportName')" />
          </FormItem>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <!-- 报表编码 -->
          <FormItem :label="$t('reportCode')" prop="reportCode">
            <Input v-model.trim="submitData.reportCode" :placeholder="$t('pleaseEnter') + $t('reportCode')" v-if="this.isAdd" />
            <span v-else>{{submitData.reportCode}}</span>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <!-- 报表类型 -->
          <FormItem :label="$t('reportType')" prop="reportType">
            <Select v-model="submitData.reportType" clearable :placeholder="$t('pleaseSelect') + $t('status')" transfer v-if="this.isAdd">
              <Option v-for="(item, i) in reportTypeList" :value="item.detailName" :key="i">
                {{ item.detailName }}
              </Option>
            </Select>
            <span v-else>{{submitData.reportType}} 123</span>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <!-- 制作人 -->
          <FormItem :label="$t('reportAuthor')" prop="reportAuthor">
            <Input v-model.trim="submitData.reportAuthor" :placeholder="$t('pleaseEnter') + $t('reportAuthor')" />
          </FormItem>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <!-- 描述 -->
          <FormItem :label="$t('reportDesc')" prop="reportDesc">
            <Input v-model.trim="submitData.reportDesc" :placeholder="$t('pleaseEnter') + $t('reportDesc')" />
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
          <!-- 报表缩略图 -->
          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <FormItem label="报表缩略图" prop='img'>
            <upload-img @fileUpload="fileUpload" :uploadFormat="['png', 'jpg']" ref="uploadImg" />
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
                      <Select v-model="req.reportType" clearable :placeholder="$t('pleaseSelect') + $t('reportType')" transfer>
                        <Option v-for="(item, i) in reportTypeList" :value="item.detailCode" :key="i">
                          {{ item.detailName }}
                        </Option>
                      </Select>
                    </FormItem>
                    <!-- 报表名称 -->
                    <FormItem :label="$t('reportName')" prop="reportName">
                      <Input v-model="req.reportName" :placeholder="$t('pleaseEnter') + $t('reportName')" @on-search="searchClick" />
                    </FormItem>
                    <!-- 报表编码 -->
                    <FormItem :label="$t('reportCode')" prop="reportCode">
                      <Input v-model="req.reportCode" :placeholder="$t('pleaseEnter') + $t('reportCode')" @on-search="searchClick" />
                    </FormItem>
                    <!-- 制作人 -->
                    <FormItem :label="$t('reportAuthor')" prop="reportAuthor">
                      <Input v-model="req.reportAuthor" :placeholder="$t('pleaseEnter') + $t('reportAuthor')" @on-search="searchClick" />
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
          <template slot='operator'>
            <Button type="primary" class="tableBtn">设计</Button>&nbsp;
            <Button type="primary" class="tableBtn">分享</Button>
          </template>
        </Table>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq, insertDataSourceReq, deleteDataSourceReq, modifyDataSourceReq } from "@/api/bill-design-manage/datasource.js";
import { getlistReq } from "@/api/system-manager/data-item";
import uploadImg from '../../components/upload-img/upload-img.vue';//showFileUrl
import { getButtonBoolean, errorType, renderIsEnabled, getUploadImageUrl, compress, base64ToFile } from "@/libs/tools";
export default {
  components: { uploadImg },
  name: "report-manage",
  data () {
    return {
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      drawerTitle: this.$t("add"),
      btnData: [],
      isAdd: true,
      selectObj: null,//表格选中
      selectArr: [],//表格多选
      reportTypeList: [],
      submitData: {
        reportType: "",
        reportName: "",
        reportCode: "",
        reportAuthor: "",
      },
      drawerFlag: false,
      req: {
        reportType: "",
        reportName: "",
        reportCode: "",
        reportAuthor: "",
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
        { title: this.$t("reportType"), key: "reportType", align: "center", tooltip: true },
        { title: this.$t("reportAuthor"), key: "reportAuthor", align: "center", tooltip: true, },
        { title: this.$t("dataSetDesc"), key: "reportDesc", align: "center", tooltip: true, },
        { title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled, },
        { title: this.$t("operator"), slot: "operator", align: "center", width: '100' },
      ], // 表格数据
      // 验证实体
      ruleValidate: {
        reportAuthor: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("reportAuthor"),
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
      }
    };
  },
  activated () {
    this.pageLoad();
    this.showImage();
    this.autoSize();
    this.getDataItemData();
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
      this.data = [];
      this.tableConfig.loading = true;
      const { reportType, reportName, reportAuthor } = this.req
      let obj = {
        orderField: "reportType", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          reportType, reportName, reportAuthor
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
                "id": 194,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2022-03-09 16:12:46",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2022-03-09 16:12:46",
                "version": 1,
                "reportName": "wdsas",
                "reportCode": "asd",
                "setCodes": null,
                "reportGroup": "default",
                "reportDesc": "Ad",
                "setParam": null,
                "jsonStr": null,
                "reportType": "report_excel",
                "total": 0,
                "reportImage": null,
                "enabled": 1,
                "deleteFlag": 0,
                "reportAuthor": "ADS",
                "downloadCount": null,
                "accessKey": "00390b51db0c7a966425e5142c8e6377"
              },
              {
                "id": 193,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2022-03-07 19:33:00",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2022-03-07 19:33:00",
                "version": 2,
                "reportName": "物流大屏1",
                "reportCode": "logistics_one",
                "setCodes": null,
                "reportGroup": null,
                "reportDesc": "",
                "setParam": null,
                "jsonStr": null,
                "reportType": "report_screen",
                "total": 0,
                "reportImage": "",
                "enabled": 1,
                "deleteFlag": 0,
                "reportAuthor": null,
                "downloadCount": null,
                "accessKey": "6f8e8618bb86ff9fef43b4a8e1e67ce3"
              },
              {
                "id": 190,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-06-30 16:34:40",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-07-01 15:19:56",
                "version": 3,
                "reportName": "空白大屏",
                "reportCode": "blank",
                "setCodes": null,
                "reportGroup": null,
                "reportDesc": "",
                "setParam": null,
                "jsonStr": null,
                "reportType": "report_screen",
                "total": 0,
                "reportImage": "",
                "enabled": 1,
                "deleteFlag": 0,
                "reportAuthor": null,
                "downloadCount": null,
                "accessKey": "8497cab7a819dc337088a1f764d7dc80"
              },
              {
                "id": 189,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-06-30 15:19:59",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-06-30 15:19:59",
                "version": 1,
                "reportName": "访问大屏",
                "reportCode": "acc_ajreport",
                "setCodes": null,
                "reportGroup": null,
                "reportDesc": "",
                "setParam": null,
                "jsonStr": null,
                "reportType": "report_screen",
                "total": 0,
                "reportImage": null,
                "enabled": 1,
                "deleteFlag": 0,
                "reportAuthor": null,
                "downloadCount": null,
                "accessKey": "80300fbfe774fe712c60c80f946617be"
              },
              {
                "id": 188,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-06-30 14:32:53",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-06-30 14:32:53",
                "version": 1,
                "reportName": "汽车生产销售大屏",
                "reportCode": "car_ajreport",
                "setCodes": null,
                "reportGroup": null,
                "reportDesc": "",
                "setParam": null,
                "jsonStr": null,
                "reportType": "report_screen",
                "total": 0,
                "reportImage": null,
                "enabled": 1,
                "deleteFlag": 0,
                "reportAuthor": null,
                "downloadCount": null,
                "accessKey": "a853e134a82aff14e66887c0abba3831"
              },
              {
                "id": 187,
                "createBy": "admin",
                "createByView": null,
                "createTime": "2021-06-30 10:06:31",
                "updateBy": "admin",
                "updateByView": null,
                "updateTime": "2021-06-30 10:06:31",
                "version": 1,
                "reportName": "日志大屏",
                "reportCode": "log_ajreport",
                "setCodes": null,
                "reportGroup": null,
                "reportDesc": "",
                "setParam": null,
                "jsonStr": null,
                "reportType": "report_screen",
                "total": 0,
                "reportImage": null,
                "enabled": 1,
                "deleteFlag": 0,
                "reportAuthor": null,
                "downloadCount": null,
                "accessKey": "4903f2fc0e1981d72cd0c448636ac10b"
              }
            ],
            "total": 6,
            "pageSize": 10,
            "pageIndex": 1,
            "totalPage": 1
          }
        }
        this.tableConfig.loading = false;
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.data = data || [];
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
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
        let { reportType, sourceConnect, reportCode, reportName, reportAuthor } = this.selectObj;
        this.submitData = { reportType, sourceConnect, reportCode, reportName, reportAuthor };
        this.drawerFlag = true;
        this.isAdd = false;
        this.drawerTitle = this.$t("edit");
      } else this.$Msg.warning(this.$t("oneData"));
    },
    //提交
    submitClick () {
      console.log('submitClick');
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          let obj = { ...this.submitData };
          let request = this.isAdd ? insertDataSourceReq(obj) : modifyDataSourceReq(obj);
          request.then((res) => {
            if (res.code === 200) {
              this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
              this.pageLoad();//刷新表格
              this.cancelClick();
            } else
              this.$Msg.error(`${this.drawerTitle}${this.$t("fail")}`);
          });
        }
      });
    },
    cancelClick () {
      this.drawerFlag = false;
      this.$refs.submitReq.resetFields(); //清除表单红色提示
    },
    showImage () {
      //   let pictures = this.selectObj.pictures.split(',')
      //   pictures.forEach((item) => {
      //     this.$refs.uploadImg.uploadList.push({ name: item, url: showFileUrl(item) })
      //   })
      this.$refs.uploadImg.$refs.upload.fileList = this.$refs.uploadImg.uploadList
      this.$refs.uploadImg.drawerFlag = true
    },
    //上传图片
    fileUpload (file) {
      //获取图片地址
      getUploadImageUrl(file).then((imageUrl) => {
        //将图片进行压缩
        compress(imageUrl).then((res) => {
          let formData = new FormData();
          formData.append("fileData", base64ToFile(res));
          formData.append("fileName", file.name);
          for (let item in this.extraData) {
            formData.append(item, this.extraData[item]);
          }
          console.log(formData);
          //   uploadImageReq(formData).then((res) => {
          //     if (res.code === 200) {
          //       this.$refs.uploadImg.uploadList.push({ name: res.result, url: showFileUrl(res.result) })
          //       this.$Message.success(this.$t('uploadSuccess'));
          //     } else {
          let content = `${errorType(this, res)}<br> ${res.message}`;
          this.$Modal.error({
            title: this.$t("uploadAttachment") + this.$t("fail"),
            content: content,
          });
          //     }
          //   });
        });
      });
    },
    //删除
    deleteClick () {
      this.$Modal.confirm({
        title: "确认要删除该数据吗?",
        onOk: () => {
          this.selectArr.forEach(o => {
            deleteDataSourceReq({ reportType: o.reportType })
          })
          this.$Message.success("删除成功");
          this.pageLoad();
        },
        //   onCancel: () => this.clearGraphData(),
      });

    },
    // 获取数据字典数据
    async getDataItemData () {
      this.reportTypeList = await this.getDataItemDetailList("dataSource");
    },
    async getDataItemDetailList (itemCode) {
      let arr = [];
      await getlistReq({ itemCode, enabled: 1 }).then((res) => {
        if (res.code === 200) arr = res.result || [];
      });
      return arr;
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
<style scoped lang='less'>
.tableBtn {
  padding: 0px 0.4rem;
  color: #252ab099;
  background: none;
  border: none;
  border-radius: 0.2rem;
}
</style>