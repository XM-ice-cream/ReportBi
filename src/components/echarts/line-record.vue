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
		data: {},
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
					right: "10%",
					top: "20%",
					bottom: "15%",
					containLabel: true,
				},
				tooltip: {
					show: true,
					trigger: "item",
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
						data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
					},
				],
				yAxis: [
					{
						type: "value",
						name: "",
						axisLabel: {
							formatter: "{value}",
							textStyle: {
								fontFamily: "ShiShangZhongHeiJianTi",
							},
						},
						axisLine: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						splitLine: {
							show: true,
						},
					},
				],
				series: [
					{
						type: "line",
						symbol: "circle",
						symbolSize: 0,

						itemStyle: {
							normal: {
								color: "#27ce88",
								lineStyle: {
									color: "#27ce88",
									width: 2,
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
											color: "rgba(39, 206, 136,0.3)",
										},
										{
											offset: 0.9,
											color: "rgba(39, 206, 136,0)",
										},
									],
									false
								),
							},
						},
						data: [220, 182, 191, 234, 290, 330, 410, 301, 254, 290, 330, 410],
						markPoint: {
							label: {
								show: true,
								position: "top",
								distance: 10,
								offset: [1, 1],
								lineHeight: 20,
								backgroundColor: "#27ce88",
								borderRadius: 5,
								borderColor: "#27ce88",
								borderWidth: "1",
								padding: [5, 15, 4],
								color: "#fff",
								fontSize: 14,
								fontWeight: "normal",
							},
							symbol: "circle",
							symbolSize: 10,
							symbolOffset: [0, 0],
							data: [
								{
									type: "max",
									name: "最大值",
								},
								{
									type: "min",
									name: "最小值",
								},
							],
						},
					},
				],
			};
			this.recordLineChart.setOption(option, true);
		},
	},
	mounted() {
		this.initChart();
	},
};
</script>
<style lang="less" scoped>
.recordLineChart {
	width: 100%;
	height: 100%;
}
</style>
