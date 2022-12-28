<template>
	<div id="barchart" class="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "componentBar",
	data() {
		return {};
	},
	methods: {
		pageLoad() {
			// 基于准备好的dom，初始化echarts实例
			const charts = echarts.init(document.getElementById("barchart"));
			let option = {
				color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "shadow",
					},
				},
				legend: {},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "3%",
					containLabel: true,
				},
				xAxis: {
					type: "category",
					data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
				},
				yAxis: {
					type: "value",
					boundaryGap: [0, 0.01],
				},
				series: [
					{
						name: "2011",
						type: "bar",
						data: [18203, 23489, 29034, 104970, 131744, 630230],
					},
					{
						name: "2012",
						type: "bar",
						data: [19325, 23438, 31000, 121594, 134141, 681807],
					},
					{
						name: "2013",
						type: "bar",
						data: [19320, 23338, 31000, 121594, 154141, 781807],
					},
				],
			};
			charts.setOption(option, true);
			window.addEventListener("resize", function () {
				charts.resize();
			});
		},
	},
	mounted() {
		this.pageLoad();
	},
};
</script>
<style>
.charts {
	height: 100%;
	width: 100%;
}
</style>
