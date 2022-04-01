<template>
  <div>
    <Modal :title="dialogFormVisibleTitle" :mask-closable="false" :closable="true" v-model="visib" fullscreen :z-index='848' :before-close="closeDialog">
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
                <Panel :name="item.setCode">
                  {{item.setName}}
                  <div slot="content">
                    <div class="deletePop">
                      <Icon type="md-trash" @click="del(item)" />
                    </div>

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
                    <i-switch v-model="rightForm.auto" @on-change="autoChangeFunc($event)" /> &nbsp;
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
        <Button type="primary" @click="save()">保存</Button>
      </div>
    </Modal>

    <!-- 数据集管理弹框--表格 -->
    <Modal title="数据集管理" v-model="outerVisible" class="tableModal" :z-index='849'>
      <Table ref="multipleTable" :data="dataSetData" :columns='columns' height='500' tooltip-effect="dark" @on-selection-change="handleSelectionChange"></Table>
      <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      <div slot="footer" class="dialog-footer">
        <Button @click="outerVisible = false">取 消</Button>
        <Button type="primary" @click="checkDataSet">确定 </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getpagelistReq, getDeatilByIdReq } from "@/api/bill-design-manage/data-set.js";
import { getExcelByReportcodeReq, insertExcelReportReq, modifyExcelReportReq } from '@/api/bill-design-manage/report-manage.js'
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
    reportCode: {
      required: false,
      type: String,
    }
  },
  watch: {
    visib () {
      if (this.visib) {
        this.$nextTick(() => {
          this.design();
        })
      }
    }
  },
  data () {
    return {
      dialogFormVisibleTitle: '报表EXCEL 设计',
      formData: {},
      dataSet: [],
      activeNames: ["1"],
      activeName: "first",
      outerVisible: false,
      dataSetData: [],
      setCode: '',
      selectArr: [],
      draggableFieldLabel: '',//拖拽的文本内容
      sheetData: '',
      tableConfig: { ...this.$config.tableConfig }, // table配置
      req: {
        ...this.$config.pageConfig,
      },
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
      ],
      reportExcelDto: {
        id: null,
        jsonStr: "",
        setCodes: "",
        setParam: "",
        reportCode: ""
      },

    };
  },
  methods: {
    //初始化显示第一条
    design () {
      // 根据reportCode获取单条报表
      getExcelByReportcodeReq({ reportCode: this.reportCode }).then(res => {
        if (res.code === 200) {

          const { result } = res;

          if (result != null) {
            this.reportId = result.reportCode;
          }
          this.sheetData = result == null ? [{}] : JSON.parse(result.jsonStr);
          this.createSheet();
          if (result != null) {
            if (result.setCodes != null && result.setCodes !== "") {
              let dataSetList = result.setCodes.split("|");
              dataSetList.forEach(code => {
                this.detail(code);
              });
            }
          }
        }
      });

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
            window.luckysheet.setCellValue(
              postion.r,
              postion.c,
              that.draggableFieldLabel
            );
          },
          cellMousedown: function (cell, postion, sheetFile, ctx) {
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
      let obj = {
        orderField: "setCode", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: { sourceCode: "", setCode: "", setName: "" },
      };
      getpagelistReq(obj).then(res => {
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.dataSetData = data || [];
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
        }
      })
    },
    //选择选中的数据集
    checkDataSet () {
      this.outerVisible = false;
      if (this.selectArr.length > 1) {
        this.$Message.warning("一次最多勾选一个数据集");
        this.outerVisible = true;
      } else {
        this.detail(this.selectArr[0].setCode);
      }
    },
    detail (setCode) {
      const obj = { setCode: setCode };
      getDeatilByIdReq(obj).then(res => {
        if (res.code === 200) {
          const data = res.result;
          this.dataSet.push(data);
        }
      });

    },
    //预览
    preview () {
      this.closeDialog();
      this.$parent.previewVisib = true;
    },
    //保存
    async save () {
      const jsonData = luckysheet.getAllSheets();
      for (let i = 0; i < jsonData.length; i++) {
        //清空data数据，以celldata数据为主
        jsonData[i]["data"] = [];
      }

      this.reportExcelDto.jsonStr = JSON.stringify(luckysheet.getAllSheets());
      let setCodeList = [];
      let setParams = {};
      this.dataSet.forEach(code => {
        setCodeList.push(code.setCode);
        if (
          code.dataSetParamDtoList != null &&
          code.dataSetParamDtoList.length > 0
        ) {
          let dataSetParam = {};
          code.dataSetParamDtoList.forEach(value => {
            dataSetParam[value.paramName] = value.sampleItem;
          });
          setParams[code.setCode] = dataSetParam;
        }
      });

      this.reportExcelDto.setParam = JSON.stringify(setParams);
      this.reportExcelDto.setCodes = setCodeList.join("|");
      this.reportExcelDto.reportCode = this.reportCode;
      if (this.reportId == null) {
        const { code, message } = await insertExcelReportReq(this.reportExcelDto);
        if (code != 200) {
          this.$Message.error(message);
          return;
        };
        this.$Message.success("保存成功");
        this.closeDialog();
      } else {
        this.reportExcelDto.id = this.reportId;
        const { code, message } = await modifyExcelReportReq(this.reportExcelDto);
        if (code != 200) {
          this.$Message.error(message);
          return;
        };
        this.$Message.success("更新成功");
        this.closeDialog();
      }
    },
    //删除多选
    handleSelectionChange (val) {
      this.selectArr = val;
    },
    //删除数据集数据
    del (val) {
      this.$Modal.confirm({
        title: '确定删除' + val.setName + '吗？',
        onOk: () => {
          for (let i = 0; i < this.dataSet.length; i++) {
            if (this.dataSet[i].setCode === val.setCode) {
              this.dataSet.splice(i, 1);
              this.$Message.success("删除成功");
              break;
            }
          }

        },
      });

    },
    //关闭弹框
    closeDialog () {
      this.$emit('update:visib', false);
      this.dataSet = [];
    },
    // 选择第几页
    pageChange (index) {
      this.req.pageIndex = index;
      this.queryAllDataSet();
    },
    // 选择一页有条数据
    pageSizeChange (index) {
      this.req.pageIndex = 1;
      this.req.pageSize = index;
      this.queryAllDataSet();
    },
  },
  mounted () {


  }
};
</script>
<style>
.luckysheet-input-box {
  z-index: 1000;
}
</style>
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
    height: calc(100% - 5rem);
    overflow-y: scroll;
    .row {
      padding: 0.2rem;
      margin: 0 1.6rem 0.3rem;
    }
    .deletePop {
      position: absolute;
      right: -1rem;
      top: -1.8rem;
      i {
        color: #ff6161;
        font-size: 1.02rem;
      }
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
/deep/
  .ivu-collapse-simple
  > .ivu-collapse-item
  > .ivu-collapse-content
  > .ivu-collapse-content-box {
  position: relative;
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
/deep/.luckysheet-share-logo {
  display: none;
}
.tableModal {
  /deep/ .ivu-modal {
    width: 600px !important;
  }
}
/deep/ #luckysheet-row-count-show {
  width: 1.2rem !important;
}
</style>
