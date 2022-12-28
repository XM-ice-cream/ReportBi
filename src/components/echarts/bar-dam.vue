/* Dam点胶柱状图 */
<template>
	<div :id="'barPaymentAnalysis' + index" class="chart"></div>
</template>
<script>
import * as echarts from "echarts";

export default {
	name: "bar-dam",
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
			chart: {},
		};
	},
	methods: {
		initChart() {
			this.chart = echarts.init(document.getElementById("barPaymentAnalysis" + this.index));
			let option = {
				color: ["#9eeab0", "#f9b90b"],
				title: {
					text: this.data.title + " Yield",
				},
				gird: {
					left: "center",
					bottom: 30,
					top: "50%",
					height: "50%",
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross",
						crossStyle: {
							color: "#999",
						},
					},
					formatter: function (datas) {
						var res = datas[0].name + "<br/>";
						for (var i = 0, length = datas.length; i < length; i++) {
							if (datas[i].seriesType === "line") {
								res += datas[i].marker + datas[i].seriesName + "：" + datas[i].data + "%<br/>";
							} else {
								res += datas[i].marker + datas[i].seriesName + "：" + datas[i].data + "<br/>";
							}
						}
						return res;
					},
				},
				legend: {
					data: ["Production Quality", "Yield"],
				},
				xAxis: [
					{
						type: "category",
						data: this.data.xAxisData,
						axisPointer: {
							type: "shadow",
						},
						axisLabel: {
							interval: 0,
							rotate: 8,
						},
					},
				],
				yAxis: [
					{
						type: "value",
						axisLine: {
							show: false,
						},
						axisTick: {
							show: false,
						},
					},
					{
						type: "value",
						axisLabel: {
							formatter: "{value} %",
							showMinLabel: true,
							showMaxLabel: true,
							interval: 0,
						},
						axisLine: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						// max: 100,
						// min: 0,
					},
				],
				series: [
					{
						name: "Production Quality",
						type: "bar",
						label: {
							show: true,
							position: "top",
							color: "#43964b",
						},
						barWidth: 30,
						data: this.data.yAxisData1,
					},
					{
						name: "Yield",
						type: "line",
						label: {
							show: true,
							position: "top",
							formatter: function (data) {
								return data.value + "%";
							},
							color: "orange",
						},
						yAxisIndex: 1,
						data: this.data.yAxisData2,
					},
				],
			};
			// 绘制图表
			this.chart.setOption(option, true);
			window.addEventListener("resize", () => {
				if (this.chart) {
					this.chart.resize(); // 不报错
				}
			});
		},
		getYieldValue(num) {
			const index = this.data.allCountData.findIndex(num);
			if (index === -1) return 0;
			return this.data.defectCountData[index] / num;
		},
	},
	mounted() {
		this.initChart();
	},
};
</script>
<style lang="less" scoped>
.chart {
	width: 98% !important;
	height: 100% !important;
}
</style>
