<template>
	<div id="piechart" class="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "componentPie",
	props: {
		chartData: Object,
		mark: Array,
	},
	data() {
		return {
			myChart: "",
		};
	},
	methods: {
		async pageLoad() {
			if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
				this.myChart.dispose();
			}
			// 基于准备好的dom，初始化echarts实例
			this.myChart = echarts.init(document.getElementById("piechart"));
			const _this = this;

			const { series } = this.chartData;

			let option = {
				// color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
				tooltip: {
					trigger: "item",
					formatter: function (params) {
						return _this.$parent.tooltipFormatter(params, Object.keys(params.value[2]));
					},
				},
				legend: { type: "scroll", width: "50%", itemWidth: 14 },
				series: series,
			};

			this.myChart.setOption(option, true);
			window.addEventListener("resize", function () {
				if (this.myChart) {
					this.myChart.resize();
				}
			});
		},
	},
	mounted() {
		this.pageLoad();
	},
};
</script>
<style lang="less" scoped>
.charts {
	height: calc(100% - 32px);
	width: 100%;
}
</style>
