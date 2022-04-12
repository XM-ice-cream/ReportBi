<template>
  <div>

    <Modal title="Excel 预览" :mask-closable="false" :closable="true" v-model="visib" fullscreen :z-index='905' :before-close="closeDialog" class="excel">
      <div class="layout">
        <Layout>
          <!-- 左侧 -->
          <Sider hide-trigger class="sider">
            <!-- 数据集管理 -->
            <div class="title">表格查询</div>
            <!-- DBlist -->
            <div class="dblist">
              <Form ref="submitReq" :label-width="80" :label-colon="true">
                <template v-for="(item,index) in tableData2">
                  <span class="title" :key="index">{{item.name}}</span>
                  <template v-for="(subitem,subindex) in item.children">
                    <FormItem :label='subitem.name' :key="item.name+subindex" :prop='item.name+subitem.name' :rules="subitem.required == 1?  [{ required: true,message:'必填项' }]: [{ required: false }]">
                      <Input type="text" v-model.trim="subitem.value" v-if="subitem.type==='String'" clearable />
                      <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model.trim="subitem.value" v-else-if="subitem.type==='Array'" clearable />
                      <DatePicker v-else v-model="subitem.value" transfer type="datetime" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" clearable></DatePicker>
                    </FormItem>
                  </template>
                </template>
                <Button type="primary" @click="searchPreview()" style="width: 100%;">查询</Button>
              </Form>
            </div>
          </Sider>
          <!-- 中间内容excel -->
          <Content class="content">
            <div class="push_btn">
              <Tooltip class="item" effect="dark" content="导出excel" placement="bottom-start">
                <Button type="text" @click="download()">
                  <Icon type="md-cloud-download" />
                </Button>
              </Tooltip>
            </div>
            <div id="luckysheetpreview" style="margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 0px;"></div>
            <div style="display:none"></div>
          </Content>
        </Layout>
      </div>
      <img :src="require('../../../assets/images/loading.gif')" v-if="loading" class="loading-img" />
      <div slot="footer" class="dialog-footer">
        <Button @click="closeDialog">取消</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import { getExcelPreviewReq, exportReq } from '@/api/bill-design-manage/report-manage.js'
