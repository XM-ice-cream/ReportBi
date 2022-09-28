<template>
    <div class="page-style excel-preview">
      <div class="comment">
        <Card :bordered="false" dis-hover class="card-style">
          <div slot="title">
            <Row class="content-top">
                <!-- 查询条件 -->
              <i-col span="6">
                <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
                  <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                    {{ $t("selectQuery") }}
                  </Button>
                  <div class="poptip-style-content" slot="content">
                    <Form ref="submitReq" :label-width="80" :label-colon="true">
                      <template v-for="(item) in tableData2">
                        <template v-for="(subitem,subindex) in item.children" >
                          <FormItem :label='subitem.name'  :prop='item.name+subitem.name' :rules="subitem.required == 1?  [{ required: true,message:'必填项' }]: [{ required: false }]">
                            <!-- 字符串 -->
                            <Input v-if="subitem.type==='String'" type="text" v-model.trim="subitem.value" clearable />
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
                      <FormItem>
                        <Button type="primary" @click="searchPreview(false)">查询</Button>
                      </FormItem>
  
                    </Form>
                  </div>
                </Poptip>
              </i-col>
              <!-- 标题 -->
              <i-col span="12">
                <div class="report-title">{{$route.query.reportName}}</div>
              </i-col>
              <!-- 下载 -->
              <i-col span="6">
                <Icon type="md-cloud-download" @click="download()"/>
              </i-col>
            </Row>
          </div>
          <!-- 表格 -->
          <div class="data-table" :style="{height:(req.height+50)+'px'}">
            <table class='table tableScroll' id='exceltable'>
              <tr v-for="(itemTr,indexTr) in tableHtml" :key="indexTr" style="height:18px">
                <template v-for="(item,index) in itemTr">
                  <td v-if="item&&item.rowspan" :style="item.style" :colspan="item.colspan||1" :rowspan="item.rowspan||1" :key="index">
                    <div :title="item.value" :style="item.divStyle">
                     <template v-if="item.valueType==='image'">
                       <img :src="item.value" />
                     </template> 
                      <template v-else>
                          {{item.value}}
                      </template>
                    </div>
                  </td>
                  <td v-if="!item" :key="index" style="width:75px;height:18px"></td>
                </template>
  
              </tr>
  
            </table>
            <page-custom class="excel-page" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.requestCount" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
          </div>
  
        </Card>
      </div>  
    </div>
  </template>

<script>
import { getExcelPreviewReq,getParamsReq, exportReq } from '@/api/bill-design-manage/report-manage'
import draggable from "vuedraggable";
import { exportFile, formatDate } from "@/libs/tools";
import {  getValueBySetcodePageListUrl } from "@/api/bill-design-manage/data-set.js";

