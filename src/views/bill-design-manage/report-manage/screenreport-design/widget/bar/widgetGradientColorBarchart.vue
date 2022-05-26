<template>
  <div :style="styleObj">
    <v-chart :options="options" autoresize v-if="isShow" />
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "WidgetGradientColorBarchart", //渐变色，参考https://www.makeapie.com/editor.html?c=x0oZWoncE
  components: {},
  props: {
    value: Object,
    ispreview: Boolean,
    visib: Boolean
  },
  data () {
    return {
      options: {
        title: {
          text: "",
          x: "center",
          y: "4%",
          textStyle: {
            color: "#fff",
            fontSize: "22"
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "16"
          }
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'none'
          }
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: "15%",
          right: "3%",
          left: "5%",
          bottom: "12%"
        },
        legend: {
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: {
          type: "value",
          data: [],
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.12)"
            }
          },
          axisLabel: {
            margin: 10,
            color: "#e2e9ff",
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          name: "",
          type: "value",
          data: [],
          axisLabel: {
            formatter: "{value}",
            color: "#e2e9ff"
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "rgba(255,255,255,0)"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.12)"
            }
          }
        },
        series: [
          {
            type: "bar",
            data: [5000, 2600, 1300, 1300, 1250, 1500],
            barWidth: "20px",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0,244,255,1)" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(0,77,167,1)" // 100% 处的颜色
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0,160,221,1)",
                //模糊细数
                shadowBlur: 4
              }
            },
            label: {
              normal: {
                show: true,
                position: ["-10", "-30"],
                distance: 1,
                formatter: "{a|{c}}",
                rich: {
                  a: {
                    fontSize: 15,
                    color: "#fff",
                    align: "center"
                  }
                }
              }
            }
          }
        ]
      },
      optionsStyle: {}, // 样式
      optionsData: {}, // 数据
      optionsSetup: {},
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
        console.log("type", "widget-gradient-color-chart");
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
      this.setOptionsTitle();
      this.setOptionsLegend();
      this.setOptionsMargin();
      this.setOptionsData();
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
          type: "value",
          show: optionsSetup.hideX, // 坐标轴是否显示
          name: optionsSetup.xName, // 坐标轴名称
          data: item,
          nameTextStyle: {
            color: optionsSetup.nameColorX,
            fontSize: optionsSetup.nameFontSizeX
          },
          nameRotate: optionsSetup.textAngle, // 文字角度
          inverse: optionsSetup.reversalX, // 轴反转
          axisLabel: {
            show: true,
            interval: optionsSetup.textInterval, // 文字间隔
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
    },
    // Y轴设置
    setOptionsY (yAxis) {
      const optionsSetup = this.optionsSetup;
      let yAxisData = [];
      let offset = 0;
      yAxis.forEach(item => {
        yAxisData.push({
          type: "value",
          scale: optionsSetup.scale,
          splitNumber: optionsSetup.splitNumber,// 均分
          show: optionsSetup.isShowY, // 坐标轴是否显示
          name: optionsSetup.textNameY, // 坐标轴名称
          data: item,
          nameTextStyle: { // 别名
            color: optionsSetup.nameColorY,
            fontSize: optionsSetup.namefontSizeY
          },
          inverse: optionsSetup.reversalY, // 轴反转
          axisLabel: {
            show: true,
            rotate: optionsSetup.ytextAngle, // 文字角度
            textStyle: {
              color: optionsSetup.colorY, // y轴 坐标文字颜色
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
        })
        offset = offset + optionsSetup.spaceY;;
      })
      this.options.yAxis = yAxisData;
    },
    // 数值设定 or 柱体设置
    setOptionsTop () {
      const optionsSetup = this.optionsSetup;
      const series = this.options.series;
      series.forEach((item, index) => {
        if (series[index].type == "bar") {
          if (optionsSetup.verticalShow) {
            console.log("postion-right");
            series[index].label = {
              show: optionsSetup.isShow,
              position: "right",
              distance: optionsSetup.distance,
              fontSize: optionsSetup.fontSize,
              color: optionsSetup.subTextColor,
              fontWeight: optionsSetup.fontWeight
            }
            series[index].itemStyle = {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0,
                  [
                    {
                      offset: 0,
                      color: optionsSetup.bar0color // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: optionsSetup.bar100color // 100% 处的颜色
                    }
                  ],
                ),
                barBorderRadius: optionsSetup.radius, //圆角
                shadowColor: optionsSetup.shadowColor, // 阴影颜色
                shadowBlur: optionsSetup.shadowBlur //模糊系数
              }
            }
          } else {
            console.log("postion-top");
            series[index].label = {
              show: optionsSetup.isShow,
              position: "top",
              distance: optionsSetup.distance,
              fontSize: optionsSetup.fontSize,
              color: optionsSetup.subTextColor,
              fontWeight: optionsSetup.fontWeight
            }
            series[index].itemStyle = {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                  [
                    {
                      offset: 0,
                      color: optionsSetup.bar0color // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: optionsSetup.bar100color // 100% 处的颜色
                    }
                  ],
                ),
                barBorderRadius: optionsSetup.radius, //圆角
                shadowColor: optionsSetup.shadowColor, // 阴影颜色
                shadowBlur: optionsSetup.shadowBlur //模糊系数
              }
            }
          }
          series[index].barWidth = optionsSetup.maxWidth;
        }
      })

    },
    // tooltip 提示语设置
    setOptionsTooltip () {
      const optionsSetup = this.optionsSetup;
      const tooltip = {
        trigger: "item",
        show: true,
        textStyle: {
          color: optionsSetup.lineColor,
          fontSize: optionsSetup.fontSize
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
      data.then(res => {
        this.renderingFn(optionsSetup, res);
      });
    },
    renderingFn (optionsSetup, val) {
      console.log("val", val);
      //还原x轴，y轴数据
      this.restore();
      optionsSetup.verticalShow ? this.setXData(val, optionsSetup) : this.setYData(val, optionsSetup);
      // 数值设定 or 柱体设置
      this.setOptionsTop();
      console.log(this.options);
    },
    //还原x轴，y轴数据
    restore () {
      this.options = {
        ...this.options,
        xAxis: {
          type: "value",
          data: [],
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.12)"
            }
          },
          axisLabel: {
            margin: 10,
            color: "#e2e9ff",
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          name: "",
          type: "value",
          data: [],
          axisLabel: {
            formatter: "{value}",
            color: "#e2e9ff"
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "rgba(255,255,255,0)"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.12)"
            }
          }
        }
      }
    },
    //X轴数据设定
    setXData (val, optionsSetup) {
      console.log("X轴");
      // 动态多列
      this.setOptionsY(val.xAxis);
      // Y轴-类目类型
      val.xAxis.forEach((item, index) => {
        this.options.yAxis[index].type = "category";
      });
      //设定滚动条
      this.options.dataZoom = [
        {
          type: 'slider',
          yAxisIndex: this.options.yAxis.map((item, index) => index),
          filterMode: 'none',
          start: 0,
          end: optionsSetup.dataZoomEnd
        }
      ];
      //series 数据
      this.options.series = val.series;
      //图例值
      this.options.legend['data'] = val.legend;
    },
    //Y轴数据设定
    setYData (val, optionsSetup) {
      console.log("Y轴");
      // 动态多列
      this.setOptionsX(val.xAxis);
      //x轴--类目类型
      val.xAxis.forEach((item, index) => {
        this.options.xAxis[index].type = "category";
      })
      // 滚动条
      this.options.dataZoom = [
        {
          type: 'slider',
          xAxisIndex: this.options.xAxis.map((item, index) => index),
          filterMode: 'none',
          start: 0,
          end: optionsSetup.dataZoomEnd
        }
      ];
      //series 数据
      this.options.series = val.series;
      //图例值
      this.options.legend['data'] = val.legend;
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
