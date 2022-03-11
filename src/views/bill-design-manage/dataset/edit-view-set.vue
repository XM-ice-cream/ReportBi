<template>
  <div>
    <Modal :title="dialogFormVisibleTitle" :mask-closable="false" :closable="false" v-model="visib" fullscreen>
      <Form ref="form" :model="formData" :rules="ruleValidate" :label-width="130">
        <Row :gutter="10">
          <Col v-if="this.setType == 'sql'" :xs="24" :sm="20" :md="8" :lg="8" :xl="8">
          <FormItem label="数据源" prop="sourceCode">
            <Select v-model.trim="formData.sourceCode" class="organisation" size="small" @change="changeSource">
              <Option v-for="item in sourceList" :key="item.sourceName" :label="item.sourceName" :value="item.sourceCode" />
            </Select>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="20" :md="7" :lg="7" :xl="7">
          <FormItem label="数据集编码" prop="setCode">
            <Input :disabled="updataDisabled" v-model.trim="formData.setCode" placeholder="唯一标识" size="small" />
          </FormItem>
          </Col>
          <Col :xs="24" :sm="20" :md="7" :lg="7" :xl="7">
          <FormItem label="数据集名称" prop="setName">
            <Input v-model.trim="formData.setName" size="small" />
          </FormItem>
          </Col>
          <Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22">
          <FormItem label="数据集描述">
            <Input v-model.trim="formData.setDesc" size="small" />
          </FormItem>
          </Col>
        </Row>
        <Row v-if="this.setType == 'sql'" :gutter="10">
          <Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22" class="code-mirror-form">
          <FormItem label="查询SQL">
            <div class="codemirror">
              <monaco-editor v-model.trim="formData.dynSentence" language="sql" style="height: 500px" />
            </div>
          </FormItem>
          </Col>
        </Row>
        <Row v-if="this.setType == 'http'">
          <Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22" class="code-mirror-form">
          <FormItem label="请求路径">
            <Input placeholder="请输入请求路径..." v-model="httpForm.apiUrl" class="input-with-select">
            <Select v-model="httpForm.method" slot="prepend" placeholder="请选择" style="width: 80px">
              <Option label="GET" value="GET"></Option>
              <Option label="POST" value="POST"></Option>
              <Option label="PUT" value="PUT"></Option>
              <Option label="DELETE" value="DELETE"></Option>
            </Select>
            </Input>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22" class="code-mirror-form">
          <FormItem label="请求头">
            <Input v-model.trim="httpForm.header" size="small" placeholder="请输入请求头..." />
          </FormItem>
          </Col>
          <Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22" class="code-mirror-form">
          <FormItem label="请求体">
            <Input v-model.trim="httpForm.body" size="small" placeholder="请输入请求体..." />
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22">
          <Form :label-width="100" class="demo-ruleForm">
            <Tabs v-model.trim="tabsActiveName" type="card" @tab-click="handleClickTabs">
              <TabPane label="查询参数" name="first">
                <Button type="primary" v-if="tableData.length == 0" size="small" @click="addRow()">添加
                </Button>
                <Table :data="tableData" border :columns="columns" :max-height="250" style="width: 100%">
                  <template slot-scope="{index}" slot="paramName">
                    <Input v-model.trim="tableData[index].paramName" />
                  </template>
                  <template slot-scope="{index}" slot="paramDesc">
                    <Input v-model.trim="tableData[index].paramDesc" />
                  </template>
                  <template slot-scope="{index}" slot="paramType">
                    <Input v-model.trim="tableData[index].paramType" />
                  </template>
                  <template slot-scope="{index}" slot="sampleItem">
                    <Input v-model.trim="tableData[index].sampleItem" />
                  </template>
                  <template slot-scope="{row,index}" slot="mandatory">
                    <Checkbox v-model="tableData[index].mandatory" @change="Mandatory(index)">必选 </Checkbox>
                    <Button type="primary" icon="el-icon-plus" @click="permissionClick(row, index)"> 高级规则</Button>
                  </template>
                  <template slot-scope="{row,index}" slot="operator">
                    <Button type="text" size="small" @click.native.prevent="cutOutRow(index, tableData)">删除</Button>
                    <Button type="text" size="small" @click="addRow(row)">追加</Button>
                  </template>
                </Table>
              </TabPane>
              <TabPane label="数据转换" name="second">
                <template>
                  <div class="filterWrapper">
                    <div class="filterTable">
                      <div v-for="(item, index) in itemFilterList" :key="index" class="filterBox">
                        <div class="box">
                          <Dictionary v-model="item.transformType" :updata-dict="item.transformType" :dict-key="'TRANSFORM_TYPE'" />
                          <Button type="text" class="reduceFilter" icon="el-icon-close" @click="reduceFilter(item)" />
                          <Button v-if=" item.transformType == 'js' || item.transformType == 'dict'" type="text" class="editor" icon="el-icon-edit" @click="filterScriptBtn(item)" />
                        </div>
                        <Button type="text" class="font-icon-right" icon="el-icon-right" />
                      </div>
                      <Modal :title="dialogTitle" v-model="dialogSwitchVisible" :close-on-click-modal="false" width="60%" min-height="400px" append-to-body>
                        <div v-if="isItemFilterType.transformType == 'js'">
                          <div class="codemirror">
                            <!-- //自定义高级规则？ -->
                            <monaco-editor v-model.trim="transformScript" language="javascript" style="height: 500px" />
                          </div>
                        </div>
                        <div v-else>
                          <div v-for="(item, index) in tableData2" :key="index">
                            <label>字典项名称：</label>
                            <Input v-model.trim="item.name" size="small" style="width: 25%" />
                            <Button type="danger" size="small" plain icon="el-icon-delete" @click="delAllDict($index, tableData2)" />
                            <Table :data="item.children" :columns='columnsChildren' border style="width: 80%">
                              <template slot-scope="{row}" slot='name'>
                                <Input v-model.trim="row.name" />
                              </template>
                              <template slot-scope="{row}" slot='value'>
                                <Input v-model.trim="row.value " />
                              </template>
                              <template slot='operator'>
                                <Button type="success" circle plain icon="el-icon-plus" @click=" addDict($index, item.children)" />
                                <Button type="danger" circle plain icon="el-icon-delete" @click="delDict($index, item.children)" />
                              </template>
                            </Table>
                          </div>
                          <Button type="success" @click="addAllDict()">新增</Button>
                        </div>
                        <span slot="footer" class="dialog-footer">
                          <Button @click="dialogSwitchVisible = false">取消</Button>
                          <Button type="primary" @click="filterScriptConfirm">保存</Button>
                        </span>
                      </Modal>
                      <!-- //添加数据转换 -->
                      <div class="addFilter" disabled="true" @click="addFilter">
                        <i class="el-icon-plus" /><span>新增</span>
                      </div>
                    </div>
                  </div>
                </template>
              </TabPane>
              <TabPane label="测试预览" name="third">
                <div style="max-height: 400px; overflow: auto">
                  <vue-json-editor v-model="cols" :show-btns="false" :mode="'code'" lang="zh" />
                </div>
              </TabPane>
            </Tabs>
          </Form>
          </Col>
        </Row>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="closeDialog">取消</Button>
        <Button type="primary" @click="submit('form')">保存</Button>
      </div>
    </Modal>
    <Modal :title="title" v-model="dialogPermissionVisible" :mask-closable="false" :closable="false" width="60%">
      <div class="codemirror">
        <!-- //自定义高级规则？ -->
        <monaco-editor v-model.trim="validationRules" language="javascript" style="height: 500px" />
      </div>
      <span slot="footer" class="dialog-footer">
        <Button @click="testResultset">测试</Button>
        <Button type="primary" @click="dialogValidationRules">保存</Button>
        <Button @click="dialogPermissionVisible = false">关闭</Button>
      </span>
    </Modal>
  </div>
