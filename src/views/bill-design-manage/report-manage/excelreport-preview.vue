<template>
  <div style="height:100%">
    <div class="layout">
      <Layout>
        <!-- 中间内容excel -->
        <Content class="content">
            <!-- 查询参数 -->
          <div class="params_search">
             <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                      <Form ref="submitReq" :label-width="80" :label-colon="true">
                        <template v-for="item in tableData2" >
                            <span class="title" >{{item.title}}</span>
                            <template v-for="subitem in item.children">
                            <FormItem :label='subitem.name'  :prop='item.name+subitem.name' :rules="subitem.required == 1?  [{ required: true,message:'必填项' }]: [{ required: false }]">
                                <!-- 字符串 -->
                                <Input v-if="subitem.type==='String'" type="text" v-model.trim="subitem.value" clearable @keyup.native.enter="searchClick()"/>
                                <!-- 布尔 true/false/0/1-->
                                <RadioGroup v-else-if="subitem.type==='Boolean'&&['true','false','0','1'].includes(subitem.value)" v-model="subitem.value">
                                <template v-if="['true','false'].includes(subitem.value)">
                                    <Radio label="true">true</Radio>
                                    <Radio label="false">false</Radio>
                                </template>
                                <template v-if="['0','1'].includes(subitem.value)">
                                    <Radio label="0">0</Radio>
                                    <Radio label="1">1</Radio>
                                </template>
                                </RadioGroup>
                                <!-- 数组 -->
                                <Input v-else-if="subitem.type==='Array'" type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model.trim="subitem.value" clearable />
                                <!-- 时间 -->
                                <DatePicker v-else-if="subitem.type==='DateTime'" v-model="subitem.value" transfer type="datetime" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" clearable></DatePicker>
                                <!-- 其余类型 -->
                                <Input v-else v-model.trim="subitem.value" type="text" clearable />
                            </FormItem>
                            </template>
                        </template>
                            <div class="poptip-style-button">
                            <Button @click="resetClick">{{ $t("reset") }}</Button>
                            <Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
                            </div>
                        </Form>
                </div>
            </Poptip>
          </div>
          <!-- 下载 -->
          <div class="push_btn">
            <Tooltip class="item" effect="dark" content="导出excel" placement="bottom-start">
              <Button type="text" @click="download()">
                <Icon type="md-cloud-download" />
              </Button>
            </Tooltip>
          </div>
          <div id="luckysheetpreview" style="margin:0;padding:0;position:absolute;width:100%;height:calc(100% - 60px);left: 0;top: 0;"></div>
          <!-- <div id="luckysheetpreview"></div> -->
          <page-custom class="excel-page" :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.requestCount" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
          <div style="display:none"></div>
        </Content>
      </Layout>
    </div>
  </div>
</template>

<script>
import { getExcelPreviewReq,getParamsReq, exportReq } from '@/api/bill-design-manage/report-manage'
import draggable from "vuedraggable";
import { exportFile, formatDate } from "@/libs/tools";

