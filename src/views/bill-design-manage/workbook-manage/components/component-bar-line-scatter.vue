<!-- 柱状图 -->
<template>
	<div id="barchart" class="charts" ref="barchart"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "componentBar",
	props: {
		chartData: Object,
	},
	data() {
		return {};
	},

	methods: {
		pageLoad() {
			// 基于准备好的dom，初始化echarts实例
			let myChart = echarts.init(this.$el);
			const _this = this;
			let seriesResult = [];

			const { xAxis, yAxis, grid, series, groupByString, dataZoom, legend } = this.chartData;

			//series 根据颜色类别 分类
			series.forEach((item) => {
				let temp = {};
				item.data.forEach((data) => {
					const { name } = data;
					if (!temp[name]) temp[name] = [];
					temp[name].push(data);
				});
				Object.keys(temp).forEach((tempKey) => {
					seriesResult.push({ ...item, data: temp[tempKey], name: tempKey });
				});
			});

			let option = {
				// color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
				tooltip: {
					trigger: "item",
					axisPointer: {
						type: "shadow",
					},
					formatter: function (params) {
						return _this.$parent.tooltipFormatter(params, groupByString);
					},
					appendToBody: true,
					confine: true,
				},
				// type: "scroll" 图例滚动的关键
				legend: { type: "scroll", width: "50%", itemWidth: 14, data: legend },
				dataZoom: dataZoom,
				grid: grid,
				xAxis: xAxis,
				yAxis: yAxis,
				series: seriesResult,
			};
			myChart.setOption(option, true);
			window.addEventListener("resize", function () {
				if (myChart) {
					myChart.resize();
				}
			});
		},
	},
	mounted() {
		// this.$nextTick(() => {
		// 	this.pageLoad();
		// });
	},
};
</script>
<style>
.charts {
	height: 100%;
	width: 100%;
}
</style>
