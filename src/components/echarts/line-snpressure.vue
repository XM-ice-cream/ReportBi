<template>
  <div id="snPressureChart" class="snPressureChart"></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "line-snpressure",
  props: {
  },

  data () {
    return {
    };
  },
  methods: {
    initChart (data) {
      console.log(data);
      // 基于准备好的dom，初始化echarts实例
      const snPressureChart = echarts.init(document.getElementById("snPressureChart"));
      let option = {
        color: ['#73d2ba', '#ffa811d6', '#fae2ba'],
        title: {
          text: data.sn + ' 压力曲线',
          left: 'center',
          subtext: data.title + '(' + data.subTitle + ')'
        },
        grid: {
          left: 'center',
          width: '90%',
          bottom: '5%',
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#484848',
            interval: 0,
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
        },
        yAxis: {
          name: 'Pa',
          nameTextStyle: {
            color: "#484848"
          },
          type: 'value',
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#484848',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ccc'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
        },
        series: {
          name: 'pa',
          type: 'line',
          data: data.yData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          itemStyle: {
            color: '#F2597F'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(213,72,120,0.8)'
              },
              {
                offset: 1,
                color: 'rgba(213,72,120,0.3)'
              }
            ])
          }
        },
      };
      snPressureChart.setOption(option, true);
      window.addEventListener('resize', () => {
        if (snPressureChart) {
          snPressureChart.resize()   // 不报错
        }
      })
    },
  },
  mounted () {
  },
};
</script>
<style lang="less" scoped>
.snPressureChart {
  width: 100%;
  height: 100%;
}
</style>