export default {
  name: "excelreport-preview",
  components: { draggable },
  data () {
    return {
      sheetData: [{ row: 30, column: 26}],//初始化默认显示30行 26列
      tableData2: [],
      searchPoptipModal: false,
      req: {
        reportCode: "",
        setParam: "",
        pageSize: 30, // 每页显示数
        requestCount: 1, // 当前页
        orderField: 'CREATEDATE', // 排序字段
        ascending: false, // 排序类型true升序 false降序
        total: 0, //  总条数
        totalPage: 0, //  总页数,
        sheetIndex: '',//sheet 当前激活索引
        elapsedMilliseconds:0,
        // ...this.$config.pageConfig,
      },
      jsonStr: [], // json数据
      jsonIndex: 0, // json索引
      // 验证实体
      ruleValidate: {}
    };
  },
  methods: {

    // 获取查询参数
    async getParams(){
        const obj = {
            reportCode: this.req.reportCode,
            sheetIndex:"",
        }
      await  getParamsReq(obj).then(res=>{
            if(res.code===200){
                const setParam =JSON.parse( res.result.setParam);
                const setCodes = res.result.setCodes.split("|");
                const setNames = res.result.setNames.split("|");
                // 渲染查询表单
                this.tableData2 = this.getParamsList(setParam,setCodes,setNames);
            }
        })
    },

    async searchClick () {
      this.req.requestCount = 1;  // 点击查询按钮 
      this.pageLoad();
      
    },
    async pageLoad(){
        this.dateFormate();  // 左侧查询参数--时间格式化 
        //左侧查询参数 --必要参数接收
        const arr = this.toObject(this.tableData2);
        this.req.setParam = JSON.stringify(arr);
        this.$Spin.show();
        
        await getExcelPreviewReq(this.req).then(res => {
            if (res.code === 200) { 
                this.jsonStr  = JSON.parse(res.result.jsonStr);           
                this.req = {
                    ...this.req,
                    total: this.jsonStr[this.jsonIndex].total,
                    totalPage: this.jsonStr[this.jsonIndex].pageCount,
                    elapsedMilliseconds: res.elapsedMilliseconds
                }
                // //初始化Excel
                this.sheetData = res.result ===null ? [{}] : this.jsonStr;
                this.createSheet();
            } else {
            this.$Message.error(res.message);
            this.sheetData = [{}];
            //初始化Excel
            this.createSheet();
            }
        }).finally(()=>{   this.searchPoptipModal = false; this.$Spin.hide();})
    },
   
    //初始化表格
    createSheet () {
       window.luckysheet.destroy() //销毁
      const options = {
        container: "luckysheetpreview", // 设定DOM容器的id
        title: "", // 设定表格名称
        lang: "zh", // 设定表格语言
        plugins: ["chart"],
        hook: {
          sheetActivate: (index) => {
            this.jsonStr.forEach((item, itemIndex) => {
              if (item.index === index) {
                this.jsonIndex = itemIndex
              }
            })
            this.req.total = this.jsonStr[this.jsonIndex].total;//总数量
            this.req.totalPage = this.jsonStr[this.jsonIndex].pageCount; //总页数
            this.req.requestCount = 1;//切换sheet 重置起始页
            this.req.sheetIndex = index;
            this.searchClick();
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
            row: 30, //行数
            column: 26, //列数
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
      console.log("this.sheetData",this.sheetData);
      $(function () {
        luckysheet.create(options);
        // console.log(luckysheet.getRangeValue());
      });
    },

     //获取查询参数 并获得参数类型及是否必填
    getParamsList (setParam,setCodes,setNames) {
      const extendObj = setParam;
      const extendArry = [];
      for (const i in extendObj) {
        const children = [];
        for (const y in extendObj[i]) {
          if (!y.endsWith('required') && !y.endsWith('type')) {
            children.push({ name: y, value: extendObj[i][y], type: extendObj[i][y + 'type'], required: extendObj[i][y + 'required'] });
            this.ruleValidate[i + y] = [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }];
          }
        }
        //报表编码的索引,从而获取报表编码的名称
        const index = setCodes.findIndex((item) => {
            return item === i;
        })
        extendArry.push({ name: i, children: children,title:setNames[index] });
      }
      return extendArry;
    },
    // Excel导出
    async download () {
      exportReq(this.req).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = this.req.reportCode + '-' + `${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    //重置
    resetClick(){
        console.log(this.tableData2);
        this.tableData2.map(item=>{
            item.children.map(cItem=>{
                cItem.value = "";
            })
        })
    },
    //时间格式化
    dateFormate () {
      this.tableData2.forEach((item, itemIndex) => {
        item.children.forEach((o, oIndex) => {
          if (o.type === 'DateTime') {
            this.tableData2[itemIndex].children[oIndex].value = formatDate(o.value)
          }
        })
      })
    },
    // 表单封装json
    toObject (val) {
      const objfirst = {}
      const objSecond = {}
      val.forEach(el => {
        el.name ? (objfirst[el.name] = el.children) : ""
      });
      for (const key in objfirst) {
        const newObj = {};
        objfirst[key].map(ev => {
          Object.assign(newObj, { [ev.name]: ev.value, [ev.name + 'required']: ev.required, [ev.name + 'type']: ev.type })
        });
        objSecond[key] = newObj
      }
      return objSecond
    },
    // 选择第几页
    pageChange (index) {
      this.req.requestCount = index
      this.searchClick()
    },
    // 选择一页几条数据
    pageSizeChange (index) {
      this.req.requestCount = 1
      this.req.pageSize = index
      this.searchClick()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.req.reportCode = this.$route.query.reportCode;
      this.tableData2 = [];
      this.getParams();
      this.createSheet ();
    })
  }
}
</script>
 <style src="../../../../public/luckysheet/assets/iconfont/iconfont.css" />
<style>
@import "../../../assets/table.less";
.luckysheet-input-box {
  z-index: 1000;
}

#luckysheet-pivotTableFilter-byvalue-select .ListBox {
  min-height: 150px !important;
}
.luckysheet-modal-controll-btn {
  height: 20px;
  width: 20px;
  padding: 0;
  text-align: center;
  font-size: 0.01rem !important;
}
.ivu-modal-mask,
.ivu-modal-wrap {
  z-index: 910 !important;
}
</style>
<style lang="less" scoped>  
.title {
    width: 100%;
    height: 2rem;
    color: #2369ed;
    text-align: center;
    line-height: 2rem;
  }
.content {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  background-color: #efefef;
  padding: 1rem;
  position: relative;

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
  .params_search{
    position: absolute;
    z-index: 100;
    top: 15px;
    left: 5%;
  }
}

/deep/.ivu-modal-fullscreen .ivu-modal-body {
  width: 100%;
  overflow: auto;
  position: absolute;
  top: 43px;
  bottom: 43px;
  right: 0;
  left: 0;
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
.excel-page {
  width: 98%;
  position: absolute;
  bottom: 20px;
  z-index: 9999;
}
</style>
