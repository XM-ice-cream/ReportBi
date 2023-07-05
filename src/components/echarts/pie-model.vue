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
		data: {
			type: Array,
			default: () => [],
		},
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
						data: this.data.map((item) => {
							return { value: item.counts, name: item.modelName };
						}),
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
