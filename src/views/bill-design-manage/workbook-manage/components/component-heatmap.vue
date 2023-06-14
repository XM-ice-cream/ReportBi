<!-- 热力图 -->
<template>
	<div :id="'heatmap' + id" class="charts" ref="heatmap"></div>
</template>
<script>
import * as echarts from "echarts";
import { addImageReq } from "@/api/bill-design-manage/workbook-design";

export default {
	name: "componentHeatMap",
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
			// 基于准备好的dom，初始化echarts实例
			this.myChart[this.id] = echarts.init(document.getElementById(`heatmap${this.id}`));
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
				visualMap: visualMap,
				grid: grid,
				xAxis: xAxis,
				yAxis: yAxis,
				series: seriesResult.map((item) => {
					return { ...item, type: "heatmap" };
				}),
			};
			console.log(option);
			this.myChart[this.id].setOption(option, true);
			// 存缓存
			this.$nextTick(() => {
				this.chartToBase64(this.myChart[this.id]).then((base64) => {
					const direction = yAxis[0]?.type == "value" ? "l" : "p"; //PDF方向
					const width = this.$refs.heatmap.offsetWidth; //宽
					const height = this.$refs.heatmap.offsetHeight; //高
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
