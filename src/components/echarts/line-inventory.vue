<template>
  <div :id="'lineInventoryChart' + index" class="chart"></div>
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
      this.chart = echarts.init(document.getElementById("lineInventoryChart" + this.index));
      this.data.series.map((item) => {
        item.name = "金额";
        item.type = "line";
        item.label = {
          normal: {
            show: true,
            position: "top",
          },
        };
      });
      let option = {
        grid: {
          top: "3%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.data.xAxis,
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
