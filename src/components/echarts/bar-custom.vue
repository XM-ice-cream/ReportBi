/* 柱状图 */
<template>
  <div :id="'barChart' + index" class="barChart"></div>
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
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      barChart: {},
    };
  },
  methods: {
    initChart() {
      let option = {
        title: {
          subtext: this.data.subtext,
          left: "center",
          subtextStyle: {
            color: "#000",
            fontSize: 16,
          },
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.data.xAxisData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            max: this.data.yAxisMax,
          },
        ],
        series: [
          {
            name: "数量",
            type: "bar",
            barWidth: "30%",
            label: {
              show: true,
              position: "top",
            },
            data: this.data.seriesData,
          },
        ],
      };

      // 基于准备好的dom，初始化echarts实例
      this.barChart = echarts.init(document.getElementById("barChart" + this.index));
      // 绘制图表
      this.barChart.setOption(option,true);
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
.barChart {
  width: 100%;
  height: 100%;
}
</style>
