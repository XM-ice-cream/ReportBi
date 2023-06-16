<template>
	<div :id="'piechart' + id" class="charts" ref="piechart" v-if="visib"></div>
</template>
<script>
import * as echarts from "echarts";
import { addImageReq } from "@/api/bill-design-manage/workbook-design";
import { compress } from "@/libs/tools";

export default {
	name: "componentPie",
	props: {
		chartData: Object,
		mark: Array,
		id: String,
		tempStyle: Object,
		title: String,
		visib: Boolean,
	},
	data() {
		return {
			myChart: {},
		};
	},
	methods: {
		async pageLoad() {
			if (this.myChart[this.id] != null && this.myChart[this.id] != "" && this.myChart[this.id] != undefined) {
				this.myChart[this.id].dispose();
			}
			// 基于准备好的dom，初始化echarts实例
			this.myChart[this.id] = echarts.init(document.getElementById(`piechart${this.id}`));
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

			this.myChart[this.id].setOption(option, true);
			// 存缓存
			this.$nextTick(() => {
				//如果id存在 则存入缓存
				if (this.id) {
					this.chartToBase64(this.myChart[this.id]).then(async (base64) => {
						//压缩
						const pressCanvas = await compress(base64).then((res) => {
							return res;
						});
						const direction = "p"; //PDF方向
						const width = this.$refs.piechart.offsetWidth; //宽
						const height = this.$refs.piechart.offsetHeight; //高
						const obj = {
							id: this.id,
							imageJson: JSON.stringify({ canvas: pressCanvas, title: this.title, direction, tempStyle: { width, height } }),
						};
						addImageReq(obj);
					});
				}
			});
			// window.addEventListener("resize", function () {
			// 	if (this.myChart[this.id]) {
			// 		this.myChart[this.id].resize();
			// 	}
			// });
		},
		// 将图表转换为 base64 字符串
		chartToBase64(chart) {
			return new Promise((resolve, reject) => {
				chart.on("finished", () => {
					resolve(chart.getDataURL({ backgroundColor: "#fff" }));
				});
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
