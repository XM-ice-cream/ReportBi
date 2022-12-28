<template>
	<div :id="'rhiLineChart' + index" class="rhiLineChart"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "line-rhi",
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
			rhiLineChart: {},
		};
	},
	methods: {
		initChart() {
			// 基于准备好的dom，初始化echarts实例
			this.rhiLineChart = echarts.init(document.getElementById("rhiLineChart" + this.index));
			let option = {
				grid: {
					top: "15%",
					left: "3%",
					right: "3%",
					bottom: "3%",
					width: this.data.width || "",
					containLabel: true,
				},
				tooltip: {
					trigger: "axis",
				},
				xAxis: {
					boundaryGap: false,
					data: this.data.xData,
					axisLabel: {
						interval: this.data.axisLabelInterval || "auto", //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
					},
				},
				legend: {
					type: "scroll",
					orient: "horizontal",
					top: 0,
					data: this.data.legendData,
				},
				yAxis: {
					scale: true,
					min: this.data.minValue || null,
					max: this.data.maxValue || null,
					splitLine: {
						show: false,
					},
				},
				series: this.data.series,
			};
			if (this.tooltipFormatter) {
				option.tooltip = {
					trigger: "axis",
					formatter: function (params) {
						let aa = ["SN：" + params[0].data.sn, params[0].data.itemName];
						params.map((item) => {
							aa.push([item.seriesName] + "：" + item.value);
						});

						return aa.join("<br>");
					},
				};
			}
			this.rhiLineChart.setOption(option, true);
		},
	},
	mounted() {
		this.initChart();
	},
};
</script>
<style lang="less" scoped>
.rhiLineChart {
	width: 100%;
	height: 100%;
}
</style>
