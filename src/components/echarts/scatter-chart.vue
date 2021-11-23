<template>
  <div :id="'scatterChart' + index" class="scatterChart"></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "scatter-chart",
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
      this.chart = echarts.init(document.getElementById("scatterChart" + this.index));
      let option = {
        grid: {
          top: "15%",
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: this.data.tooltip || { trigger: "axis" },
        legend: {
          type: "scroll",
          orient: "horizontal",
          top: 0,
          itemWidth:12,
          data: this.data.legendData,
        },
        xAxis: [{
          type: "category",
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: "#999",
              type: "dashed",
            },
          },
          data: this.data.xData,
        }],
        yAxis: {
          type: "category",
          data: this.data.yData,
        },
        series: this.data.series,
      };
      this.chart.setOption(option, true);
    },
  },
  mounted() {
    this.initChart();
  },
};
</script>
<style lang="less" scoped>
.scatterChart {
  width: 100%;
  height: 100%;
}
</style>
