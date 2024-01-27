<!-- 新建模型趋势图 -->
<template>
	<div :id="'modelLineChart' + index" class="modelLineChart"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "line-new-model",
	props: {
		index: {
			type: String, // String, Number, Object
			required: false,
			default: "0",
		},
		data: {
			type: Array,
			default: () => [],
		},
	},

	data() {
		return {
			modelLineChart: {},
		};
	},
	methods: {
		initChart() {
			// 基于准备好的dom，初始化echarts实例
			this.modelLineChart = echarts.init(document.getElementById("modelLineChart" + this.index));
			let option = {
				color: ["#1f56d5"],
				grid: {
					bottom: 1,
					top: 10,
					left: 0,
					rigth: 0,
				},
				xAxis: {
					type: "category",
					data: this.data.map((item) => item.dateStr),
					show: false,
				},
				yAxis: {
					type: "value",
					show: false,
				},
				series: [
					{
						data: this.data.map((item) => item.clickCount),
						type: "line",
						showSymbol: false,
						smooth: true,
					},
				],
			};
			this.modelLineChart.setOption(option, true);
      console.log("option",option)
			window.addEventListener("resize", () => {
				if (this.modelLineChart) {
					this.modelLineChart.resize();
				}
			});
		},
	},
	mounted() {
		this.initChart();
	},
};
</script>
<style lang="less" scoped>
.modelLineChart {
	width: 100%;
	height: 98%;
}
</style>
