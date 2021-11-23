/* 库存目标差异分析图表 */
<template>
  <div :id="'barInventoryTargetVarianceChart' + index" class="chart"></div>
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
      this.chart = echarts.init(
        document.getElementById("barInventoryTargetVarianceChart" + this.index)
      );

      let option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          data: this.data.series.map((o)=>o.name),
        },
        xAxis: {
          type: "category",
          // boundaryGap: false,
          data: this.data.xAxis,
          axisPointer: {
            type: "shadow",
          },
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value} 元",
            },
          },
        ],
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
