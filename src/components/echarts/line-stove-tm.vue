<template>
  <div :id="'lineChart' + index" class="lineChart"></div>
</template>
<script>
import echarts from "echarts";
export default {
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
      lineChart: {},
    };
  },
  methods: {
    initChart() {
      let option = {
        tooltip: {
          trigger: "axis",
          //  formatter: "{value} ℃",
        },
        grid: {
          top: "3%",
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          data: this.data.xData.map((str) => {
            return str.replace(" ", "\n");
          }),
          axisLabel: {
            interval: 49, //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
          },
        },
        yAxis: {
          axisLabel: {
            formatter: "{value} ℃",
          },
        },
        series: [],
      };
      let seriesOption = {
        type: "line",
      };
      for (let index = 0; index < this.data.series.length; index++) {
        this.data.series[index] = { ...this.data.series[index], ...seriesOption, symbol: "none" };
      }
      option.series = this.data.series;
      // 基于准备好的dom，初始化echarts实例
      this.lineChart = echarts.init(document.getElementById("lineChart" + this.index));
      // 绘制图表
      this.lineChart.setOption(option, true);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
};
</script>
<style lang="less" scoped>
.lineChart {
  width: 100%;
  height: 100%;
}
</style>
