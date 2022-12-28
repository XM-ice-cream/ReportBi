/* OP30看板柱状图 */
<template>
	<div :id="'barPaymentAnalysis' + index" class="chart"></div>
</template>
<script>
import * as echarts from "echarts";

export default {
	name: "bar-op30",
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
			// 基于准备好的dom，初始化echarts实例
			this.chart = echarts.init(document.getElementById("barPaymentAnalysis" + this.index));
			let option = {
				color: ["#ff0000", "#4BE64B"],
				legend: {
					data: ["Defect", "Pass"],
				},
				tooltip: {},
				xAxis: {
					type: "category",
					data: this.data.xAxisData,
					axisLabel: {
						rotate: 20,
						interval: 0,
					},
				},
				yAxis: {},
				series: [
					{
						name: "Defect",
						type: "bar",
						stack: "one",
						barWidth: 30,
						label: {
							show: true,
						},
						data: this.data.defectCountData,
					},
					{
						name: "Pass",
						type: "bar",
						stack: "one",
						barWidth: 30,
						label: {
							show: true,
						},
						data: this.data.passCountData,
					},
					{
						name: "allCount",
						type: "line",
						symbolSize: 1,
						symbol: "circle",
						label: {
							show: true,
							color: "#4BE64B",
							formatter: (params) => {
								const itemValue = (this.data.passCountData[params.dataIndex] / params.value) * 100;
								return `良率: ${itemValue.toFixed(2)}%`;
							},
						},
						lineStyle: {
							normal: {
								width: 4,
								color: {
									type: "linear",
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [
										{
											offset: 0,
											color: "rgba(255, 67, 2, 0)", // 0% 处的颜色
										},
										{
											offset: 1,
											color: "rgba(255, 196, 53, 0)", // 100% 处的颜色
										},
									],
									global: false, // 缺省为 false
								},
							},
						},
						data: this.data.allCountData,
					},
				],
			};
			// 绘制图表
			this.chart.setOption(option, true);
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
	width: 100%;
	height: 100%;
}
</style>