</template>
<script>
import {
  verificationSet,
  testTransformSet,
  addDataSet,
  editDataSet
} from "@/api/bill-design-manage/dataset.js";
import Dictionary from "@/components/dictionary/index";
// import { codemirror } from "vue-codemirror"; // 引入codeMirror全局实例
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/lib/codemirror.css"; // 核心样式
import "codemirror/theme/cobalt.css"; // 引入主题后还需要在 options 中指定主题才会生效
import vueJsonEditor from "vue-json-editor";
import MonacoEditor from "./monaco-editor.vue";
import { validateEngOrNum } from "@/libs/validate";
export default {
  name: "Support",
  components: { Dictionary, vueJsonEditor, MonacoEditor },
  props: {
    visib: {
      required: true,
      type: Boolean,
      default: false
    },
    dataSet: {
      required: false,
      type: Object,
      default: () => {
        return "";
      }
    }
  },
  data () {
    return {
      data: [],
      listLoading: true,
      permission: {
        add: ["admin", "alipayConfig:add"],
        edit: ["admin", "alipayConfig:edit"],
        del: ["admin", "datasource:del"]
      },
      // 内部真实的内容
      code: "",
      // 默认配置
      optionsSql: {
        mode: "text/x-sql",
        tabSize: 2, // 缩进格式
        // theme: 'cobalt', // monokai主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 显示行号
        line: true,
        styleActiveLine: true, // 高亮选中行
        hintOptions: {
          completeSingle: true // 当匹配只有一项的时候是否自动补全
        }
      },
      optionsJavascript: {
        mode: "text/javascript",
        tabSize: 2, // 缩进格式
        // theme: 'cobalt', // monokai主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 显示行号
        line: true,
        styleActiveLine: true, // 高亮选中行
        hintOptions: {
          completeSingle: true // 当匹配只有一项的时候是否自动补全
        }
      },
      selectedList: [],
      clickType: "",
      formData: {},
      // 弹框默认隐藏
      dialogFormVisible: false,
      dialogFormVisibleTitle: "",
      dialogPermissionVisible: false,
      dialogSwitchVisible: false,
      permissionTextarea: "",
      isItemFilterType: "", // 选中的转换类型id
      itemFilterList: [
        {
          transformType: "js",
          transformScript: ``
        }
      ],
      transformScript: `function dataTransform(data){\n\t//自定义脚本内容\n\treturn data;\n}`,
      itemFilterScriptId: "",
      title: "自定义高级规则",
      totalCount: 0,
      totalPage: 0,
      params: {
        pageNumber: 1,
        pageSize: 10,
        helpTitle: "",
        enabled: null,
        helpCategory: "",
        order: "DESC",
        sort: "update_time"
      },
      ruleValidate: {
        setName: [
          { required: true, message: "数据集名称必填", trigger: "blur" }
        ],
        setCode: [
          { required: true, message: "数据集编码必填", trigger: "blur" },
          { validator: validateEngOrNum, trigger: "blur" }
        ],
        sourceCode: [
          { required: true, message: "数据源必选", trigger: "change" }
        ]
      },
      sourceList: [],
      validationRules: "",
      tabsActiveName: "first",
      cols: [],
      tableData: [
        {
          paramName: "",
          paramDesc: "",
          paramType: "",
          sampleItem: "",
          mandatory: true,
          requiredFlag: 1,
          validationRules: `function verification(data){\n\t//自定义脚本内容\n\t//可返回true/false单纯校验键入的data正确性\n\t//可返回文本，实时替换,比如当前时间等\n\t//return "2099-01-01 00:00:00";\n\treturn true;\n}`
        }
      ],
      columns: [
        {
          title: 'No.',
          type: "index",
          width: 30,
          align: "center",
        },
        {
          title: "参数名",
          slot: "paramName",
        },
        {
          title: "描述",
          slot: "paramDesc",
        }, {
          title: "数据类型",
          slot: "paramType",
        }, {
          title: "示例值",
          slot: "sampleItem",
        }, {
          title: "校验",
          slot: "mandatory",
        }, {
          title: "操作",
          slot: "operator",
          width: '80'
        },
      ],
      columnsChildren: [
        {
          title: 'key',
          width: 30,
          slot: "name",
        },
        {
          title: "值",
          slot: "value",
        },
        {
          title: "操作",
          slot: "operator",
          width: '80'
        },
      ],
      isRowData: {},
      tableData2: [],
      dialogTitle: "js脚本填写",
      isShowPagination: false,
      updataDisabled: false,
      dialogCaseResult: false,
      caseResultTitle: "",
      caseResultContent: null,
      testMassageCode: null,
      query: {
        setName: "",
        setCode: ""
      },
      setType: "", //数据集类型，主要用于区分http   addSql  addHttp  edit
      httpForm: {
        //http数据源相关数据
        apiUrl: "",
        method: "GET",
        header: '{"Content-Type":"application/json;charset=UTF-8"}',
        body: ""
      },
      //待删除
      dictionaryOptions: [], // 数据源类型
      list: null,
      basicDialog: false,
      dialogForm: {
        sourceName: "",
        sourceCode: "",
        sourceType: "",
        sourceDesc: "",
        sourceConfig: ""
      },
      dataLink: [],
      rules: {
        sourceType: [
          { required: true, message: "数据集名称必选", trigger: "change" }
        ],
        sourceCode: [
          { required: true, message: "数据集编码必填", trigger: "blur" }
        ],
        sourceName: [
          { required: true, message: "数据源名称必选", trigger: "blur" }
        ]
      },
      value: "",
      testReplyCode: null
    };
  },
  methods: {
    // 编辑数据集,获取单条数据详情
    addOrEditDataSet (row, type, isAdd) {
      console.log(row, type, isAdd);
      this.setType = type;
      if (type == "http" && row.dynSentence) {
        this.httpForm = JSON.parse(row.dynSentence);
      }
      //获取数据源下拉
      //   const { code, data } = await queryAllDataSourceSet();
      //   if (code != "200") return;
      //   this.sourceList = data;

      this.dialogFormVisible = true;
      this.tabsActiveName = "first";
      this.testMassageCode = null;
      if (!isAdd) {
        this.updataDisabled = true;
        this.dialogFormVisibleTitle = "编辑数据集";
        // dataSetPreview(row).then(data => {
        const data = {
          "code": "200",
          "message": "操作成功",
          "args": null,
          "data": {
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
            "dataSetParamDtoList": [],
            "dataSetTransformDtoList": [],
            "contextData": null,
            "setParamList": [
              "time",
              "type",
              "nums"
            ],
            "fieldLabel": null,
            "accessKey": "bf7e108e0631a9353ca59794e3f82bf0"
          }
        }
        this.formData = data.data;

        if (data.data.dataSetParamDtoList != null || data.data.dataSetParamDtoList.length > 0) {

          this.tableData = data.data.dataSetParamDtoList;
          let count = 0;
          this.tableData.find((value, i) => {

            if (value.paramName === "pageNumber" || value.paramName === "pageSize") {
              count++;
            }
            if (value.requiredFlag == 1) {
              this.tableData[i].mandatory = true;
            } else {
              this.tableData[i].mandatory = false;
            }
          });
          if (count === 2) {
            console.log('123');
            this.isShowPagination = true;
          } else {
            console.log('123');
            this.isShowPagination = false;
            console.log(this.isShowPagination);
          }

        } else {
          this.tableData = [];
          this.isShowPagination = false;

        }
        if (data.data.dataSetTransformDtoList !== null) {
          this.itemFilterList = data.data.dataSetTransformDtoList;
        } else {
          this.itemFilterList = [];
        }
        this.itemFilterList.forEach((item) => {
          if (item.transformType == "dict") {
            const extendObj = JSON.parse(item.transformScript);
            const extendArry = [];
            for (const i in extendObj) {
              const children = [];
              for (const y in extendObj[i]) {
                children.push({ name: y, value: extendObj[i][y] });
              }
              extendArry.push({ name: i, children: children });
            }
            this.tableData2 = extendArry;
          }
        });
        // });
      } else {
        this.dialogFormVisibleTitle = "新增数据集";
        this.updataDisabled = false;
        this.formData = {
          setName: "",
          setCode: "",
          setDesc: "",
          sourceCode: "",
          dynSentence: ""
        };
        this.tableData = [];
        this.itemFilterList = [];
        this.isShowPagination = false;
      }
    },
    // 关闭模态框
    closeDialog () {
      this.$emit("handleClose");
    },
    handleClose () {
      this.dialogFormVisible = false;
    },
    isShowCaseResult (item) {
      this.dialogCaseResult = true;
      this.caseResultTitle = item.setName;
      this.caseResultContent = JSON.parse(item.caseResult);
    },

    // 测试预览
    async handleClickTabs (tab) {
      if (this.setType == "http") {
        //针对http数据源
        console.log("http数据集" + this.httpForm);
        this.formData.dynSentence = JSON.stringify(this.httpForm);
      }
      if (tab.paneName == "third") {
        const params = {
          sourceCode: this.formData.sourceCode,
          dynSentence: this.formData.dynSentence,
          dataSetParamDtoList: this.tableData,
          dataSetTransformDtoList: this.itemFilterList,
          setType: this.setType
        };
        const { code, data } = await testTransformSet(params);
        if (code != "200") return;
        this.cols = data.data;
        this.testMassageCode = code;
      }
    },
    // 必选
    Mandatory (val) {
      if (!this.tableData[val].mandatory) {
        this.tableData[val].requiredFlag = 0;
      } else {
        this.tableData[val].requiredFlag = 1;
      }
    },
    // 分页参数增加列
    changePagination () {
      if (this.isShowPagination) {
        this.tableData.push(
          {
            paramName: "pageNumber",
            paramDesc: "当前页",
            paramType: "int",
            sampleItem: "1",
            mandatory: true,
            requiredFlag: 1,
            validationRules: `function verification(data){\n\t//自定义脚本内容\n\treturn true;\n}`
          },
          {
            paramName: "pageSize",
            paramDesc: "条数",
            paramType: "int",
            sampleItem: "10",
            mandatory: true,
            requiredFlag: 1,
            validationRules: `function verification(data){\n\t//自定义脚本内容\n\treturn true;\n}`
          }
        );
      } else {
        this.tableData.forEach((item, i) => {
          if (item.paramName == "pageSize" || item.paramName == "pageNumber") {
            this.tableData.splice(i, 2);
          }
        });
      }
    },
    // js 脚本编辑
    async filterScriptBtn (item) {
      console.log(item);
      this.isItemFilterType = item;
      this.dialogSwitchVisible = true;
      if (item.transformType == "js") {
        this.itemFilterScriptId = item.itemFilterSort;
        const fnCont = `function dataTransform(data){\n\t//自定义脚本内容\n\treturn data;\n}`;
        this.transformScript = item.transformScript
          ? item.transformScript
          : fnCont;
      } else if (item.transformType == "dict") {
        // this.dialogTitle = '字典翻译'
        // this.itemFilterScriptId = item.itemFilterSort
        // const { code, data } = await getDictList('TRANSFORM_TYPE')
        // if (code != '200') return
        // const extend = data.find(function (y) {
        //   if (y.id == item.transformType) {
        //     return y
        //   }
        // })
        // const extendArry = []
        // const extendObj = JSON.parse(extend.extend)
        // for (const i in extendObj) {
        //   const children = []
        //   for (const y in extendObj[i]) {
        //     children.push({ name: y, value: extendObj[i][y] })
        //   }
        //   extendArry.push({ name: i, children: children })
        // }
        // this.tableData2 = extendArry
      }
    },
    // js 脚本编辑确定
    filterScriptConfirm () {
      const arr = this.toObject(this.tableData2);
      this.itemFilterList.forEach((el) => {
        if (el.transformType == "dict") {
          el.transformScript = JSON.stringify(arr);
        } else {
          el.transformScript = this.transformScript;
        }
      });
      this.dialogSwitchVisible = false;
    },
    addFilter () {
      let obj = {};
      this.tableData2 = [];
      if (this.itemFilterList.length == 0) {
        obj = {
          transformType: "",
          transformScript: "",
          itemFilterSort: 1
        };
      } else {
        obj = {
          transformType: "",
          transformScript: "",
          itemFilterSort: this.itemFilterList.length + 1
        };
      }
      this.itemFilterList.push(obj);
    },
    // 删除filter
    reduceFilter (item) {
      if (this.itemFilterList.length > 0) {
        let index = this.itemFilterList.indexOf(item);
        if (index > -1) {
          this.itemFilterList.splice(index, 1);
        }
      }
    },
    // --查询参数-----------------///////////////////////////////////////////////////////////////////////
    permissionClick (row) {
      this.title = "自定义高级规则";
      if (this.isRowData.sampleItem != "") {
        this.isRowData = row;
        const fnCont = `function verification(data){\n\t//自定义脚本内容\n\t//可返回true/false单纯校验键入的data正确性\n\t//可返回文本，实时替换,比如当前时间等\n\t//return "2099-01-01 00:00:00";\n\treturn true;\n}`;
        this.validationRules = row.validationRules
          ? row.validationRules
          : fnCont;
      }
      this.dialogPermissionVisible = true;
    },
    dialogValidationRules () {
      this.isRowData.validationRules = this.validationRules;
      this.dialogPermissionVisible = false;
    },
    // 字典项 增删改
    addAllDict () {
      this.tableData2.push({
        name: "",
        children: [{ name: "", value: "" }]
      });
    },
    addDict (index, item) {
      item.push({ name: "", value: "" });
    },
    delAllDict (index, rows) {
      rows.splice(index, 1);
    },
    delDict (index, rows) {
      if (index == 0) {
        this.$message.error("至少保留一条");
        return;
      }
      rows.splice(index, 1);
    },
    // -------------------------------------------------------------------------------
    // 数据源下拉切换
    changeSource () { },
    // 自定义高级规则
    async testResultset () {
      this.isRowData.validationRules = this.validationRules;
      const { code, message, data } = await verificationSet(this.isRowData);
      if (code == "200") {
        if (data) {
          this.$message.success("返回结果：" + data);
        } else {
          this.$message.warning("当前示例值校验不通过");
        }
      } else {
        this.$message.error(message);
      }
    },
    // 删除
    cutOutRow (index, rows) {
      rows.splice(index, 1);
    },
    // 追加
    addRow () {
      this.tableData.push({
        paramName: "",
        paramDesc: "",
        paramType: "",
        sampleItem: "",
        mandatory: true,
        requiredFlag: 1,
        validationRules: `function verification(data){\n\t//自定义脚本内容\n\t//可返回true/false单纯校验键入的data正确性\n\t//可返回文本，实时替换,比如当前时间等\n\t//return "2099-01-01 00:00:00";\n\treturn true;\n}`
      });
      console.log(this.tableData);
    },
    async submit (formName) {
      if (this.setType == "http") {
        //针对http数据源
        console.log("http数据集" + this.httpForm);
        this.formData.dynSentence = JSON.stringify(this.httpForm);
      }
      this.formData.setType = this.setType;
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.testMassageCode == 200) {
            this.formData.dataSetParamDtoList = this.tableData;
            this.formData.dataSetTransformDtoList = this.itemFilterList;
            this.formData.caseResult = JSON.stringify(this.cols);
            if (this.dialogFormVisibleTitle === "新增数据集") {
              const { code } = await addDataSet(this.formData);
              if (code != "200") return;
              this.$emit("refreshList");
              this.closeDialog();
            } else {
              const { code } = await editDataSet(this.formData);
              if (code != "200") return;
              this.$emit("refreshList");
              this.closeDialog();
            }
          } else {
            this.$message.error("请先测试预览，操作成功后便可保存！");
            return;
          }
        } else {
          return;
        }
      });
    },
    toObject (val) {
      const objfirst = {};
      const objSecond = {};
      val.forEach(el => {
        el.name ? (objfirst[el.name] = el.children) : "";
      });
      for (const key in objfirst) {
        const newObj = {};
        objfirst[key].map(ev => {
          Object.assign(newObj, { [ev.name]: ev.value });
        });
        objSecond[key] = newObj;
      }
      return objSecond;
    }
  }
};
</script>
<style lang="less" scoped>
.code-mirror-form {
  /deep/ .FormItem__content {
    height: 200px;
    overflow: hidden;
  }
}

