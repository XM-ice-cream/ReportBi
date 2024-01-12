<!-- 工作簿的操作记录折线图 -->
<template>
	<div :id="'recordLineChart' + index" class="recordLineChart"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "line-record",
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
			recordLineChart: {},
		};
	},
	methods: {
		initChart() {
			// 基于准备好的dom，初始化echarts实例
			this.recordLineChart = echarts.init(document.getElementById("recordLineChart" + this.index));
			let option = {
				grid: {
					left: "5%",
					right: "5%",
					top: "20%",
					bottom: "15%",
					containLabel: true,
				},
				tooltip: {
					trigger: "axis",
					show: true,
				},

				xAxis: [
					{
						type: "category",
						boundaryGap: false,
						axisLabel: {
							fontFamily: "ShiShangZhongHeiJianTi",
						},
						axisLine: {
							show: true,
						},
						axisTick: {
							show: false,
						},
						splitLine: {
							show: false,
						},
						data: this.data.map((item) => item.dateStr),
					},
				],
				yAxis: [
					{
						type: "value",
						name: "",
						axisLabel: {
							formatter: "{value}",
						},
						axisLine: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: "#f3f3f3",
							},
						},
					},
				],
				series: [
					{
						name: "访问次数",
						type: "line",
						symbol: "circle",
						smooth: true,
						symbolSize: 0,
						itemStyle: {
							normal: {
								color: "#27ce88",
								lineStyle: {
									color: "#cee2ec",
									width: 1,
								},
							},
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{
											offset: 0,
											color: "#83e6d0",
										},
										{
											offset: 1,
											color: "#58f4a1",
										},
									],
									false
								),
							},
						},
						data: this.data.map((item) => item.clickCount),
					},
				],
			};
			this.recordLineChart.setOption(option, true);
			window.addEventListener("resize", () => {
				if (this.recordLineChart) {
					this.recordLineChart.resize();
				}
			});
		},
	},
};
</script>
<style lang="less" scoped>
.recordLineChart {
	width: 100%;
	height: 98%;
}
</style>
