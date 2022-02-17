/* EncapFill报表柱状图 */
<template>
  <div :id="'barEncapFill' + index" class="chart"></div>
</template>
<script>
import echarts from "echarts";

export default {
  name: 'bar-encap-fill',
  props: {
    index: {
      type: String, // String, Number, Object
      required: false,
      default: "0",
    },
    data: {},
  },
  data() {
    return {
      chart: {},
    };
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("barEncapFill" + this.index));
      let option = {
        color: ["#f3e454", "#f56b08"],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.data.legendData
        },
        xAxis: [
          {
            type: 'category',
            data: this.data.xAxisData,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: this.data.xAxisLabel
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.data.legendData[0],
            min: 0,
            max: Math.max(...this.data.barData),
            // interval: 50,
          },
          {
            type: 'value',
            name: this.data.legendData[1],
            min: Math.min(...this.data.lineData),
            max: Math.max(...this.data.lineData),
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: this.data.legendData[0],
            type: 'bar',
            label: {
              show: true,
            },
            data: this.data.barData
          },
          {
            name: this.data.legendData[1],
            type: 'line',
            label: {
              show: true,
              formatter: params => {
                return `${params.value}%`
              }
            },
            yAxisIndex: 1,
            data: this.data.lineData
          }
        ]
      };
      // 绘制图表
      this.chart.setOption(option, true);
    },
  },
  mounted() {
    this.initChart();
  },
};
</script>
<style lang="less" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
