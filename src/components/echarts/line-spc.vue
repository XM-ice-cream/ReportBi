<template>
  <div :id="'spcLineChart' + index" class="spcLineChart"></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "line-spc",
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
      spcLineChart: {},
    };
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.spcLineChart = echarts.init(document.getElementById("spcLineChart" + this.index));
      let option = {
        grid: {
          top: "5%",
          left: "3%",
          right: "11%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          data: this.data.xData,
        },
        yAxis: {
          scale: true,
          min: (this.data.minValue - (this.data.centerline - this.data.minValue) * 0.2).toFixed(2),
          max: (this.data.maxValue + (this.data.maxValue - this.data.centerline) * 0.2).toFixed(2),
          splitLine: {
            show: false,
          },
          // splitNumber:10
        },
        series: {
          type: "line",
          symbol: "none",
          // smooth: true,
          data: this.data.data,
          lineStyle: {
            width: 1,
            color: "#9933CC",
          },
          markLine: {
            symbol: ["none", "none"],
            silent: true,
            data: [
              {
                yAxis: this.data.lsl,
                itemStyle: {
                  normal: { color: "red" },
                },
              },
              {
                yAxis: this.data.lcl,
                itemStyle: {
                  normal: { color: "#00BFFF" },
                },
              },
              {
                yAxis: this.data.centerline,
                itemStyle: {
                  normal: { color: "#006600" },
                },
              },
              {
                yAxis: this.data.ucl,
                itemStyle: {
                  normal: { color: "#00BFFF" },
                },
              },
              {
                yAxis: this.data.usl,
                itemStyle: {
                  normal: { color: "red" },
                },
              },
            ],
          },
        },
      };
      this.spcLineChart.setOption(option, true);
    },
  },
  mounted() {
    this.initChart();
  },
};
</script>
<style lang="less" scoped>
.spcLineChart {
  width: 100%;
  height: 100%;
}
</style>
