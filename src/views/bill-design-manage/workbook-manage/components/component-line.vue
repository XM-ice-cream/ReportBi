<template>
	<div id="linechart" class="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "componentLine",
	data() {
		return {};
	},
	methods: {
		pageLoad() {
			// 基于准备好的dom，初始化echarts实例
			const charts = echarts.init(document.getElementById("linechart"));
			let option = {
				color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
				tooltip: {
					trigger: "axis",
				},
				legend: {
					data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
				},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "3%",
					containLabel: true,
				},
				toolbox: {
					feature: {
						saveAsImage: {},
					},
				},
				xAxis: {
					type: "category",
					boundaryGap: false,
					data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				},
				yAxis: {
					type: "value",
				},
				series: [
					{
						name: "Email",
						type: "line",
						stack: "Total",
						data: [120, 132, 101, 134, 90, 230, 210],
					},
					{
						name: "Union Ads",
						type: "line",
						stack: "Total",
						data: [220, 182, 191, 234, 290, 330, 310],
					},
					{
						name: "Video Ads",
						type: "line",
						stack: "Total",
						data: [150, 232, 201, 154, 190, 330, 410],
					},
					{
						name: "Direct",
						type: "line",
						stack: "Total",
						data: [320, 332, 301, 334, 390, 330, 320],
					},
					{
						name: "Search Engine",
						type: "line",
						stack: "Total",
						data: [820, 932, 901, 934, 1290, 1330, 1320],
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
