<template>
	<div :id="'boxplotchart' + id" class="charts" ref="barchart"></div>
</template>
<script>
import * as echarts from "echarts";
import { addImageReq } from "@/api/bill-design-manage/workbook-design";

//如果想要使用echarts内的 echarts.dataTool.prepareBoxplotData 此函数，需要引入以下dataTool
require("echarts/dist/extension/dataTool.js");

export default {
	name: "componentBoxplot",
	props: {
		chartData: Object,
		id: String,
		tempStyle: Object,
		title: String,
	},
	data() {
		return {
			myChart: {},
		};
	},
	methods: {
		pageLoad() {
			if (this.myChart[this.id] != null && this.myChart[this.id] != "" && this.myChart[this.id] != undefined) {
				this.myChart[this.id].dispose();
			}
			// 基于准备好的dom，初始化echarts实例
			this.myChart[this.id] = echarts.init(document.getElementById(`boxplotchart${this.id}`));

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
				xAxis:
					xAxis[0]?.type == "value"
						? xAxis.map((item) => {
								return {
									...item,
									min: function (value) {
										return value.min;
									},
								};
						  })
						: xAxis,
				yAxis:
					yAxis[0]?.type == "value"
						? yAxis.map((item) => {
								return {
									...item,
									min: function (value) {
										return value.min;
									},
								};
						  })
						: yAxis,
				series: boxplotScatter,
			};

			this.myChart[this.id].setOption(option, true);
			// 存缓存
			this.$nextTick(() => {
				this.chartToBase64(this.myChart[this.id]).then((base64) => {
					const direction = yAxis[0]?.type == "value" ? "l" : "p"; //PDF方向
					const width = this.$refs.barchart.offsetWidth; //宽
					const height = this.$refs.barchart.offsetHeight; //高
					const obj = {
						id: this.id,
						imageJson: JSON.stringify({ canvas: base64, title: this.title, direction, tempStyle: { width, height } }),
					};
					addImageReq(obj);
				});
			});
			window.addEventListener("resize", function () {
				if (this.myChart[this.id]) {
					this.myChart[this.id].resize();
				}
			});
		},
		// 将图表转换为 base64 字符串
		chartToBase64(chart) {
			return new Promise((resolve, reject) => {
				chart.on("finished", () => {
					resolve(chart.getDataURL());
				});
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
