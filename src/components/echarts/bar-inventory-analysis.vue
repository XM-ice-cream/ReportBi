/* 库存目标差异分析图表 */
<template>
  <div :id="'barPaymentAnalysis' + index" class="chart"></div>
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
      chart: {},
    };
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("barPaymentAnalysis" + this.index));
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          data: this.data.series.map((o) => o.name),
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: this.data.xAxis,
        },
        series: this.data.series,
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
