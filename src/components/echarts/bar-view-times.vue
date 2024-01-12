<!-- 首页 访问次数 -->
<template>
	<div :id="'viewTimesBarChart' + index" class="viewTimesBarChart"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "bar-view-times",
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
			viewTimesBarChart: {},
		};
	},
	methods: {
		initChart() {
			// 基于准备好的dom，初始化echarts实例
			this.viewTimesBarChart = echarts.init(document.getElementById("viewTimesBarChart" + this.index));
			var salvProName = [
				"安徽省",
				"河南河南省河南省河南省河南省河南省河南省河南省省",
				"浙江省",
				"湖北省",
				"贵州省",
				"江西省",
				"江苏省",
				"四川省",
				"云南省",
				"湖南省",
			];

			var salvProValue = [181, 154, 144, 135, 117, 74, 72, 67, 55];

			let option = {
				grid: {
					bottom: 0,
					top: 10,
					left: 0,
					rigth: 0,
				},
				xAxis: {
					type: "category",
					show: false,
					data: salvProName,
				},
				yAxis: [
					{
						show: false,
						type: "value",
					},
				],
				series: [
					{
						// name: '值',
						type: "bar",
						data: salvProValue,
						barWidth: 8,
						itemStyle: {
							normal: {
								barBorderRadius: [3, 3, 0, 0],
								color: function (params) {
									//首先定义一个数组
									var colorList = ["#d8c3ff", "#7342fd"];
									if (params.dataIndex % 2 == 0) {
										return colorList[0];
									} else {
										return colorList[1];
									}
								},
							},
						},
					},
				],
			};

			this.viewTimesBarChart.setOption(option, true);
			window.addEventListener("resize", () => {
				if (this.viewTimesBarChart) {
					this.viewTimesBarChart.resize();
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
.viewTimesBarChart {
	width: 100%;
	height: 98%;
}
</style>
