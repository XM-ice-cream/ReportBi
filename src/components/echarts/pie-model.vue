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
			const title = { value: 2966, type: "模型总数" };
			const _this = this;
			let option = {
				title: {
					zlevel: 0,
					text: [`{value|${title.value}}`, `{name|${title.type}}`].join("\n"),
					top: "center",
					left: "30%",
					textAlign: "center",
					textStyle: {
						rich: {
							value: {
								color: "#151515",
								fontSize: 18,
								fontWeight: "bold",
								lineHeight: 30,
							},
							name: {
								color: "#616060",
								fontSize: 12,
							},
						},
					},
				},
				color: ["#33c29c", "#57b57e", "#9ea5c2", "#fb992a", "#f4c02c", "#38b1d3", "#57b1f2", "#9873fe"],
				tooltip: {
					trigger: "item",
				},
				legend: {
					type: "scroll",
					orient: "vertical",
					icon: "circle",
					right: 50,
					top: "center",
					itemWidth: 10,
					//设置自定义legend 的重点
					formatter: function (name) {
						// 获取legend显示内容
						let total = 0;
						let value = 0;
						for (let i = 0, l = _this.data.length; i < l; i++) {
							total += _this.data[i].value;
							if (_this.data[i].modelName == name) {
								value = _this.data[i].counts;
							}
						}
						return [
							"{a|" +
								echarts.format.truncateText(
									name,
									150,
									"14px Microsoft Yahei",
									"…" //如果宽度超过80会出现...
								) +
								"}",
							"{x|" + value + "}", //a、b、x、跟下面的rich对应
						].join(" ");
					},
					tooltip: {
						show: true, //这个为true的话悬停到legend上会出现tooltip
					},
					textStyle: {
						rich: {
							a: {
								width: 150,
								align: "left",
							},
							x: {
								width: 30,
								align: "left",
								fontWeight: "bold",
							},
						},
					},
				},
				series: [
					{
						name: "Access From",
						type: "pie",
						radius: ["55%", "80%"],
						center: ["30%", "50%"],
						avoidLabelOverlap: false,
						itemStyle: {
							borderColor: "#fff",
							borderWidth: 2,
						},
						label: {
							show: false,
							position: "center",
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
			window.addEventListener("resize", () => {
				if (this.modelPieChart) {
					this.modelPieChart.resize();
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
.modelPieChart {
	width: 100%;
	height: 100%;
}
</style>
