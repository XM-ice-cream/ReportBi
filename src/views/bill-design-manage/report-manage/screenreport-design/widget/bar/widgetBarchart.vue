<template>
  <div :style="styleObj">
    <v-chart :options="options" autoresize v-if="isShow" />
  </div>
</template>

<script>
export default {
  name: "WidgetBarchart",
  components: {},
  props: {
    value: Object,
    ispreview: Boolean,
    visib: Boolean
  },
  data () {
    return {
      options: {
        grid: {},
        legend: {
          textStyle: {
            color: "#fff"
          }
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'none'
          }
        ],
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "value",
          data: [],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            data: [],
            type: "bar",
            barGap: "30%",
            itemStyle: {
              borderRadius: null
            },
            label: {
              show: true,
              position: "top"
            }
          }
        ]
      },
      optionsStyle: {}, // 样式
      optionsData: {}, // 数据
      optionsSetup: {},
      flagInter: null,
      isShow: false,//是否显示图表
    };
  },
  computed: {
    styleObj () {
      return {
        position: this.ispreview ? "absolute" : "static",
        width: this.optionsStyle.width + "px",
        height: this.optionsStyle.height + "px",
        left: this.optionsStyle.left + "px",
        top: this.optionsStyle.top + "px",
        background: this.optionsSetup.background
      };
    }
  },
  watch: {
    value: {
      handler (val) {
        this.optionsStyle = val.position;
        this.optionsData = val.data;
        this.optionsCollapse = val.setup;
        this.optionsSetup = val.setup;
        this.editorOptions();
      },
      deep: true
    },
    visib () {
      if (!this.visib) {
        clearInterval(this.flagInter)
      }
    },
  },
  mounted () {
    this.optionsStyle = this.value.position;
    this.optionsData = this.value.data;
    this.optionsCollapse = this.value.setup;
    this.optionsSetup = this.value.setup;
    this.editorOptions();
  },
  methods: {
    // 修改图标options属性
    editorOptions () {
      this.isShow = false;
      this.setOptionsData();
      this.setOptionsTitle();
      this.setOptionsTooltip();
      this.setOptionsMargin();
      this.setOptionsLegend();
      this.setOptionsColor();
      this.$nextTick(() => {
        this.isShow = true;
      })

    },
    // 标题修改
    setOptionsTitle () {
      const optionsSetup = this.optionsSetup;
      const title = {};
      title.text = optionsSetup.titleText;
      title.show = optionsSetup.isNoTitle;
      title.left = optionsSetup.textAlign;
      title.textStyle = {
        color: optionsSetup.textColor,
        fontSize: optionsSetup.textFontSize,
        fontWeight: optionsSetup.textFontWeight
      };
      title.subtext = optionsSetup.subText;
      title.subtextStyle = {
        color: optionsSetup.subTextColor,
        fontWeight: optionsSetup.subTextFontWeight,
        fontSize: optionsSetup.subTextFontSize
      };

      this.options.title = title;
    },
    // X轴设置
    setOptionsX (xAxis) {
      const optionsSetup = this.optionsSetup;
      let xAxisData = [];
      let offset = 0;
      console.log(xAxis);

      xAxis?.forEach(item => {
        xAxisData.push({
          type: "category",
          show: optionsSetup.hideX, // 坐标轴是否显示
          name: optionsSetup.xName, // 坐标轴名称
          data: item,
          nameTextStyle: {
            color: optionsSetup.xNameColor,
            fontSize: optionsSetup.xNameFontSize
          },
          nameRotate: optionsSetup.textAngle, // 文字角度
          inverse: optionsSetup.reversalX, // 轴反转
          axisLabel: {
            show: true,
            interval: optionsSetup.textInterval, // 文字角度
            rotate: optionsSetup.textAngle, // 文字角度
            textStyle: {
              color: optionsSetup.Xcolor, // x轴 坐标文字颜色
              fontSize: optionsSetup.fontSizeX
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: optionsSetup.lineColorX
            }
          },
          splitLine: {
            show: optionsSetup.isShowSplitLineX,
            lineStyle: {
              color: optionsSetup.splitLineColorX
            }
          },
          position: "bottom",
          offset
        })
        offset = offset + optionsSetup.spaceX;
      })
      this.options.xAxis = xAxisData;
      console.log("this.options.xAxis", this.options.xAxis);
    },
    // Y轴设置
    setOptionsY (yAxis) {
      const optionsSetup = this.optionsSetup;
      let yAxisData = [];
      let offset = 0;
      yAxis.forEach(item => {
        yAxisData.push(
          {
            type: "value",
            scale: optionsSetup.scale,
            splitNumber: optionsSetup.splitNumber,// 均分
            show: optionsSetup.isShowY, // 坐标轴是否显示
            name: optionsSetup.textNameY, // 坐标轴名称
            data: item,
            nameTextStyle: {
              color: optionsSetup.nameColorY,
              fontSize: optionsSetup.nameFontSizeY
            },
            inverse: optionsSetup.reversalY, // 轴反转
            axisLabel: {
              show: true,
              rotate: optionsSetup.ytextAngle, // 文字角度
              textStyle: {
                color: optionsSetup.colorY, // x轴 坐标文字颜色
                fontSize: optionsSetup.fontSizeY
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: optionsSetup.lineColorY
              }
            },
            splitLine: {
              show: optionsSetup.isShowSplitLineY,
              lineStyle: {
                color: optionsSetup.splitLineColorY
              }
            },
            position: "left",
            offset,
          }
        )
        offset = offset + optionsSetup.spaceY;;
      })

      this.options.yAxis = yAxisData;
    },
    // 数值设定 or 柱体设置
    setOptionsTop () {
      const optionsSetup = this.optionsSetup;
      const series = this.options.series;
      //  console.log(this.options.series);
      series.forEach((item, index) => {
        if (optionsSetup.verticalShow) {
          series[index].label = {
            show: optionsSetup.isShow,
            position: 'right',
            distance: optionsSetup.distance,
            textStyle: {
              fontSize: optionsSetup.fontSize,
              color: optionsSetup.subTextColor,
              fontWeight: optionsSetup.fontWeight
            }
          }
        } else {
          series[index].label = {
            show: optionsSetup.isShow,
            position: "top",
            distance: optionsSetup.distance,
            fontSize: optionsSetup.fontSize,
            color: optionsSetup.subTextColor,
            fontWeight: optionsSetup.fontWeight
          }

        }
        series[index].barWidth = optionsSetup.maxWidth;
        series[index].barMinHeight = optionsSetup.minHeight;
      })
      //  console.log(this.options.series);
    },
    // tooltip 设置
    setOptionsTooltip () {
      const optionsSetup = this.optionsSetup;
      const tooltip = {
        trigger: "item",
        show: true,
        textStyle: {
          color: optionsSetup.lineColor,
          fontSize: optionsSetup.tipFontSize
        }
      };
      this.options.tooltip = tooltip;
    },
    // 边距设置
    setOptionsMargin () {
      const optionsSetup = this.optionsSetup;
      const grid = {
        left: optionsSetup.marginLeft,
        right: optionsSetup.marginRight,
        bottom: optionsSetup.marginBottom,
        top: optionsSetup.marginTop,
        containLabel: true
      };
      this.options.grid = grid;
    },
    // 图例操作 legend
    setOptionsLegend () {
      const optionsSetup = this.optionsSetup;
      const legend = this.options.legend;
      legend.show = optionsSetup.isShowLegend;
      legend.left = optionsSetup.lateralPosition;
      legend.right = optionsSetup.lateralPosition;
      legend.top = optionsSetup.longitudinalPosition;
      legend.bottom =
        optionsSetup.longitudinalPosition;
      legend.orient = optionsSetup.layoutFront;
      legend.textStyle = {
        color: optionsSetup.lengedColor,
        fontSize: optionsSetup.fontSize
      };
      legend.itemWidth = optionsSetup.lengedWidth;
    },
    // 图例名称设置
    setOptionsLegendName (name) {
      const optionsSetup = this.optionsSetup;
      const series = this.options.series;
      const legendName = optionsSetup.legendName;
      // 图例没有手动写则显示原值，写了则显示新值
      if (null == legendName || legendName == '') {
        for (let i = 0; i < name.length; i++) {
          series[i].name = name[i];
        }
        this.options.legend['data'] = name;
      } else {
        const arr = legendName.split('|');
        for (let i = 0; i < arr.length; i++) {
          series[i].name = arr[i];
        }
        this.options.legend['data'] = arr
      }
    },
    // 图例颜色修改
    setOptionsColor () {
      const optionsSetup = this.optionsSetup;
      const customColor = optionsSetup.customColor;
      if (!customColor) return;
      const arrColor = [];
      customColor.forEach((item) => {
        arrColor.push(item.color);
      })
      this.options.color = arrColor;
    },
    // 数据解析
    setOptionsData () {
      const optionsSetup = this.optionsSetup;
      const optionsData = this.optionsData; // 数据类型 静态 or 动态
      optionsData.dataType == "staticData"
        ? this.staticDataFn(optionsData.staticData)
        : this.dynamicDataFn(
          optionsData.dynamicData,
          optionsData.refreshTime,
          optionsSetup
        );
      //  console.log('optionsData.staticData', optionsData.staticData, optionsData.dynamicData);
    },
    // 静态数据
    staticDataFn (val) {
      const optionsSetup = this.optionsSetup;
      const series = this.options.series;
      let axis = [];
      let data = [];
      for (const i in val) {
        axis[i] = val[i].axis;
        data[i] = val[i].data
      }
      // x轴
      if (optionsSetup.verticalShow) {
        this.options.xAxis.data = [];
        this.options.yAxis.data = axis;
        this.options.xAxis.type = "value";
        this.options.yAxis.type = "category";
      } else {
        this.options.xAxis.data = axis;
        this.options.yAxis.data = [];
        this.options.xAxis.type = "category";
        this.options.yAxis.type = "value";
      }
      if (series[0].type == "bar") {
        series[0].data = data;
      }
      const legendName = [];
      legendName.push('销售量')
      this.options.legend['data'] = legendName;
      this.setOptionsLegendName(legendName);
    },
    // 动态数据
    dynamicDataFn (val, refreshTime, optionsSetup) {
      if (!val) return;
      if (this.ispreview) {
        this.getEchartData(val, optionsSetup);
        this.flagInter = setInterval(() => {
          this.getEchartData(val, optionsSetup);
        }, refreshTime);
      } else {
        this.getEchartData(val, optionsSetup);
      }
    },
    getEchartData (val, optionsSetup) {
      const data = this.queryEchartsData(val);
      // console.log(data);
      data.then(res => {
        // console.log(res);
        this.renderingFn(optionsSetup, res);
      });
    },
    renderingFn (optionsSetup, val) {
      //如果均为字符串，显示表格
      //   if (val.value) {
      //     return;
      //   }
      //还原x轴，y轴数据
      this.options = {
        ...this.options, xAxis: {
          type: "value",
          data: [],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "value",
          data: [],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff"
            }
          }
        }
      }
      // x轴 
      if (optionsSetup.verticalShow) {
        this.setOptionsY(val.xAxis);
        val.xAxis.forEach((item, index) => {
          this.options.yAxis[index].type = "category";
        });
        this.options.series = val.series;
        console.log(this.options, "X轴");
        this.options.dataZoom = [
          {
            type: 'slider',
            yAxisIndex: this.options.yAxis.map((item, index) => index),
            filterMode: 'none',
            start: 0,
            end: optionsSetup.dataZoomEnd
          }
        ];
      } else {
        this.setOptionsX(val.xAxis);
        console.log(val.yAxis);
        val.xAxis.forEach((item, index) => {
          this.options.xAxis[index].type = "category";
        })
        this.options.series = val.series;
        console.log(this.options, "Y轴");
        this.options.dataZoom = [
          {
            type: 'slider',
            xAxisIndex: this.options.xAxis.map((item, index) => index),
            filterMode: 'none',
            start: 0,
            end: optionsSetup.dataZoomEnd
          }
        ];
      }
      console.log(this.isShow);
      //图例值
      this.options.legend['data'] = val.legend;
      // 数值设定 or 柱体设置
      this.setOptionsTop();
      console.log(this.options);
    }
  }
};
</script>

<style scoped lang="less">
.echarts {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
