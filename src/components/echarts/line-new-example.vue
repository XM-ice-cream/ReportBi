<!-- 新建模板趋势图 -->
<template>
	<div :id="'examplelLineChart' + index" class="examplelLineChart"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "line-new-example",
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
			examplelLineChart: {},
		};
	},
	methods: {
		initChart() {
			// 基于准备好的dom，初始化echarts实例
			this.examplelLineChart = echarts.init(document.getElementById("examplelLineChart" + this.index));
			let option = {
				color: ["#f06161"],
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
			this.examplelLineChart.setOption(option, true);
			window.addEventListener("resize", () => {
				if (this.examplelLineChart) {
					this.examplelLineChart.resize();
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
.examplelLineChart {
	width: 100%;
	height: 98%;
}
</style>
