<!-- 工作簿占比 -->
<template>
	<div :id="'modelPieChart' + index" class="modelPieChart"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "pie-model",
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
			modelPieChart: {},
		};
	},
	methods: {
		initChart() {
			// 基于准备好的dom，初始化echarts实例
			this.modelPieChart = echarts.init(document.getElementById("modelPieChart" + this.index));
			let option = {
				color: ["#13c2c2", "#ff625c", "#fac000", "#897eed", "#5b9ffe"],
				tooltip: {
					trigger: "item",
				},
				legend: {
					type: "scroll",
					orient: "vertical",
					right: 50,
					top: 20,
					bottom: 20,
				},
				series: [
					{
						name: "Access From",
						type: "pie",
						radius: ["40%", "70%"],
						center: ["40%", "50%"],
						avoidLabelOverlap: false,
						itemStyle: {
							borderColor: "#fff",
							borderWidth: 2,
						},
						label: {
							show: false,
							position: "center",
						},
						emphasis: {
							label: {
								show: true,
								fontSize: 40,
								fontWeight: "bold",
							},
						},
						labelLine: {
							show: false,
						},
						data: [
							{ value: 1048, name: "公共模型" },
							{ value: 735, name: "通用模型" },
							{ value: 580, name: "Sensor模型" },
							{ value: 484, name: "SIP模型" },
							{ value: 300, name: "Sample模型" },
							{ value: 1, name: "Other模型" },
							{ value: 50, name: "NCC模型" },
						],
					},
				],
			};
			this.modelPieChart.setOption(option, true);
		},
	},
	mounted() {
		this.initChart();
	},
};
</script>
<style lang="less" scoped>
.modelPieChart {
	width: 100%;
	height: 100%;
}
</style>
