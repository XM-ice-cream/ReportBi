<!-- 柱状图 -->
<template>
	<div id="barchart" class="charts" ref="barchart"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "componentBar",
	props: {
		chartData: Object,
	},
	data() {
		return {
			myChart: null,
		};
	},

	methods: {
		pageLoad() {
			// 基于准备好的dom，初始化echarts实例
			this.myChart = echarts.init(this.$el);
			const _this = this;
			let seriesResult = [];

			const { xAxis, yAxis, grid, series, groupByString, dataZoom, legend, resultKeys, visualMap } = this.chartData;

			//series 根据颜色类别 分类
			let temp = {};
			series.forEach((item) => {
				const { stack } = item;
				//name存在 说明有分类
				if (item.data[0].name) {
					item.data.forEach((data) => {
						const { name, value } = data;
						const { color } = data.itemStyle;
						//获取维度 所处索引 为了保持数据顺序一致
						const index = resultKeys.findIndex((item) => item === value[1]);
						let stackName = `${stack}${name}`;
						if (!temp[stackName]) temp[stackName] = { ...item, data: [], lineStyle: { color }, name };
						temp[stackName].data.splice(index, 0, data); //指定位置填充数据
					});
				} else {
					seriesResult.push({ ...item });
				}
			});
			//添加分类了的数据
			Object.keys(temp).forEach((tempKey) => {
				seriesResult.push({ ...temp[tempKey] });
			});
			let option = {
				// color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
				tooltip: {
					trigger: "item",
					axisPointer: {
						type: "shadow",
					},
					formatter: function (params) {
						return _this.$parent.tooltipFormatter(params, groupByString);
					},
					appendToBody: true,
					confine: true,
				},
				// type: "scroll" 图例滚动的关键
				legend: { type: "scroll", width: "50%", itemWidth: 14, data: legend },
				dataZoom: dataZoom,
				grid: grid,
				xAxis: xAxis,
				yAxis: yAxis,
				series: seriesResult,
			};

			option = visualMap ? { ...option, visualMap } : option;
			console.log(option);
			this.myChart.clear();
			this.myChart.setOption(option, true);

			window.addEventListener("resize", function () {
				if (this.myChart) {
					this.myChart.resize();
				}
			});
		},
	},
	mounted() {
		// this.$nextTick(() => {
		// 	this.pageLoad();
		// });
	},
};
</script>
<style>
.charts {
	height: 100%;
	width: 100%;
}
</style>
