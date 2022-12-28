/* EncapDam良率 饼图 */
<template>
	<div>
		<template v-for="item in data">
			<div :id="item.title" class="pieChart" :key="item.title"></div>
		</template>
	</div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "encap-pie",
	props: {
		index: {
			type: String, // String, Number, Object
			required: false,
			default: "0",
		},
		data: {},
	},
	watch: {
		data() {
			this.data.forEach((item) => {
				this.$nextTick(() => {
					this.initChart(item);
				});
			});
		},
	},
	data() {
		return {};
	},
	methods: {
		initChart(data) {
			// 基于准备好的dom，初始化echarts实例
			const pieChart = echarts.init(document.getElementById(data.title));
			let option = {
				color: ["#9eeab0", "#b4c6e7", "#ffd966", "#d0cece", "#fbac93", "#acb9ca", "#f0904e", "#fbfc93", "#fcb9ca", "#f0c04e"],
				title: {
					text: data.title,
					left: "center",
				},
				tooltip: {
					trigger: "item",
				},
				grid: {
					top: "10%",
				},
				legend: {
					orient: "vertial",
					type: "scroll",
					width: "80%",
					height: "10",
					itemWidth: 12,
					itemHeight: 12,
					icon: "rect",
					left: "center",
					top: "10%",
					itemGap: 10,
					data: data.legend,
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
						name: "不良现象",
						type: "pie",
						radius: "50%",
						center: ["50%", "50%"],
						data: data.series,
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
			pieChart.setOption(option, true);
			// window.addEventListener('resize', () => {
			//   if (this.pieChart) {
			//     this.pieChart.resize()   // 不报错
			//   }
			// })
		},
	},
	mounted() {},
};
</script>
<style lang="less" scoped>
.pieChart {
	width: 20% !important;
	height: 300px !important;
	display: inline-block;
	margin-top: 20px;
}
</style>
