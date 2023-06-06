<template>
	<div id="boxplotchart" class="charts"></div>
</template>
<script>
import * as echarts from "echarts";
//如果想要使用echarts内的 echarts.dataTool.prepareBoxplotData 此函数，需要引入以下dataTool
require("echarts/dist/extension/dataTool.js");

export default {
	name: "componentBoxplot",
	props: {
		chartData: Object,
	},
	data() {
		return {
			myChart: "",
		};
	},
	methods: {
		pageLoad() {
			if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
				this.myChart.dispose();
			}
			// 基于准备好的dom，初始化echarts实例
			this.myChart = echarts.init(document.getElementById("boxplotchart"));

			const _this = this;
			let isReverse = false; //是否翻转
			let boxplotScatter = [];

			const { xAxis, yAxis, grid, series, groupByString, dataZoom } = this.chartData;

			//原始数据
			let originData = {};
			let scatterData = {};
			series.forEach((seriesData, seriesIndex) => {
				const { data, stack } = seriesData;
				if (!originData[stack]) originData[stack] = {};
				data.forEach((item, itemIndex) => {
					const { value: itemValue } = item;
					if (seriesIndex == 0 && itemIndex == 0) isReverse = itemValue[3].indexOf("y") > -1 ? false : true;

					const key = isReverse ? itemValue[1] : itemValue[0];
					const value = isReverse ? itemValue[0] : itemValue[1];
					if (!originData[stack][key]) originData[stack][key] = [];
					if (!scatterData[stack]) scatterData[stack] = [];
					originData[stack][key].push(value);
					scatterData[stack].push(itemValue);
				});
			});

			Object.keys(originData).forEach((stack) => {
				//箱线图内部方法：获取箱线图的五个值
				const data = echarts.dataTool.prepareBoxplotData(Object.values(originData[stack]));
				boxplotScatter.push(
					{
						name: stack,
						type: "boxplot",
						data: data.boxData, //使用data的处理后的boxData数据
						tooltip: {
							//以下是设置tooltip的显示数据和显示格式
							formatter: function (param) {
								return [
									" " + param.name + ": ",
									"上限: " + param.data[5],
									"上四分位数: " + param.data[4],
									"中位数: " + param.data[3],
									"下四分位数: " + param.data[2],
									"下限: " + param.data[1],
								].join("<br/>");
							},
						},
					},
					{
						name: stack,
						type: "scatter",
						data: scatterData[stack],
						symbolSize: 3,
						tooltip: {
							formatter: function (params) {
								return _this.$parent.tooltipFormatter([params], groupByString);
							},
						},
					}
				);
			});

			let option = {
				title: [],
				tooltip: {
					trigger: "item",
					axisPointer: {
						type: "shadow",
					},
				},
				dataZoom: dataZoom?.map((item) => {
					return { ...item, filterMode: "empty" };
				}),
				grid: grid,
				xAxis: xAxis,
				yAxis: yAxis,
				series: boxplotScatter,
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
		// this.$nextTick(() => {
		// 	this.pageLoad();
		// });
	},
};
</script>
<style lang="less" scoped>
.charts {
	height: calc(100% - 32px);
	width: 100%;
}
</style>
