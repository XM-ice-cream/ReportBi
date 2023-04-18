<template>
	<div :id="'maverickLineChart' + index" class="maverickLineChart" v-if="isShow"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "line-maverick",
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
			isShow: false,
			maverickLineChart: {},
		};
	},
	methods: {
		initChart() {
			this.isShow = true;
			const _this = this;
			// 基于准备好的dom，初始化echarts实例
			this.maverickLineChart = echarts.init(document.getElementById("maverickLineChart" + this.index));
			let option = {
				color: ["#000", "#648dc6", "#e51f0e"],
				title: {
					text: `${this.data?.station} ${this.data?.type} Report`,
					left: "center",
				},
				grid: {
					top: "10%",
					left: "center",
					width: "90%",
					containLabel: true,
				},
				toolbox: {
					feature: {
						saveAsImage: {},
					},
				},
				tooltip: {
					trigger: "axis",
					formatter: function (params) {
						let aa = [
							"日期：" + params[0].data.createtime,
							"站点：" + `${_this.data.type === "SYL" ? params[0].data.station : null}`,
							"Location：" + params[0].data.station,
							"数值：" + params[0].data.value + "%",
							"预警线：" + params[0].data.yielD_TARGET + "%",
						];
						// params.map((item) => {
						//   aa.push([item.seriesName] + "：" + item.value);
						// });
						return aa.join("<br>");
					},
					textStyle: {
						fontSize: 16,
						fontWeight: "bold",
					},
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
					top: "5%",
					data: this.data.legendData,
				},
				yAxis: {
					scale: true,
					splitLine: {
						show: false,
					},
					axisLabel: {
						formatter: "{value} %",
					},
					min: function (value) {
						return Math.floor(value.min - 1) < 0 ? 0 : Math.floor(value.min - 1);
					},
				},
				series: this.data.series,
			};
			this.maverickLineChart.setOption(option, true);
			window.addEventListener("resize", () => {
				if (this.maverickLineChart) {
					this.maverickLineChart.resize();
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
.maverickLineChart {
	width: 100%;
	height: 100%;
}
</style>
