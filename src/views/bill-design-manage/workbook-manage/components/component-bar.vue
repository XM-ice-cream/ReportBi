<!-- 柱状图 -->
<template>
	<div id="barchart" class="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "componentBar",
	props: {
		chartData: Object,
	},
	watch: {
		chartData: {
			handler() {
				this.pageLoad();
				// const data = this.$XEUtils.groupBy(data, "tableName");
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {
			myChart: "",
		};
	},

	methods: {
		pageLoad() {
			if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
				this.myChart.dispose();
			}
			// 基于准备好的dom，初始化echarts实例
			this.myChart = echarts.init(document.getElementById("barchart"));

			const _this = this;

			const { xAxis, yAxis, grid, series, groupByString, dataZoom } = this.chartData;

			let option = {
				// color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
				tooltip: {
					trigger: "item",
					axisPointer: {
						type: "shadow",
					},
					formatter: function (params) {
						return _this.$parent.tooltipFormatter([params], groupByString);
					},
					appendToBody: true,
					confine: true,
				},
				legend: {},
				dataZoom: dataZoom,
				grid: grid,
				xAxis: xAxis,
				yAxis: yAxis,
				series: series.map((item) => {
					return { ...item, type: "bar" };
				}),
			};
			this.myChart.setOption(option, true);
			window.addEventListener("resize", function () {
				this.myChart.resize();
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