import draggable from "vuedraggable";
import { exportFile, formatDate } from "@/libs/tools";
import { getDeatilByIdReq } from "@/api/bill-design-manage/data-set.js";
import { exportExcel } from './export'
export default {
  name: "excelreport-preview",
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
          this.params.reportCode = this.reportCode;
          this.loading = true;
          this.tableData2 = [];
          this.searchPreview();
          window.jQuery.noConflict();
        })
        return;
      }
      // 销毁luckysheet
      window.luckysheet.destroy();

    }
  },
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
      loading: false,
      params: {
        reportCode: "",
        setParam: "",
        requestCount: 1,
        pageSize: 1000 * 10
      },
      requestCountList: [],
      maxInteral: 1,
      finished: 'Loading...',
      // 验证实体
      ruleValidate: {

      }
    };
  },
  methods: {
    async searchPreview () {
      this.dateFormate();
      //重置
      const arr = this.toObject(this.tableData2);
      this.params.setParam = JSON.stringify(arr);
      this.params.requestCount = 1;//初始化请求次数为1
      this.sheetData = [{}];
      this.finished = 'Loading...';
      // console.log(window.luckysheet);
      window.luckysheet.destroy();
      //每次都重新加载需要改成刷新
      this.intervalPreview()

    },
    async intervalPreview (changeIndex) {
      // console.log(133);
      this.loading = true;

      const result = window.luckysheet.getAllSheets().filter(item => item.status === 1)[0];
      let index = '';
      //    console.log('window.luckysheet.getAllSheets())', window.luckysheet.getAllSheets());
      if (result?.index) {
        index = changeIndex ? changeIndex : result.index;
        this.requestCountList[index] = this.requestCountList[index] + 1;
        this.params.requestCount = this.requestCountList[index];
        //  console.log('index', index, changeIndex);
      }
      if (this.params.requestCount > 100) return;
      await getExcelPreviewReq(this.params).then(res => {
        if (res.code == 200) {
          this.loading = false;
          let { setParam, requestCount, pageSize } = this.params;
          const jsonStr_parse = JSON.parse(res.result.jsonStr);
          const setParam_parse = JSON.parse(res.result.setParam);
          //第一次获取请求值
          requestCount === 1 ? this.initExcel(jsonStr_parse, setParam, setParam_parse, res.result) : ''
          //   : this.addExcel(jsonStr_parse, requestCount, pageSize, index)
        } else {
          this.$Message.error(res.message);
          this.sheetData = [{}];
          this.finished = '加载完成！';
          //初始化Excel
          this.createSheet();
        }
      })

    },
    initExcel (jsonStr_parse, setParam, setParam_parse, result) {
      //  console.log('jsonStr_parse', jsonStr_parse);
      //  console.log(window.luckysheet);
      this.reportName = jsonStr_parse.name;
      // 渲染查询表单
      this.tableData2 = this.getParamsList(setParam, setParam_parse);


      let firstPageCount = 0;
      //获取每个sheet 的接口请求次数
      jsonStr_parse.forEach((item, itemIndex) => {
        const { index, pageCount, status } = item;
        this.requestCountList[index + 'count'] = pageCount; //index sheet 总共请求次数
        this.requestCountList[index] = 1//index sheet 当前sheet
        //如果状态为启动 则记录请求次数
        if (status) firstPageCount = pageCount;
      })
      //初始化Excel
      this.sheetData = result == null ? [{}] : jsonStr_parse;
      this.createSheet();
      if (firstPageCount > 1) this.$Message.warning('最大只显示一万笔数据')
      //继续获取excel数据 maxInteral 大于1 继续获取excel值
      //   firstPageCount > 1 ? this.intervalPreview() : this.finished = '加载完成！'
      //   this.finished = '加载完成！'
    },
    async addExcel (jsonStr_parse, requestCount, pageSize, Sheetindex) {
      await jsonStr_parse.forEach((item, index) => {
        if (Sheetindex === item.index) {
          item.celldata.forEach((o, oIndex) => {
            if (!this.visib) return;
            o.r = o.r + (requestCount - 1) * pageSize;
            let options = { order: index };
            // console.log(o.r, o.c, o.v, requestCount, (requestCount - 1) * pageSize, options);
            if (o.c == 0) {
              window.luckysheet.insertRow(o.r, options);
              // console.log('insertRowBottom');
              // window.luckysheet.refresh()
            };
            window.luckysheet.setCellValue(o.r, o.c, o.v, options)
            // console.log(o);


          })
          //   console.log(item.celldata, window.luckysheet.getRangeValue());
          //   const options = { range: 'A12:L22' }
          //   window.luckysheet.setRangeValue([[item.celldata]], options);

        }

      })
      // console.log(jsonStr_parse);
      //   window.luckysheet.updataSheet({ data: jsonStr_parse });
      //刷新
      //   window.luckysheet.refresh();
      //跳出循环--停止获取excel数据
      if (requestCount !== 1 && requestCount >= this.requestCountList[Sheetindex + 'count']) { this.finished = '加载完成！'; return };
      //   if (this.visib) this.intervalPreview();
    },
    getParamsList (setParam, setParam_parse) {
      const extendObj = setParam = setParam_parse;
      const extendArry = [];
      for (const i in extendObj) {
        // console.log(i);
        // getDeatilByIdReq({ setCode: i }).then(res => {
        //   console.log(res);
        //   if(res.code==200){

        //   }
        // })
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
    async download () {
      //刷新
      window.luckysheet.refresh();
      //  console.log('luckysheet.getAllSheets()', luckysheet.getAllSheets());
      exportExcel(luckysheet.getAllSheets(), this.params.reportCode + '-' + `${formatDate(new Date())}`)
      //   const { reportCode, setParam } = this.params
      //   const obj = {
      //     reportCode,
      //     setParam,
      //     requestCount: 1,
      //     pageSize: 1000
      //   };
      //   exportReq(obj).then((res) => {
      //     let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      //     const fileName = reportCode + '-' + `${formatDate(new Date())}.xlsx`; // 自定义文件名
      //     exportFile(blob, fileName);
      //   });
    },

    //初始化表格
    createSheet () {
      const _this = this;
      const options = {
        container: "luckysheetpreview", // 设定DOM容器的id
        title: "", // 设定表格名称
        lang: "zh", // 设定表格语言
        plugins: ["chart"],
        hook: {
          sheetDeactivateAfter: function (index, isPivotInitial, isNewSheet) {
            console.info(index, isPivotInitial, isNewSheet);

          },
          //   scroll: function (position) {
          //     const { scrollTop } = position;
          //     console.log(position.scrollTop, (scrollTop % 60) % 20);
          //     if ((scrollTop % 60) % 20 == 0) {
          //       console.log('123');
          //       const result = window.luckysheet.getAllSheets().filter(item => item.status === 1)[0];
          //       console.log(_this.requestCountList[result.index] >= _this.params.requestCount, _this.params.requestCount);
          //       if (_this.requestCountList[result.index] >= _this.params.requestCount) _this.intervalPreview();
          //     }
          //   }

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
      $(function () {
        luckysheet.create(options);
      });
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
      const objfirst = {};
      const objSecond = {};
      val.forEach(el => {
        el.name ? (objfirst[el.name] = el.children) : "";
      });
      for (const key in objfirst) {
        const newObj = {};
        objfirst[key].map(ev => {
          //  console.log(ev);
          Object.assign(newObj, { [ev.name]: ev.value, [ev.name + 'required']: ev.required, [ev.name + 'type']: ev.type });
        });
        //  console.log('objSecond[key]', newObj);
        objSecond[key] = newObj;
      }
      return objSecond;
    },
    //关闭弹框
    closeDialog () {
      this.$emit('update:visib', false);
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
.sider {
  width: 250px !important;
  min-width: 250px !important;
  max-width: 250px !important;
  flex: 0 0 250px !important;
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
    padding: 0 5px;
    .title {
      width: 100%;
      height: 1.5rem;
      background-color: #efefef;
      text-align: center;
      display: inline-block;
      line-height: 1.5rem;
      color: #666262d9;
      /* margin: 0 auto; */
      /* margin-left: 10%; */
      border-radius: 5px;
      margin-bottom: 1rem;
    }
    .row {
      padding: 0.2rem;
      margin: 0 1.6rem 0.3rem;
    }
  }
}
.content {
  width: calc(100% - 250px);
  height: 100%;
  background-color: #fff;
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
}
.loading-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  //   width: 5rem;
  //   height: 5rem;
  //   background: rgba(0, 0, 0, 0.2);
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
