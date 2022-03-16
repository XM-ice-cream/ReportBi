<template>
  <div>
    <Modal :title="dialogFormVisibleTitle" :mask-closable="false" :closable="false" v-model="visib" fullscreen :z-index='800'>
      <div class="layout">
        <Layout>
          <!-- 左侧 -->
          <Sider hide-trigger class="sider">
            <!-- 数据集管理 -->
            <div class="title">数据集管理</div>
            <!-- 添加图表 -->
            <div class="icon" @click="queryAllDataSet">
              <Icon type="md-add" />
            </div>
            <!-- DBlist -->
            <div class="dblist">
              <Collapse simple v-for="(item, indexs) in dataSet" :key="indexs" v-model="activeNames">
                <Panel name="1">
                  {{item.name}}
                  <div slot="content">
                    <draggable v-model="item.setParamList" :sort="false" group="people" style="margin-left: 10px" @start="onStart(item.setCode, $event)">
                      <div class="row" v-for="(i, index) in item.setParamList" :key="index">{{i}}</div>
                    </draggable>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </Sider>
          <!-- 中间内容excel -->
          <Content class="content">
            <div class="push_btn">
              <Tooltip class="item" effect="dark" content="预览" placement="bottom-start">
                <Button type="text" @click="preview()">
                  <Icon type="md-eye" />
                </Button>
              </Tooltip>
              <Tooltip class="item" effect="dark" content="保存" placement="bottom-start">
                <Button type="text" @click="save()">
                  <Icon type="ios-folder" />
                </Button>
              </Tooltip>
            </div>
            <div id="luckysheet" style="margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 0px;"></div>
            <div style="display:none"></div>
          </Content>
          <!-- 右侧基础配置 -->
          <Sider hide-trigger class="sider" style="right:0;position:absolute">
            <Tabs v-model="activeName">
              <TabPane label="基础配置" name="first">
                <Form ref="rightForm" :model="rightForm" :label-width="60" style="padding: 0 0.5rem">
                  <FormItem label="坐标">
                    <Input v-model="rightForm.coordinate" />
                  </FormItem>
                  <FormItem label="值">
                    <Input v-model="rightForm.value" />
                  </FormItem>
                  <FormItem label="自动扩展" v-if="rightForm.autoIsShow">
                    <i-switch v-model="rightForm.auto" @change="autoChangeFunc($event)" /> &nbsp;
                    <Tooltip class="item" effect="dark" content="只针对静态数据的单元格" placement="top">
                      <i class="el-icon-question"> </i>
                    </Tooltip>
                  </FormItem>
                </Form>
              </TabPane>
            </Tabs>
          </Sider>
        </Layout>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button @click="closeDialog">取消</Button>
        <Button type="primary" @click="commit()">保存</Button>
      </div>
    </Modal>

    //数据集管理弹框--表格
    <Modal title="数据集管理" v-model="outerVisible" style="width:800px" :z-index='801'>
      <Table ref="multipleTable" :data="dataSetData" :columns='columns' height='500' tooltip-effect="dark" @on-select="handleSelectionChange"></Table>
      <div slot="footer" class="dialog-footer">
        <Button @click="outerVisible = false">取 消</Button>
        <Button type="primary" @click="checkDataSet()">确定 </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: "excelreport-design",
  components: { draggable },
  props: {
    visib: {
      required: true,
      type: Boolean,
      default: false
    },
    reportData: {
      required: false,
      type: Object,
      default: () => {
        return "";
      }
    }
  },
  watch: {
    visib () {
      console.log(this.visib);
      if (this.visib) {
        console.log(34);
        this.design();
      }
    }
  },
  data () {
    return {
      dialogFormVisibleTitle: '报表EXCEL 设计',
      formData: {},
      dataSet: [{ name: '123', setCode: '123', setParamList: ['startTime', 'endTime'] }],
      activeNames: ["1"],
      activeName: "first",
      outerVisible: false,
      dataSetData: [
        {
          "id": 84,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "HTTP01",
          "setName": "HTTP01",
          "setDesc": "HTTP01",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 82,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "SADFSDAF",
          "setName": "ASFSFD修改",
          "setDesc": "SAFAFSDFS修改",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 83,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "QQQQQ",
          "setName": "DB01",
          "setDesc": "DB01",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 81,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "aasdf",
          "setName": "sdfsaf",
          "setDesc": "sdfasf",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 80,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "DB01Collect02",
          "setName": "DB01Collect02",
          "setDesc": "DB01Collect02",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 79,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "DB01Collect01",
          "setName": "DB01Collect01",
          "setDesc": "DB01Collect01",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 78,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "022802",
          "setName": "022802",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 77,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "022801",
          "setName": "022801",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 76,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "0228",
          "setName": "0228",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 75,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "111",
          "setName": "111",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 74,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "009",
          "setName": "流程卡",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 73,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "003",
          "setName": "bigdata_travel",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 72,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "compare_ajreport",
          "setName": "柱状对比图示例数据",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 71,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "barstack_ajreport",
          "setName": "柱状堆叠数据",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 70,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "per",
          "setName": "百分比",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 69,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "logis_table",
          "setName": "表格测试",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 68,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "logis_3",
          "setName": "收发车情况",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 67,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "logis_2",
          "setName": "收车量",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 66,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "logis_1",
          "setName": "库存",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 65,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "amount_1",
          "setName": "amount1",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 62,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "acc_ajrt",
          "setName": "访问-系统RT",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 64,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "acc_ajerror",
          "setName": "访问-系统ERROR",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 63,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "acc_ajqps",
          "setName": "访问-系统QPS",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 60,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "acc_ajacc",
          "setName": "访问-访问人数趋势",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 61,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "acc_ajregister",
          "setName": "访问-注册人数趋势",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 59,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "car_ajreturn",
          "setName": "汽车-退货",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 58,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "car_ajrework",
          "setName": "汽车-返修",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 57,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "car_ajunsale",
          "setName": "汽车-滞销",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 56,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "car_ajsaleTop5",
          "setName": "汽车-销售TOP5",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 55,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "car_ajproTop5",
          "setName": "汽车-生产TOP5",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 54,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "car_ajsale",
          "setName": "汽车-销售趋势",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 53,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "car_ajpro",
          "setName": "汽车-生产趋势",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 48,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "log_ajattack",
          "setName": "日志-攻击占比",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 52,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "log_ajwifiamount",
          "setName": "日志-wifi登陆趋势",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 51,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "log_ajmailfail",
          "setName": "日志-邮件认证失败趋势",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 50,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "log_ajmailfailtop5",
          "setName": "日志-邮件认证失败top5",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 47,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "log_ajfireacl",
          "setName": "日志-防火墙ACL次数",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        },
        {
          "id": 46,
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "version": null,
          "setCode": "log_ajdevices",
          "setName": "日志-资产统计",
          "setDesc": "",
          "setType": null,
          "sourceCode": null,
          "dynSentence": null,
          "caseResult": null,
          "enableFlag": null,
          "deleteFlag": null
        }
      ],
      setCode: '',
      selectArr: [],
      draggableFieldLabel: '',//拖拽的文本内容
      sheetData: '',
      rightForm: {
        coordinate: "",
        value: "",
        r: "",
        c: "",
        auto: false,
        autoIsShow: false
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          type: "index", width: 50, align: "center",
        },
        { title: '数据集名称', key: "setName", align: "center", tooltip: true, width: '120' },
        { title: '数据集描述', key: "setDesc", align: "center", tooltip: true, width: '180' },
        { title: '数据集编码', key: "setCode", align: "center", tooltip: true }
      ]

    };
  },
  methods: {
    commit () {

    },
    //初始化显示第一条
    design () {
      console.log('1233');
      // 根据reportCode获取单条报表
      //   const { code, data } = await detailByReportCode(this.reportCode);
      const result = {
        "code": "200",
        "message": "操作成功",
        "args": null,
        "data": {
          "id": 231,
          "createBy": "admin",
          "createByView": null,
          "createTime": "2022-02-28 10:17:51",
          "updateBy": "admin",
          "updateByView": null,
          "updateTime": "2022-03-07 19:46:42",
          "version": 13,
          "reportName": null,
          "reportCode": "022802",
          "setCodes": "022802",
          "reportGroup": null,
          "setParam": "{\"022802\":{\"startTime\":\"2021-12-30\",\"endTime\":\"2021-12-31\"}}",
          "jsonStr": "[{\"index\":\"Sheet_Wm05l77i4lKe_1646014654853\",\"status\":1,\"jfgird_select_save\":[],\"luckysheet_select_save\":[{\"left\":771,\"width\":73,\"top\":0,\"height\":19,\"left_move\":771,\"width_move\":73,\"top_move\":0,\"height_move\":19,\"row\":[0,0],\"column\":[6,6],\"row_focus\":0,\"column_focus\":6}],\"data\":[[{\"m\":\"partname\",\"ct\":{\"fa\":\"General\",\"t\":\"g\"},\"v\":\"partname\",\"bg\":\"#6fa8dc\"},{\"m\":\"trackouttime\",\"ct\":{\"fa\":\"General\",\"t\":\"g\"},\"v\":\"trackouttime\",\"bg\":\"#6fa8dc\"},{\"m\":\"stepnam\",\"ct\":{\"fa\":\"General\",\"t\":\"g\"},\"v\":\"stepnam\",\"bg\":\"#6fa8dc\"},{\"m\":\"opid\",\"ct\":{\"fa\":\"General\",\"t\":\"g\"},\"v\":\"opid\",\"bg\":\"#6fa8dc\"},{\"m\":\"rulenam\",\"ct\":{\"fa\":\"General\",\"t\":\"g\"},\"v\":\"rulenam\",\"bg\":\"#6fa8dc\"},{\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"m\":\"linename\",\"v\":\"linename\",\"bg\":\"#3d85c6\"},{\"ct\":{\"fa\":\"@\",\"t\":\"s\"}},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[{\"m\":\"#{022802.partname}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.partname}\"},{\"m\":\"#{022802.trackouttime}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.trackouttime}\"},{\"m\":\"#{022802.stepname}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.stepname}\"},{\"m\":\"#{022802.opid}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.opid}\"},{\"m\":\"#{022802.rulename}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.rulename}\"},{\"m\":\"#{022802.linename}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.linename}\"},{\"m\":\"#{022802.status}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.status}\"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]],\"config\":{\"columnlen\":{\"0\":120,\"1\":157,\"2\":141,\"3\":140,\"4\":134},\"customWidth\":{\"0\":1,\"1\":1,\"2\":1,\"3\":1,\"4\":1},\"merge\":{}},\"visibledatarow\":[20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340,360,380,400,420,440,460,480,500,520,540,560,580,600,620,640,660,680,700,720,740,760,780,800,820,840,860,880,900,920,940,960,980,1000,1020,1040,1060,1080,1100,1120,1140,1160,1180,1200,1220,1240,1260,1280,1300,1320,1340,1360,1380,1400,1420,1440,1460,1480,1500,1520,1540,1560,1580,1600,1620,1640,1660,1680],\"visibledatacolumn\":[121,279,421,562,697,771,845,919,993,1067,1141,1215,1289,1363,1437,1511,1585,1659,1733,1807,1881,1955,2029,2103,2177,2251,2325,2399,2473,2547,2621,2695,2769,2843,2917,2991,3065,3139,3213,3287,3361,3435,3509,3583,3657,3731,3805,3879,3953,4027,4101,4175,4249,4323,4397,4471,4545,4619,4693,4767],\"ch_width\":4887,\"rh_height\":1760,\"luckysheet_selection_range\":[{\"row\":[0,0],\"column\":[4,4]}],\"zoomRatio\":1,\"celldata\":[{\"r\":0,\"c\":0,\"v\":{\"m\":\"partname\",\"ct\":{\"fa\":\"General\",\"t\":\"g\"},\"v\":\"partname\",\"bg\":\"#6fa8dc\"}},{\"r\":0,\"c\":1,\"v\":{\"m\":\"trackouttime\",\"ct\":{\"fa\":\"General\",\"t\":\"g\"},\"v\":\"trackouttime\",\"bg\":\"#6fa8dc\"}},{\"r\":0,\"c\":2,\"v\":{\"m\":\"stepnam\",\"ct\":{\"fa\":\"General\",\"t\":\"g\"},\"v\":\"stepnam\",\"bg\":\"#6fa8dc\"}},{\"r\":0,\"c\":3,\"v\":{\"m\":\"opid\",\"ct\":{\"fa\":\"General\",\"t\":\"g\"},\"v\":\"opid\",\"bg\":\"#6fa8dc\"}},{\"r\":0,\"c\":4,\"v\":{\"m\":\"rulenam\",\"ct\":{\"fa\":\"General\",\"t\":\"g\"},\"v\":\"rulenam\",\"bg\":\"#6fa8dc\"}},{\"r\":0,\"c\":5,\"v\":{\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"m\":\"linename\",\"v\":\"linename\",\"bg\":\"#3d85c6\"}},{\"r\":0,\"c\":6,\"v\":{\"ct\":{\"fa\":\"@\",\"t\":\"s\"}}},{\"r\":1,\"c\":0,\"v\":{\"m\":\"#{022802.partname}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.partname}\"}},{\"r\":1,\"c\":1,\"v\":{\"m\":\"#{022802.trackouttime}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.trackouttime}\"}},{\"r\":1,\"c\":2,\"v\":{\"m\":\"#{022802.stepname}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.stepname}\"}},{\"r\":1,\"c\":3,\"v\":{\"m\":\"#{022802.opid}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.opid}\"}},{\"r\":1,\"c\":4,\"v\":{\"m\":\"#{022802.rulename}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.rulename}\"}},{\"r\":1,\"c\":5,\"v\":{\"m\":\"#{022802.linename}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.linename}\"}},{\"r\":1,\"c\":6,\"v\":{\"m\":\"#{022802.status}\",\"ct\":{\"fa\":\"@\",\"t\":\"s\"},\"v\":\"#{022802.status}\"}}],\"images\":{},\"scrollLeft\":0,\"scrollTop\":0,\"luckysheet_conditionformat_save\":[],\"dataVerification\":{},\"frozen\":{\"type\":\"row\"},\"dynamicArray\":[]}]",
          "reportType": null,
          "total": 0,
          "exportType": null,
          "accessKey": "4b574eaccaf8041a0fc0c011138cd182"
        }
      }
      const { code, data } = result;
      console.log(code);
      if (data != null) {
        this.reportId = data.id;
      }
      this.sheetData = data == null ? [{}] : JSON.parse(data.jsonStr);
      console.log(this.sheetData);
      this.createSheet();
      if (data != null) {
        if (data.setCodes != null && data.setCodes !== "") {
          //   let dataSetList = data.setCodes.split("|");
          //   dataSetList.forEach(code => {
          //     this.dataSetData.forEach(setData => {
          //     //   if (code === setData.setCode) {
          //     //     this.detail(setData.id);
          //     //   }
          //     });
          //   });
        }
      }
    },
    //初始化表格
    createSheet () {
      //将vue对象传入
      const that = this;
      let options = {
        container: 'luckysheet', // 设定DOM容器的id
        title: '', // 设定表格名称
        lang: 'zh', // 设定表格语言
        plugins: ['chart'],
        hook: {
          cellDragStop: function (cell, postion, sheetFile, ctx) {
            console.log(cell, postion, sheetFile, ctx);
            window.luckysheet.setCellValue(
              postion.r,
              postion.c,
              that.draggableFieldLabel
            );
          },
          cellMousedown: function (cell, postion, sheetFile, ctx) {
            console.log(sheetFile, ctx);
            //单元格点击事件
            that.rightForm.coordinate = postion.r + "," + postion.c;
            that.rightForm.r = postion.r;
            that.rightForm.c = postion.c;
            that.rightForm.value = cell == null ? "" : cell.v;
            that.rightForm.autoIsShow = true
            //判断单元格是否是静态数据并且是合并单元格
            if (cell != null && (cell.v == undefined || cell.v.indexOf('#{') === -1)) {
              that.rightForm.autoIsShow = true
              if (cell.auto != null && cell.auto == '1') {
                that.rightForm.auto = true
              } else {
                that.rightForm.auto = false
              }
            } else {
              that.rightForm.auto = false
            }
          }
        },
        data: [
          {
            name: "report", //工作表名称
            color: "", //工作表颜色
            index: 0, //工作表索引
            status: 1, //激活状态
            order: 0, //工作表的下标
            hide: 0, //是否隐藏
            row: 36, //行数
            column: 18, //列数
            defaultRowHeight: 19, //自定义行高
            defaultColWidth: 73, //自定义列宽
            celldata: [], //初始化使用的单元格数据
            config: {
              merge: {}, //合并单元格
              rowlen: {}, //表格行高
              columnlen: {}, //表格列宽
              rowhidden: {}, //隐藏行
              colhidden: {}, //隐藏列
              borderInfo: {}, //边框
              authority: {} //工作表保护
            },
            scrollLeft: 0, //左右滚动条位置
            scrollTop: 315, //上下滚动条位置
            luckysheet_select_save: [], //选中的区域
            calcChain: [], //公式链
            isPivotTable: false, //是否数据透视表
            pivotTable: {}, //数据透视表设置
            filter_select: {}, //筛选范围
            filter: null, //筛选配置
            luckysheet_alternateformat_save: [], //交替颜色
            luckysheet_alternateformat_save_modelCustom: [], //自定义交替颜色
            luckysheet_conditionformat_save: {}, //条件格式
            frozen: {}, //冻结行列配置
            chart: [], //图表配置
            zoomRatio: 1, // 缩放比例
            image: [], //图片
            showGridLines: 1, //是否显示网格线
            dataVerification: {} //数据验证配置
          }
        ]
      };
      options.data = this.sheetData;
      this.$nextTick(() => {
        $(function () {
          luckysheet.create(options);
        })
      })



    },
    // 左侧列表拖拽
    onStart (setCode, evt) {
      this.setCode = setCode;
      let fieldLabel = evt.item.innerText; // 列名称
      this.draggableFieldLabel = "#{" + this.setCode + "." + fieldLabel + "}";
      console.log("evt", evt);
      console.log("draggableFieldLabel", this.draggableFieldLabel);
    },
    autoChangeFunc (auto) {
      if (auto) {
        luckysheet.setCellValue(this.rightForm.r, this.rightForm.c, { auto: "1" })
      } else {
        luckysheet.setCellValue(this.rightForm.r, this.rightForm.c, { auto: "0" })
      }
    },
    //查看所有数据集
    queryAllDataSet () {
      this.outerVisible = true;
    },
    //选择选中的数据集
    checkDataSet () {
      this.outerVisible = false;
      if (this.selectArr.length > 1) {
        this.$Message.warning("一次最多勾选一个数据集");
        this.outerVisible = true;
      } else {
        this.detail(this.selectArr[0].id);
      }
    },
    detail (id) {
      //   const { code, data } = await detail(id);
      //   if (code != 200) return;
      let flag = true;
      this.dataSet.forEach(value => {
        if (value.setCode === data.setCode) {
          flag = false;
        }
      });
      if (flag) {
        this.dataSet.push(data);
      }
    },
    //预览
    preview () {
    },
    //保存
    save () {

    },
    //删除多选
    handleSelectionChange (val) {
      this.selectArr = val;
    },
    //关闭弹框
    closeDialog () {
      this.$emit('update:visib', false)
    }
  },
  mounted () {


  }
};
</script>
<style lang="less" scoped>
.sider {
  width: 180px !important;
  min-width: 180px !important;
  max-width: 180px !important;
  flex: 0 0 180px !important;
  height: 100%;
  //   border: 2px solid #3d85c6;
  margin: 0 0.5rem;
  /* padding: 0 0.5rem; */
  background-color: transparent;
  .title {
    width: 100%;
    height: 2rem;
    color: #1ec0d1;
    text-align: center;
    margin: 0.2rem 0;
    line-height: 2rem;
    font-weight: bold;
    font-size: 0.94rem;
  }
  .icon {
    height: 2rem;
    text-align: right;
    padding-right: 1rem;
    font-size: 1.5rem;
    line-height: 2rem;
    background: #efefef;
    color: #1ec0d1;
  }
  .dblist {
    .row {
      padding: 0.2rem;
      margin: 0 1.6rem 0.3rem;
    }
  }
}
.content {
  width: calc(100% - 400px);
  height: 100%;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-left: 0rem;
  padding: 1rem;
  .push_btn {
    position: absolute;
    z-index: 100;
    top: 15px;
    right: 13%;

    i {
      color: #6c6666;
      font-size: 1.12rem;
      margin-right: 0.3rem;
    }
  }
}

/deep/.ivu-modal-fullscreen .ivu-modal-body {
  width: 100%;
  overflow: auto;
  position: absolute;
  top: 43px;
  bottom: 43px;
  right: 0;
  left: 0px;
  padding: 0;
}
/deep/.layout,
.ivu-layout {
  height: 100%;
  background: #fff;
}
/deep/.ivu-collapse-simple {
  border-top: none;
}
/deep/.luckysheet-stat-area {
  background: transparent;
}
/deep/.luckysheet {
  border-top: none;
}
</style>
