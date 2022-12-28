/* RHI 散点图 */
<template>
	<div :id="'rhiScatterChart' + index" class="rhiScatterChart"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "scatter-rhi",
	props: {
		index: {
			type: String, // String, Number, Object
			required: false,
			default: "0",
		},
		tooltipFormatter: {
			type: Boolean,
			default: false,
		},
		data: {},
	},

	data() {
		return {
			rhiScatterChart: {},
		};
	},
	methods: {
		initChart() {
			// 基于准备好的dom，初始化echarts实例
			this.rhiScatterChart = echarts.init(document.getElementById("rhiScatterChart" + this.index));
			let option = {
				grid: {
					top: "15%",
					left: "3%",
					right: "3%",
					bottom: "3%",
					containLabel: true,
				},
				tooltip: {
					trigger: "axis",
				},
				xAxis: [
					{
						boundaryGap: false,
						scale: true,
						axisLabel: {
							formatter: "{value}",
							interval: this.data.axisLabelInterval || "auto", //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: "#999",
								type: "dashed",
							},
						},
						data: this.data.xData,
					},
				],
				legend: {
					type: "scroll",
					orient: "horizontal",
					top: 0,
					data: this.data.legendData,
				},
				yAxis: {
					type: "value",
					scale: true,
					min: this.data.minValue || null,
					max: this.data.maxValue || null,
					axisLabel: {
						formatter: "{value} %",
					},
					splitLine: {
						show: false,
					},
				},
				series: this.data.series,
			};
			if (this.tooltipFormatter) {
				option.tooltip = {
					showDelay: 0,
					formatter: function (params) {
						let aa = ["SN：" + params.value[2].sn, params.value[2].itemName + "：" + params.value[1] + "% "];
						return aa.join("<br>");
					},

					axisPointer: {
						show: true,
						type: "cross",
						lineStyle: {
							type: "dashed",
							width: 1,
						},
						snap: true, //坐标轴吸附
					},
				};
			}
			this.rhiScatterChart.setOption(option, true);
		},
	},
	mounted() {
		this.initChart();
	},
};
</script>
<style lang="less" scoped>
.rhiScatterChart {
	width: 100%;
	height: 100%;
}
</style>
