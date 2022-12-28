/* Dam点胶 饼图 */
<template>
	<div :id="'pieChart' + index" class="pieChart"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "dam-pie",
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
			pieChart: {},
		};
	},
	methods: {
		initChart() {
			// 基于准备好的dom，初始化echarts实例
			this.pieChart = echarts.init(document.getElementById("pieChart" + this.index));
			let option = {
				color: ["#9eeab0", "#b4c6e7", "#ffd966", "#d0cece", "#fbac93", "#acb9ca", "#f0904e"],
				title: {
					text: this.data.title + " Defect Rate",
				},
				tooltip: {
					trigger: "item",
					formatter: function (datas) {
						let res = datas.marker + datas.name + "：" + datas.value + "%<br/>";
						return res;
					},
				},
				grid: {
					top: "10%",
				},
				legend: {
					orient: "vertial",
					type: "scroll",
					height: "100%",
					itemWidth: 12,
					itemHeight: 12,
					icon: "rect",
					right: "10%",
					top: "0%",
					itemGap: 10,
					data: this.data.legend,
					textStyle: {
						color: "#333333",
						padding: [2, 0, 0, 0],
						fontSize: 12,
					},
					pageIconColor: "rgba(46, 145, 213, 1)",
					pageTextStyle: {
						color: "rgba(213, 201, 201, 1)",
					},
					pageIconSize: [9, 9],
				},
				series: [
					{
						name: "Defect Rate",
						type: "pie",
						radius: "50%",
						center: ["40%", "50%"],
						data: this.data.series,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: "rgba(0, 0, 0, 0.5)",
							},
						},
						label: {
							show: true,
							position: "outside",
							color: "#333333",
							fontSize: 12,
						},
						labelLine: {
							show: true,
						},
					},
				],
			};
			// 绘制图表
			this.pieChart.setOption(option, true);
			window.addEventListener("resize", () => {
				if (this.pieChart) {
					this.pieChart.resize(); // 不报错
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
.pieChart {
	width: 98% !important;
	height: 100% !important;
}
</style>
