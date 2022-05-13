import {
    getDataReq
} from '@/api/bill-design-manage/report-manage.js'
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
            return new Promise(async (resolve) => {
                let {
                    code,
                    result
                } = await getDataReq(params);
                if (code != 200) return;
                // result = JSON.parse(result);
                const analysisData = this.analysisChartsData(params, result);
                resolve(analysisData)
            })
        },
        // 解析不同图标的数据
        analysisChartsData(params, data) {
            // widget-barchart 柱线图、widget-linechart 折线图、 widget-barlinechart 柱线图
            // widget-piechart 饼图、widget-funnel 漏斗图
            // widget-text 文本框
            // widge-table 表格(数据不要转)
            // widget-stackchart 堆叠图
            const chartType = params.chartType
            if (
                chartType == "widget-barchart" ||
                chartType == "widget-linechart" ||
                chartType == "widget-barlinechart"
            ) {
                return this.barOrLineChartFn(data.chartProperties, data.data);
            } else if (
                chartType == "widget-piechart" ||
                chartType == "widget-funnel"
            ) {
                return this.piechartFn(params.chartProperties, data);
            } else if (chartType == "widget-text") {
                return this.widgettext(params.chartProperties, data)
            } else if (chartType == "widget-stackchart") {
                return this.stackChartFn(params.chartProperties, data)
            } else {
                return data
            }
        },
        // 柱状图、折线图、柱线图
        barOrLineChartFn(chartProperties, data) {
            // console.log('data', data, chartProperties);
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
                        // console.log(key, iitem, item[iitem]);
                        //行
                        if (key === "rows") {
                            if (!xAxisList[iIndex]) xAxisList[iIndex] = [];
                            xAxisList[iIndex][index] = item[iitem];
                            //   console.log(123, item[iitem], iIndex, index, xAxisList[iIndex][index]);
                        } else {
                            //列
                            if (!obj["data"]) obj["data"] = []
                            obj["data"][index] = item[iitem];
                        }
                    })
                    if (!(JSON.stringify(obj) === '{}')) series.push(obj)
                })

            })
            // for (const key in chartProperties) {
            //     const obj = {};
            //     const seriesData = [];
            //     const value = chartProperties[key];
            //     obj["type"] = value;
            //     obj["name"] = key;
            //     for (let i = 0; i < data.length; i++) {
            //         if (value.startsWith("xAxis")) {
            //             // 代表为x轴
            //             xAxisList[i] = data[i][key];
            //         } else {
            //             // 其他的均为series展示数据
            //             seriesData[i] = data[i][key];
            //         }
            //     }
            //     obj["data"] = seriesData;
            //     if (!obj["type"].startsWith("xAxis")) {
            //         series.push(obj);
            //     }
            // }
            ananysicData["xAxis"] = xAxisList;
            ananysicData["series"] = series;
            ananysicData["legend"] = legend;
            console.log(ananysicData);
            return ananysicData;
        },
        //堆叠图
        stackChartFn(chartProperties, data) {
            const ananysicData = {};
            const series = [];
            //全部字段字典值
            const types = Object.values(chartProperties)
            //x轴字段、y轴字段名
            const xAxisField = Object.keys(chartProperties)[types.indexOf('xAxis')]
            const yAxisField = Object.keys(chartProperties)[types.indexOf('yAxis')]
            const dataField = Object.keys(chartProperties)[types.indexOf('bar')]
            //x轴数值去重，y轴去重
            const xAxisList = this.setUnique(data.map(item => item[xAxisField]))
            const yAxisList = this.setUnique(data.map(item => item[yAxisField]))
            const dataGroup = this.setGroupBy(data, yAxisField)
            for (const key in chartProperties) {
                if (chartProperties[key] !== 'yAxis' && !chartProperties[key].startsWith('xAxis')) {
                    Object.keys(dataGroup).forEach(item => {
                        const data = new Array(yAxisList.length).fill(0)
                        dataGroup[item].forEach(res => {
                            data[xAxisList.indexOf(res[xAxisField])] = res[key]
                        })
                        series.push({
                            name: yAxisList[item],
                            type: chartProperties[key],
                            data: data,
                        })
                    })
                }
            }
            ananysicData["xAxis"] = xAxisList;
            ananysicData["series"] = series;
            return ananysicData;
        },
        // 饼图、漏斗图
        piechartFn(chartProperties, data) {
            const ananysicData = [];
            for (let i = 0; i < data.length; i++) {
                const obj = {};
                for (const key in chartProperties) {
                    const value = chartProperties[key];
                    if (value === "name") {
                        obj["name"] = data[i][key];
                    } else {
                        obj["value"] = data[i][key];
                    }
                }
                ananysicData.push(obj);
            }
            return ananysicData;
        },
        widgettext(chartProperties, data) {
            const ananysicData = [];
            for (let i = 0; i < data.length; i++) {
                const obj = {};
                for (const key in chartProperties) {
                    const value = chartProperties[key];
                    if (value === "name") {} else {
                        obj["value"] = data[i][key];
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