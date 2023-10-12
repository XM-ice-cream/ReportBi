import {
  getDataReq
} from '@/api/bill-design-manage/report-manage.js'
import { Column } from 'vxe-table'
let queryform = {
  data() {
    return {
      // form select-input key
      selectInput: {
        keyname: '',
        keyword: ''
      },
    }
  },
  computed: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {

    // 把selectInput中的值赋到params查询对象中
    parseParamsBySelectInput(keyname, keyword) {
      if (this.params === undefined || this.params === null) {
        console.warn('query form must bind to params object in vue data')
        return
      }
      // if (!this.params.hasOwnProperty(keyname)) {
      //   console.warn('params has no field:' + keyname)
      //   return
      // }
      if (keyword !== undefined) {
        this.params[keyname] = keyword.trim()
      }
    },
    resetForm(data) {
      let formKeys = Object.keys(data)
      for (let k of formKeys) {
        data[k] = null
      }
    },
    handlerInputchange(val) {
      this.parseParamsBySelectInput(this.selectInput.keyname, val)
    },
    // 查询echarts 数据
    queryEchartsData(params) {
      console.log(params);
      return new Promise(async (resolve) => {
        let {
          code,
          result
        } = await getDataReq(params);
        if (code != 200) return;
        const analysisData = this.analysisChartsData(params, result);
        resolve(analysisData)
      })
    },
    // 解析不同图标的数据
    analysisChartsData(params, data) {
      //console.log(params);
      //console.log(data);
      // widgetLineCompareChart 折线对比图
      // widget-barchart 柱线图、widget-linechart 折线图、 widget-barlinechart 柱线图
      // widget-piechart 饼图、widget-funnel 漏斗图
      // widget-text 文本框
      // widge-table 表格(数据不要转)
      // widget-stackchart 堆叠图
      const chartType = params.chartType;
      if (
        chartType == "widget-barchart" ||
        chartType == "widget-linechart" ||
        chartType == "widget-barlinechart"
      ){
        return this.barOrLineChartFn(data.chartProperties, data.data);
      } else if( chartType == "widget-morebarlinechart"){
        return this.morebarOrLineChartFn(data.chartProperties, data.data);
      }  else if(chartType == "widgetLineCompareChart"){
        return this.LineCompareChartFn(data.chartProperties, data.data);
      }
      else if (
        chartType == "widget-piechart" ||
        chartType == "widget-funnel"
      ) {
        return this.piechartFn(data.chartProperties, data.data);
      } else if (chartType == "widget-text") {
        return this.widgettext(data.chartProperties, data.data)
      } else if (chartType == "widget-plantmap") {
        return this.widgetplantmap(data.chartProperties, data.data)
      } else if (chartType == "widget-stackchart") {
        return this.stackChartFn(data.chartProperties, data.data)
      } else {
        return data
      }
    },
    morebarOrLineChartFn(chartProperties, data) {
      const ananysicData = {};
      let xAxisList = []; //x轴
      const series = [];
      let legend = [];
      let obj = {};
      let dataGroup = [];
      Object.keys(chartProperties).forEach((key) => {
        chartProperties[key].forEach((iitem, iIndex) => {
          if(key === "rows"){
            let arr = data.map(item => item[iitem]);
            xAxisList = this.setUnique(arr);
          } else if (key === "columns" && iIndex === 0) {
            legend = this.setUnique(data.map(item => item[iitem]));
            dataGroup = this.setGroupBy(data, iitem)
          }else {
            dataGroup.forEach((item,index) =>{
              obj = {};
              obj["type"] = "bar";
              obj["name"] = legend[index];
              obj["data"] = this.setUnique(item.map(it => it[iitem]));
              series.push(obj);
            })
          }
        })

      })
      ananysicData["xAxis"] = xAxisList;
      ananysicData["series"] = series;
      ananysicData["legend"] = legend;
      return ananysicData;
    },
    widgetplantmap(chartProperties, data){
      let result = [];
      let plantArr = [];
      let fromField = chartProperties.rows[0];
      let toField = chartProperties.columns[0];
      let dataField = chartProperties.columns[1];
      
      data.forEach(item=>{
        let strArr = [];
        strArr.push({name:item[fromField]});
        strArr.push({name:item[toField],value:item[dataField]});
        plantArr.push(strArr);
      })
      result.push(data[0][fromField]);
      result.push(plantArr);
      return result;
    },
    LineCompareChartFn(chartProperties, data){
      const ananysicData = {};
      const xAxisList = []; //x轴
      const series = [];
      let legend = [];
      let obj = {}; //临时存储series
      let columnIndex = 0;
      Object.keys(chartProperties).forEach((key) => {
        chartProperties[key].forEach((iitem, iIndex) => {
          if (key === "columns") {
            if(columnIndex === 0){
              columnIndex++;
              legend = data.map(item => item[chartProperties[key][iIndex]]);
              legend = Array.from(new Set(legend));
              return;
            }
            legend.forEach(litem =>{
              obj = {};
              obj.name = litem;
              obj.type = "line";
              data.forEach((item, index) => {
                if (!obj["data"]) obj["data"] = []
                if(litem === item[chartProperties[key][0]])
                  obj["data"].push(item[iitem]);
              });
              series.push(obj);
            })
          };
          data.forEach((item, index) => {
            //行
            if (key === "rows") {
              if (!xAxisList[iIndex]) xAxisList[iIndex] = [];
              xAxisList[iIndex].includes(item[iitem]) ? '' : xAxisList[iIndex].push(item[iitem]);
            }
          })
        })

      })
      ananysicData["xAxis"] = xAxisList;
      ananysicData["series"] = series;
      ananysicData["legend"] = legend;
      return ananysicData;
    },
    // 柱状图、折线图、柱线图
    barOrLineChartFn(chartProperties, data) {
      const ananysicData = {};
      const xAxisList = []; //x轴
      const series = [];
      let legend = [];
      let obj = {}; //临时存储series
      Object.keys(chartProperties).forEach((key) => {
        chartProperties[key].forEach((iitem, iIndex) => {
          if (key === "columns") {
            legend = chartProperties[key];
            obj = {};
            obj.name = chartProperties[key][iIndex]
            obj.type = "bar";
          };
          data.forEach((item, index) => {
            //行
            if (key === "rows") {
              if (!xAxisList[iIndex]) xAxisList[iIndex] = [];
              xAxisList[iIndex][index] = item[iitem];
            } else {
              //列
              if (!obj["data"]) obj["data"] = []
              obj["data"][index] = item[iitem];
            }
          })
          if (!(JSON.stringify(obj) === '{}')) series.push(obj)
        })

      })
      ananysicData["xAxis"] = xAxisList;
      ananysicData["series"] = series;
      ananysicData["legend"] = legend;
      return ananysicData;
    },
    //堆叠图
    stackChartFn(chartProperties, data) {
      const ananysicData = {};
      const series = [];
      //x轴字段、y轴字段名
      const xAxisField =chartProperties.rows[0];
      const yAxisField = chartProperties.columns[0];
      const dataField = chartProperties.columns[1];
      //x轴数值去重，y轴去重
      const xAxisList = this.setUnique(data.map(item => item[xAxisField]))
      const yAxisList = this.setUnique(data.map(item => item[yAxisField]))
      const dataGroup = this.setGroupBy(data, yAxisField)

      dataGroup.forEach( (item,index) => {
        // 填充data 默认为0
        const seriesData = new Array(yAxisList.length).fill(0)
        dataGroup[index].forEach(res=> {
          seriesData[xAxisList.indexOf(res[xAxisField])] = res[dataField]
        })

        series.push({
          name: yAxisList[index],
          type: 'line',
          data: seriesData,
        })
      })

      ananysicData["xAxis"] = xAxisList;
      ananysicData["series"] = series;
      return ananysicData;
    },
    // 饼图、漏斗图
    piechartFn(chartProperties, data) {
      //console.log(data);
      const ananysicData = [];
      for (let i = 0; i < data.length; i++) {
        const obj = {};
        let keyword = '';
        let valueFlag = true;
        for (const key in chartProperties) {
          for(const iitem in chartProperties[key]){
            // 行代表的是指
            if (valueFlag && key === "rows") {
              obj['value'] =  data[i][chartProperties[key][iitem]];
              valueFlag = false;
            }
            // 列代表的是维度
            if (key === "columns") {
              keyword += data[i][chartProperties[key][iitem]];
            }
          }
        }
        obj['name'] = keyword;
        // for (const key in chartProperties) {
        //   const value = chartProperties[key];
        //   if (value === "name") {
        //     obj["name"] = data[i][key];
        //   } else {
        //     obj["value"] = data[i][key];
        //   }
        // }
        ananysicData.push(obj);
      }
      return ananysicData;
    },
    widgettext(chartProperties, data) {
      console.log('文本框动态');
      const ananysicData = [];
      for (let i = 0; i < data.length; i++) {
        const obj = {};
        for (const key in chartProperties) {
          const arr = chartProperties[key];
          if(arr.length>0){
            obj["value"] = data[i][arr[0]];
            break;
          }
        }
        ananysicData.push(obj);
      }
      return ananysicData;
    },
    setUnique(arr) {
      let newArr = [];
      arr.forEach(item => {
        return newArr.includes(item) ? '' : newArr.push(item);
      });
      return newArr;
    },
    setGroupBy(array, name) {
      const groups = {}
      array.forEach(function (o) {
        const group = JSON.stringify(o[name])
        groups[group] = groups[group] || []
        groups[group].push(o)
      })
      return Object.keys(groups).map(function (group) {
        return groups[group]
      })
    },
  },
  watch: {
    'selectInput.keyname'(newVal, oldVal) {
      this.resetForm(this.params)
      this.params.currentPage = 1
      this.params.pageSize = 10
      this.parseParamsBySelectInput(newVal, this.selectInput.keyword)
    },
    'selectInput.keyword'(newVal, oldVal) {
      if (!this.selectInput.keyname) return
      this.parseParamsBySelectInput(this.selectInput.keyname, newVal)
    }
    // 'selectInput.keyword'(newVal, oldVal) {
    //   this.parseParamsBySelectInput(this.selectInput.keyname, newVal)
    // }
  }
}

export default {
  mixins: [queryform]
}