.my-editor {
  height: 400px;

  div.jsoneditor {
    height: 400px !important;
  }
}

.title {
  width: 100%;
  display: inline-block;
  text-align: left;
}

.addSwitch {
  ul {
    list-style: none;
    margin: 0px;

    li {
      width: 200px;
      height: 60px;
      padding: 10px;
      border: 1px solid #aaa;
      float: left;
      margin-right: 10px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;

      &.add,
      &:hover {
        border: 1px solid #3385ff;
        color: #3385ff;
      }
    }
  }
}

.filterWrapper {
  position: relative;
}

.filterTable {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 5px 15px 25px 15px;
}

.filterWrapper .addFilter {
  cursor: pointer;
  width: 150px;
  height: 50px;
  border-radius: 3px;
  border: 1px solid #67c23a;
  margin-top: 20px;
  background: #e4f7da;
  padding-left: 24px;
}

.filterWrapper .addFilter i {
  font-size: 20px;
  color: #67c23a;
  margin-top: 16px;
  margin-left: 16px;
}

.filterWrapper .addFilter span {
  color: #67c23a;
  margin-left: 5px;
  font-size: 18px;
}

.filterBox {
  width: 182px;
  position: relative;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
}

.filterBox .box {
  width: 150px;
  height: 50px;
  text-align: center;
  position: relative;
  background: #e0e8ff;
  border-radius: 3px;
  border: 1px solid #b8caff;
  float: left;
  padding: 5px 20px;
}

.filterBox .box .reduceFilter {
  width: 10px;
  height: 10px;
  position: absolute;
  right: 4px;
  top: 4px;
  cursor: pointer;
}

.filterBox .box .editor {
  width: 12px;
  height: 13px;
  position: absolute;
  left: -5px;
  top: 5px;
  cursor: pointer;
}

.filterBox .rightIcon {
  width: 45px;
  height: 19px;
  position: absolute;
  right: 10px;
  top: 15px;
}

.filterTextarea /deep/ .el-textarea__inner {
  min-height: 300px !important;
}

.filterBox .code-selected {
  width: 70%;
  margin-top: 4px;
}

.filterBox /deep/ .Input--suffix .Input__inner {
  background: #f4f7ff;
  border-radius: 3px;
  border: 1px solid #b8caff;
  color: #89a3ee;
}

.font-icon-right {
  line-height: 35px;
  font-size: 30px;
}

.popover-box {
  width: 100%;
  height: 220px;
  overflow-y: auto;
  padding: 10px;
}
</style>