export default {
  name: "excelreport-preview",
  components: { draggable },
  data () {
    return {
      intervalData: '',
      options: {},
      sheet: {},
      sheetData: [],
      reportId: null,
      reportName: null,
      dataSet: null,
      tableData2: [],
      searchPoptipModal: false,
      getValueBySetcodePageListUrl:getValueBySetcodePageListUrl(),
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
        height: "120",//表格高度
        // ...this.$config.pageConfig,
      },
      jsonStr: [], // json数据
      jsonIndex: 0, // json索引
      // 验证实体
      ruleValidate: {},
      searchPoptipModal: false,
      htm: "",
      tdIndex: 0,
      tableHtml: []
    };
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    async searchPreview (flag = true) {

      if (!flag) this.req.requestCount = 1;  // 点击查询按钮

      this.dateFormate();  // 左侧查询参数--时间格式化 

      //左侧查询参数 --必要参数接收
      const arr = this.toObject(this.tableData2)
      this.req.setParam = JSON.stringify(arr)
      this.intervalPreview()  //每次都重新加载需要改成刷新
    },
    async intervalPreview () {
        this.$Spin.show();
      await getExcelPreviewReq(this.req).then(res => {
        if (res.code === 200) {
          let { jsonStr, setParam } = res.result;
          this.jsonStr = JSON.parse(jsonStr);
          // 查询参数
          this.tableData2 = this.getParamsList(this.req.setParam, JSON.parse(setParam));
          this.req = {
            ...this.req,
            total: this.jsonStr[this.jsonIndex].total,
            totalPage: this.jsonStr[this.jsonIndex].pageCount
          }
          // 渲染表格
          this.getTable(this.jsonStr);
        } else {
          this.$Message.error(res.message);
        }
        this.searchPoptipModal = false;
      }).finally(() => (this.$Spin.hide()))

    },
    //获取表格
    getTable (data) {
      if (!data[0].celldata.length) {
        this.$Message.warning("查询结果为空");
        return;
      }
      //   this.htm = "<table class='table tableScroll' id='exceltable'>";
      let { celldata, config, frozen } = data[0];
      this.tableHtml = [];
      // 处理表格单元格样式
      celldata.forEach(item => {
        const { r, c } = item;

        if (!this.tableHtml[r]) this.tableHtml[r] = [];
        if (!this.tableHtml[r][c]) this.tableHtml[r][c] = {};

        const { v, bg, bl, fc, ht, vt, mc, fs,valueType } = item.v; //获取样式
        const { columnlen, rowlen, borderInfo } = config;//边框
        let style = "";
        //   宽高
        let width = columnlen && columnlen[c] ? columnlen[c] : 75;
        let height = rowlen && rowlen[r] ? rowlen[r] : 18;
        //边框
        let border = this.getBorderInfo(borderInfo, r, c);
        // td 样式
        if (bg) style += `background:${bg};`;//背景颜色
        if (bl) style += `font-weight:${bl == 1 ? 'bold' : 'normal'};`; //字体粗细
        if (fc) style += `color:${fc};`;//字体颜色
        if (fs) style += `font-size:${fs}px;`;//文字大小
        if (border) style += `border:${border};`;//边框
        //合并单元格 
        const colspan = `${mc?.cs || 1}`;
        const rowspan = `${mc?.rs || 1}`;
        if (colspan > 1&&rowspan > 1) {
            for (let i = 0; i < colspan; i++) {
                for(let j =0;j<rowspan;j++){
                    if (!this.tableHtml[r+j]) this.tableHtml[r+j] = [];
                    if (!this.tableHtml[r+j][c + i]) this.tableHtml[r+j][c + i] = {};
                    this.tableHtml[r+j][c + i] = { ...this.tableHtml[r][c + i], rowspan: 0};
                }
            }
        }else{
        if (colspan > 1) {
            for (let i = 1; i < colspan; i++) {
                if (!this.tableHtml[r]) this.tableHtml[r] = [];
                if (!this.tableHtml[r][c + i]) this.tableHtml[r][c + i] = {};
                this.tableHtml[r][c + i] = { ...this.tableHtml[r][c + i], rowspan: 0 }
             }
        }
        if (rowspan > 1) {
            for (let i = 1; i < rowspan; i++) {
                if (!this.tableHtml[r + i]) this.tableHtml[r + i] = [];
                if (!this.tableHtml[r + i][c]) this.tableHtml[r + i][c] = {};
                this.tableHtml[r + i][c] = { ...this.tableHtml[r + i][c], rowspan: 0 };
            }
        }
        }
        //td 内部div样式
        let divStyle = `width:${width * colspan}px;height:${height * rowspan}px;`;//宽高
        divStyle += `white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: flex;`;//超出文字省略
        if (ht) divStyle += `justify-content:${ ht == 0 ? 'center' : (ht == 2 ? 'right' : 'left')};`;//水平居中 0:居中;1:居左;2:居右
        if (vt) divStyle += `align-items:${ vt == 0 ? 'center' : (vt == 2 ? 'right' : 'left')};;`;//垂直居中
        this.tableHtml[r][c] = { style, colspan, rowspan, divStyle,valueType, value: v };
      })
    },
    //获取查询参数 并获得参数类型及是否必填
    getParamsList (setParam, setParam_parse) {
      const extendObj = setParam = setParam_parse;
      const extendArry = [];
      for (const i in extendObj) {
        const children = [];
        for (const y in extendObj[i]) {
          if (!y.endsWith('required') && !y.endsWith('type')) {
            children.push({ name: y, value: extendObj[i][y], type: extendObj[i][y + 'type'], required: extendObj[i][y + 'required'] });
            this.ruleValidate[i + y] = [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }];
          }
        }
        extendArry.push({ name: i, children: children });
      }
      return extendArry;
    },
    // 获取边框
    getBorderInfo (borderInfo, r, c) {
      let border = "none";
      borderInfo?.forEach((borderItem, borderIndex) => {
        const { borderType, color, range, rangeType } = borderItem;
        if (rangeType === "range" && range[0]) {
          //   console.log(range[0]);
          //列号在范围内
          const columnRang = (range[0].column[0] <= c) && (range[0].column[1] >= c);
          //行号在范围内
          const rowRang = (range[0].row[0] <= r) && (range[0].row[1] >= r);
          if (borderType === "border-all" && columnRang && rowRang) {
            border = `1px solid ${color}`;
          }
          if (borderType === "border-none" && columnRang && rowRang) {
            border = "none";
          }
        }
      })
      return border;
    },
    // Excel导出
    async download () {
      exportReq(this.req).then((res) => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const fileName = this.req.reportCode + '-' + `${formatDate(new Date())}.xlsx`; // 自定义文件名
        exportFile(blob, fileName);
      });
    },
    //时间格式化
    dateFormate () {
       let flag=false;
      this.tableData2.map(item => {
        item.children.map((o ,index)=> {
          if (o.type === 'DateTime') {
            o.value = formatDate(o.value);
            if(item.children[index -1]?.type==='DateTime') {
               const preTime =  item.children[index-1].value;
               const diff = new Date(o.value).getTime() - new Date(preTime).getTime();
               const day = Math.floor(diff/(24*3600*1000));
               if(day > item.children[index-1].paramAstrict){
                  flag = true;
               }
            }
          }
        })
      })
      return flag;
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
    // 自动改变表格高度
    autoSize () {
      this.req.height = document.body.clientHeight - 120;
    },
    // 选择第几页
    pageChange (index) {
      this.req.requestCount = index
      this.searchPreview()
    },
    // 选择一页几条数据
    pageSizeChange (index) {
      this.req.requestCount = 1
      this.req.pageSize = index
      this.searchPreview()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.req.reportCode = this.$route.query.reportCode;
      document.title =  this.$route.query.reportName
      this.tableData2 = [];
      this.searchPreview();
      this.autoSize();
      window.addEventListener('resize', () => this.autoSize());
      window.addEventListener('resize', () => this.getTable("excelpreview", this.jsonStr))
      // 解决Jquery 版本冲突问题
      //   window.jQuery.noConflict();
    })
  },
}
</script>
<style>
@import "../../../assets/table.less";
.excel-preview .card-style {
  padding: 1rem;
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
  padding: 1rem 2rem;
  position: relative;

  .push_btn {
    position: absolute;
    z-index: 100;
    top: 15px;
    right: 1%;
  }
  .req_search{
    position: absolute;
    z-index: 100;
    top: 15px;
    left: 2%;
  }
}
.content-top{
    .report-title{
        font-size: 1.14rem;
        margin: 0 auto;
        font-weight: 600;
        text-align: center;
        position: absolute;
        z-index: 100;
        left: 40%;
    }
    i{
        color: #6c6666;
        font-size: 1.62rem;
        margin-right: 0.3rem;
        float: right;
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
.tableModal {
  /deep/ .ivu-modal {
    width: 600px !important;
  }
}
.excel-page {
  //   width: 98%;
  position: absolute;
  bottom: 8px;
  z-index: 9999;
}
</style>
