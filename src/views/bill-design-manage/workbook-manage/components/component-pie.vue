<template>
	<div id="piechart" class="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "componentPie",
	data() {
		return {};
	},
	methods: {
		pageLoad() {
			// 基于准备好的dom，初始化echarts实例
			const charts = echarts.init(document.getElementById("piechart"));
			let option = {
				color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
				title: {
					text: "Referer of a Website",
					subtext: "Fake Data",
					left: "center",
				},
				tooltip: {
					trigger: "item",
				},
				legend: {
					orient: "vertical",
					left: "left",
				},
				series: [
					{
						name: "Access From",
						type: "pie",
						radius: "50%",
						data: [
							{ value: 1048, name: "Search Engine" },
							{ value: 735, name: "Direct" },
							{ value: 580, name: "Email" },
							{ value: 484, name: "Union Ads" },
							{ value: 300, name: "Video Ads" },
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
