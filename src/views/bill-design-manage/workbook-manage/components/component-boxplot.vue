<template>
	<div id="boxplotchart" class="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "componentBoxplot",
	data() {
		return {};
	},
	methods: {
		pageLoad() {
			// 基于准备好的dom，初始化echarts实例
			const charts = echarts.init(document.getElementById("boxplotchart"));
			let option = {
				color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
				title: [
					{
						text: "Michelson-Morley Experiment",
						left: "center",
					},
					{
						text: "upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR",
						borderColor: "#999",
						borderWidth: 1,
						textStyle: {
							fontWeight: "normal",
							fontSize: 14,
							lineHeight: 20,
						},
						left: "10%",
						top: "90%",
					},
				],
				dataset: [
					{
						// prettier-ignore
						source: [
				        [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
				        [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
				        [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
				        [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
				        [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
				    ],
					},
					{
						transform: {
							type: "boxplot",
							config: { itemNameFormatter: "expr {value}" },
						},
					},
					{
						fromDatasetIndex: 1,
						fromTransformResult: 1,
					},
				],
				tooltip: {
					trigger: "item",
					axisPointer: {
						type: "shadow",
					},
				},
				grid: {
					left: "10%",
					right: "10%",
					bottom: "15%",
				},
				xAxis: {
					type: "category",
					boundaryGap: true,
					nameGap: 30,
					splitArea: {
						show: false,
					},
					splitLine: {
						show: false,
					},
				},
				yAxis: {
					type: "value",
					name: "km/s minus 299,000",
					splitArea: {
						show: true,
					},
				},
				series: [
					{
						name: "boxplot",
						type: "boxplot",
						data: [
							[850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
							[960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
							[880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
							[890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
							[890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870],
						],
					},
					{
						name: "outlier",
						type: "scatter",
						data: [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
					},
				],
			};

			console.log(option);
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
