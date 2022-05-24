<template>
  <div style="height:100%">
    <Layout class="layout">
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
          <Collapse simple v-for="(item, indexs) in dataSet" :key="indexs">
            <Panel :name="item.setCode" :title="item.setName">
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
          <Tooltip class="item" effect="dark" content="保存" placement="bottom-start">
            <Button type="text" @click="save()">
              <Icon type="ios-folder" />
            </Button>
          </Tooltip>
          <Tooltip class="item" effect="dark" content="预览" placement="bottom-start">
            <Button type="text" @click="preview()">
              <Icon type="md-eye" />
            </Button>
          </Tooltip>

        </div>
        <div id="luckysheet" style="margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 0px;"></div>
        <div style="display:none"></div>
      </Content>
      <!-- 右侧基础配置 -->
      <Sider hide-trigger class="sider" style="right:0;position:absolute">
        <Tabs>
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

    <!-- 数据集管理弹框--表格 -->
    <Modal title="数据集管理" v-model="outerVisible" class="tableModal">
      <div class="tableTabs">
        <Tabs>
          <TabPane label="数据集" :index="1">
            <Form :label-width="150" :label-colon="true" inline @keyup.enter.native="queryAllDataSet">
              <FormItem label="数据集名称">
                <Input type="text" v-model="req.setName" cleabler />
              </FormItem>
              <FormItem label="数据集编码">
                <Input type="text" v-model="req.setCode" cleabler />
              </FormItem>
              <FormItem label="数据源编码">
                <Input type="text" v-model="req.sourceCode" cleabler />
              </FormItem>
            </Form>
            <!-- 数据集表格 -->
            <div class="dataset-table">
              <ul>
                <draggable v-model="setParamListC" :group="{name:'dataset',pull:'clone'}">
                  <li :key="index" v-for="(item,index) in setParamListC">{{item.setName}}</li>
                </draggable>
              </ul>
              <Spin size="large" class="loading" v-if="setParamListC.length==0"></Spin>
              <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
            </div>
            <!-- 数据集拖拽显示的列 -->
            <div class="dataset-draggable">
              <draggable :group="{name:'dataset'}" class="dataset-item" v-model="dataBaseList" chosenClass="item">
                <div v-for="(item,index) in dataBaseList" :key="index">{{item.setName}}</div>
              </draggable>
            </div>
          </TabPane>
          <TabPane label="对应关系" :index="2" v-if="dataSetDataList.length>0">
            <template v-for="(item,index) in dataSetDataList">
              <Form :label-width="80" :label-colon="true" :key="index" inline>
                <FormItem label="数据集1">
                  <Select v-model="dataSetDataList[index].setName" clearable filterable transfer @on-change="setCodeChange(index)">
                    <Option v-for="(dataBaseItem, dataBaseIndex) in dataBaseList" :value="dataBaseItem.setName" :key="dataBaseIndex">
                      {{dataBaseItem.setName}}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem label="类型" :label-width="50">
                  <Select v-model="dataSetDataList[index].type" clearable filterable transfer>
                    <Option v-for="(item, i) in typeList" :value="item.detailName" :key="i">
                      {{ item.detailName }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem label="数据集2">
                  <Input v-model="dataSetDataList[index].setName2" />
                </FormItem>
                <!-- <span style="display:none">{{index = index +2}}</span> -->
              </Form>
            </template>
          </TabPane>
          <TabPane label="关联参数" :index="3" v-if="dataSetDataList.length>0">
            <template v-for="(item,itemIndex) in dataSetDataList">
              <table :key="itemIndex" style="width: 100%;" class="connection-table">
                <tr>
                  <th>{{item.setName}}</th>
                  <th>操作符</th>
                  <th>{{item.setName2}}</th>
                  <th></th>
                </tr>
                <tr v-for="(fieldItem,fieldIndex) in item.field" :key="fieldIndex">
                  <td>
                    <Select v-model="dataSetDataList[itemIndex].field[fieldIndex].field1" clearable filterable transfer>
                      <Option v-for="(item, i) in item.setCodeList" :value="item" :key="i">{{item}}</Option>
                    </Select>
                  </td>
                  <td>
                    <Select v-model="dataSetDataList[itemIndex].field[fieldIndex].operator" clearable filterable transfer>
                      <Option v-for="(item, i) in selectList" :value="item.detailName" :key="i">
                        {{ item.detailName }}
                      </Option>
                    </Select>
                  </td>
                  <td>
                    <Select v-model="dataSetDataList[itemIndex].field[fieldIndex].field2" clearable filterable transfer>
                      <Option v-for="(item, i) in item.setCode2List" :value="item" :key="i">{{item}}</Option>
                    </Select>
                  </td>
                  <td>
                    <Button type="primary" @click.native="addData(itemIndex)" :key="itemIndex+fieldIndex+'B'"> 添加</Button>
                    &nbsp;&nbsp;
                    <Button type="error" @click.native="deleteData(itemIndex,fieldIndex)" :key="itemIndex+fieldIndex+'D'"> 删除</Button>
                  </td>
                </tr>
              </table>
            </template>
          </TabPane>
        </Tabs>
      </div>
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
import { getlistReq as getDataItemReq } from '@/api/system-manager/data-item'

export default {
  name: "excelreport-design",
  components: { draggable },
  data () {
    return {
      dataSet: [],
      setCode: "",
      outerVisible: false,
      reportCode: '',
      draggableFieldLabel: '',//拖拽的文本内容
      sheetData: '',
      tableConfig: { ...this.$config.tableConfig }, // table配置
      req: {
        sourceCode: "", setCode: "", setName: "",
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
      reportExcelDto: {
        id: null,
        jsonStr: "",
        setCodes: "",
        setParam: "",
        reportCode: ""
      },
      dataBaseList: [],//选中数据集列
      dataSetDataList: [],//选中数据集结果集
      dataSetData: [],//数据集
      selectList: [],//操作符下拉
      typeList: [],//连接类型下拉

    };
  },
  watch: {
    dataBaseList () {
      this.dataSetDataList = [];
      this.dataBaseList.forEach((item, index) => {
        if (index + 1 !== this.dataBaseList.length) {
          const { setName, setCode } = this.dataBaseList[index + 1];
          Promise.all([this.detail(item.setCode), this.detail(setCode)]).then(res => {
            console.log(res);
            const obj = {
              setCode: item.setCode,
              setName: item.setName,
              setName2: setName,
              setCode2: setCode,
              setCodeList: res[0].setParamList,
              setCode2List: res[1].setParamList,
              field: !(item?.field || 0) ? [{ field1: "", field2: "", operator: "=" }] : item.field
            }
            this.dataSetDataList[index] = { ...obj };
            this.$nextTick(() => {
              this.dataSetDataList = JSON.parse(JSON.stringify(this.dataSetDataList));
              console.log(this.dataSetDataList, this.dataBaseList);
            })
          })
        }
      })

    },
  },
  computed: {
    setParamListC: {
      get () {
        return [...new Set(this.dataSetData)]
      },
      set () { }
    },
  },
  methods: {
    //拖拽选择的数据集
    addData (index) {
      this.dataSetDataList[index].field.push({ field1: "", field2: "", operator: "=" });
      this.$forceUpdate();
    },
    //删除数据集
    deleteData (index, fieldIndex) {
      //至少要有一个关联数据
      //   if (this.dataSetDataList[index].field.length == 1) {
      //     this.$Message.error("至少有一个关联字段，不可删除！");
      //     return;
      //   }
      //删除指定索引数据集字段
      this.dataSetDataList[index].field.splice(fieldIndex, 1)
    },
    //修改setCode,setCodeList
    setCodeChange (index) {
      //获取setName 对应的setCode
      const setCode = this.dataBaseList.filter(item => item.setName === this.dataSetDataList[index].setName)[0].setCode;
      this.dataSetDataList[index].setCode = setCode;
      //修改setCode 对应的字段集合
      this.detail(setCode).then(res => {
        this.dataSetDataList[index].setCodeList = res.setParamList;
        this.$nextTick(() => {
          this.dataSetDataList = JSON.parse(JSON.stringify(this.dataSetDataList));
        })
      })
    },

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
                this.detail(code).then(res => {
                  this.dataSet.push(res);
                });
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
          },

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
      const { sourceCode, setCode, setName } = this.req;
      let obj = {
        orderField: "setCode", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: { sourceCode, setCode, setName },
      };
      getpagelistReq(obj).then(res => {
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.dataSetData = data || [];
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
        }
      })
    },
    //选择选中的数据集
    async checkDataSet () {
      this.outerVisible = false;
      if (this.dataBaseList.length > 1) {
        this.$Message.warning("一次最多选择一个数据集");
        this.outerVisible = true;
      } else {
        const setCode = this.dataBaseList[0].setCode;
        let data = await this.detail(setCode);
        this.dataSet.push(data);
      }
      console.log(this.dataSetDataList);
    },
    async detail (setCode) {
      const obj = { setCode: setCode };
      return await getDeatilByIdReq(obj).then((res) => {
        if (res.code === 200) {
          const data = res.result;
          //console.log("this.dataSet", data);
          return data;
        }
      });
    },

    // 获取业务数据
    async getDataItemData () {
      this.selectList = await this.getDataItemDetailList("dataSetSymbol"); // 操作符
      this.typeList = await this.getDataItemDetailList("dataSetRelationship"); // 获取站点数据
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
    //预览
    preview () {
      const { href } = this.$router.resolve({
        path: '/bill-design-manage/excelreport-preview',
        query: {
          reportCode: this.reportCode
        }
      });
      window.open(href, '_blank');
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
            const paramName = value.paramName;
            dataSetParam[paramName] = value.sampleItem;
            dataSetParam[paramName + 'required'] = value.requiredFlag;
            dataSetParam[paramName + 'type'] = value.paramType;
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
      } else {
        this.reportExcelDto.id = this.reportId;
        const { code, message } = await modifyExcelReportReq(this.reportExcelDto);
        if (code != 200) {
          this.$Message.error(message);
          return;
        };
        this.$Message.success("更新成功");
      }
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
  created () {
    this.getDataItemData();
    console.log("创建");
    this.$nextTick(() => {
      this.reportCode = this.$route.query.reportCode
      this.design();
    })
  },
};
</script>
 <style src="../../../../public/luckysheet/assets/iconfont/iconfont.css" />
<style>
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
/deep/ .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  overflow: hidden;
  padding-right: 0.5rem;
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
  overflow-x: visible !important;
  .push_btn {
    position: absolute;
    top: 15px;
    right: 13%;
    z-index: 99;
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
    width: 60% !important;
  }
  /deep/.ivu-tabs .ivu-tabs-tabpane {
    overflow: auto;
  }
  .tableTabs {
    min-height: 500px;
    margin-bottom: 0.5rem;
    height: 500px;
    overflow-y: auto;
    .ivu-tabs {
      height: 100%;
    }
    /deep/ .ivu-tabs .ivu-tabs-content-animated {
      height: calc(100% - 2.5rem);
    }
    .dataset-table,
    .dataset-draggable {
      width: 50%;
      display: inline-block;
      float: left;
      height: 90%;
      ul {
        height: calc(100% - 2rem);
        overflow-y: auto;
        li {
          background: #32dd951f;
          padding: 0.5rem;
          width: 90%;
          margin: 0 auto;
          //   color: #1ec0d1;
          margin-bottom: 0.3rem;
        }
      }
      .loading {
        position: absolute;
        top: 50%;
        left: 20%;
      }
    }
  }
  .dataset-item {
    height: 100%;
    background: #32dd951f;
    border-radius: 10px;
    margin-left: 1.5rem;
    div {
      padding: 0.3rem 0.5rem;
      text-align: center;
      line-height: 2rem;
      border: 1px solid #27ce88;
      border-radius: 1rem;
      display: inline-block;
      margin: 0.5rem;
    }
  }
  .connection-table {
    margin: 1rem 0;
    tr {
      margin: 1rem 0;
    }
  }
  tr .ivu-select {
    padding: 0.5rem;
  }
}
/deep/ #luckysheet-row-count-show {
  width: 1.2rem !important;
}
</style>
