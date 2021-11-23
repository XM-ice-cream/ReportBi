/* OP30看板饼图 */
<template>
  <div :id="'pieChart' + index" class="pieChart"></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "op30-pie",
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
      pieChart: {},
    };
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.pieChart = echarts.init(document.getElementById("pieChart" + this.index));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {d}%",
        },
        series: [
          {
            name: this.$t("state"),
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            label: {
              formatter: '{b}: {d}%',
            },
            data: [
              {
                value: this.data.yieldRate,
                name: '良率',
                itemStyle: {
                  color: "#4BE64B",
                },
              },
              { value: this.data.badRate, name: '不良',}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      // 绘制图表
      this.pieChart.setOption(option, true);
    },
  },
  mounted() {
    this.initChart();
  },
};
</script>
<style lang="less" scoped>
.pieChart {
  width: 100%;
  height: 100%;
}
</style>
