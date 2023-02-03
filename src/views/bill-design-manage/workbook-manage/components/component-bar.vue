<template>
	<div id="barchart" class="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
	name: "componentBar",
	props: {
		value: Array,
		row: Array,
		column: Array,
	},
	watch: {
		value: {
			handler() {
				console.log("柱状图", this.value, this.row, this.column);
				this.pageLoad();
				// const data = this.$XEUtiles.groupBy(data, "tableName");
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {};
	},
	methods: {
		async pageLoad() {
			// 基于准备好的dom，初始化echarts实例
			const charts = echarts.init(document.getElementById("barchart"));

			const _this = this;

			const { xAxis, yAxis, grid, series } = await this.dataLogic();

			let option = {
				// color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "shadow",
					},
					formatter: function (params) {
						let aa = [];
						params.forEach((item) => {
							const { data, marker } = item;
							Object.keys(data[2]).forEach((dataitem) => {
								aa.push(marker + " " + _this.axisToField(dataitem) + `:  ${data[2][dataitem]}`);
							});
						});
						return aa.join("<br>");
					},
				},
				legend: {},
				dataZoom: [
					{
						//区域缩放组件的类型为滑块，默认作用在x轴上
						type: "slider",
						//区域缩放组件的过滤模式，weakFilter：在进行区域缩放时，允许图形的一部分在坐标系上(可见)，另一部分在坐标系外(隐藏)
						filterMode: "weakFilter",
						showDataShadow: false,
						bottom: 10,
						height: 10,
						//区域缩放组件边框颜色
						borderColor: "transparent",
						//区域缩放组件边框背景
						backgroundColor: "#e1eaf3",
						//区域缩放组件上的手柄的样式
						handleIcon:
							"M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z", // jshint ignore:line
						//手柄大小
						handleSize: 18,
						end: xAxis[0]?.data ? (50 / xAxis[0].data.length) * 100 : 100,
						//为手柄设置阴影效果
						handleStyle: {
							shadowBlur: 6,
							shadowOffsetX: 1,
							shadowOffsetY: 2,
							shadowColor: "#e1eaf3",
						},
						labelFormatter: "",
						xAxisIndex: xAxis.map((item, index) => index),
					},
					{
						//区域缩放组件的类型为内置在坐标系中，默认作用在x轴的坐标系中
						type: "inside",
						//区域缩放组件的过滤模式，weakFilter：在进行区域缩放时，允许图形的一部分在坐标系上(可见)，另一部分在坐标系外(隐藏)
						filterMode: "weakFilter",
						xAxisIndex: xAxis.map((item, index) => index),
					},
					{
						//区域缩放组件的类型为滑块，默认作用在x轴上
						type: "slider",
						//区域缩放组件的过滤模式，weakFilter：在进行区域缩放时，允许图形的一部分在坐标系上(可见)，另一部分在坐标系外(隐藏)
						filterMode: "weakFilter",
						showDataShadow: false,
						width: 10,
						//区域缩放组件边框颜色
						borderColor: "transparent",
						//区域缩放组件边框背景
						backgroundColor: "#e1eaf3",
						//区域缩放组件上的手柄的样式
						handleIcon:
							"M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z", // jshint ignore:line
						//手柄大小
						handleSize: 18,
						end: yAxis[0].data ? (50 / yAxis[0].data.length) * 100 : 100,
						//为手柄设置阴影效果
						handleStyle: {
							shadowBlur: 6,
							shadowOffsetX: 1,
							shadowOffsetY: 2,
							shadowColor: "#e1eaf3",
						},
						labelFormatter: "",
						yAxisIndex: yAxis.map((item, index) => index),
					},
					{
						//区域缩放组件的类型为内置在坐标系中，默认作用在x轴的坐标系中
						type: "inside",
						//区域缩放组件的过滤模式，weakFilter：在进行区域缩放时，允许图形的一部分在坐标系上(可见)，另一部分在坐标系外(隐藏)
						filterMode: "weakFilter",
						yAxisIndex: yAxis.map((item, index) => index),
					},
				],
				grid: grid,
				xAxis: xAxis,
				yAxis: yAxis,
				series: series,
			};
			charts.setOption(option, true);
			console.log(option);
			window.addEventListener("resize", function () {
				charts.resize();
			});
		},

		//数据逻辑处理
		dataLogic() {
			let xAxis = []; //行
			let yAxis = []; //列
			let grid = []; //
			let series = [];

			//行中是否有指标
			const isNumberRow = this.row.some((item) => item.dataType === "Number");
			//列中是否有指标
			const isNumberColumn = this.column.some((item) => item.dataType === "Number");

			//行中指标
			const numberTypeRow = isNumberRow ? this.row.filter((item) => item.dataType === "Number").map((item) => item.axis + item.orderBy) : 0;
			// 列中指标
			const numberTypeColumn = isNumberColumn ? this.column.filter((item) => item.dataType === "Number").map((item) => item.axis + item.orderBy) : 0;

			//行中维度
			const stringTypeRow = this.row.filter((item) => item.dataType !== "Number").map((item) => item.axis + item.orderBy);
			//列中维度
			const stringTypeColumn = this.column.filter((item) => item.dataType !== "Number").map((item) => item.axis + item.orderBy);

			console.log(numberTypeColumn, numberTypeRow, stringTypeRow, stringTypeColumn);
			//行列均为维度
			// if(!isNumberRow&&!isNumberColumn){

			// };
			let obj = {};
			//如果列中有指标
			if (isNumberColumn) {
				this.value.forEach((item) => {
					let stringData = "";
					stringTypeRow.forEach((rowItem) => {
						stringData += item[rowItem];
					});
					if (!obj[stringData]) obj[stringData] = [];
					obj[stringData].push(item);
				});

				//  对行中的所有维度进行分组
			} else {
				this.value.forEach((item) => {
					let stringData = "";
					stringTypeColumn.forEach((rowItem) => {
						stringData += item[rowItem];
					});
					if (!obj[stringData]) obj[stringData] = [];
					obj[stringData].push(item);
				});
			}
			console.log("列中有指标", obj);

			//如果列中有指标
			let axisConst = []; //维度常量
			if (isNumberColumn) {
				stringTypeRow.forEach((rowItem, index) => {
					Object.keys(obj).map((keyItem, keyIndex) => {
						if (!axisConst[index]) axisConst[index] = [];
						axisConst[index].push(obj[keyItem][0][rowItem]);
					});
				});
			} else {
				stringTypeColumn.forEach((rowItem, index) => {
					Object.keys(obj).map((keyItem, keyIndex) => {
						if (!axisConst[index]) axisConst[index] = [];
						axisConst[index].push(obj[keyItem][0][rowItem]);
					});
				});
			}
			console.log("维度常量", axisConst);
			//数据分组
			// 行、列

			//数字属性
			const axisNumber = [
				{
					type: "value",
					boundaryGap: [0, 0.01],
				},
			];
			//字符串属性
			const axisString = [
				{
					name: "",
					type: "category",
					data: [],
					position: "left",
					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
					nameTextStyle: {
						align: "right",
					},
				},
			];
			//行
			xAxis = isNumberRow
				? isNumberColumn
					? numberTypeRow.map((item) => {
							return {
								...axisNumber,
								data: this.value.map((itemValue) => item[itemValue]),
							};
					  })
					: axisNumber
				: axisConst.map((item, index) => {
						return {
							...axisString[0],
							data: item,
							position: "bottom",
							axisLabel: {
								show: true,
								interval: 0,
								rotate: 90,
								width: 90,
								overflow: "truncate",
							},
							position: "bottom",
							offset: index * 100,
						};
				  });
			//列
			yAxis = isNumberColumn
				? axisNumber
				: axisConst.map((item, index) => {
						return {
							...axisString[0],
							name: this.axisToField(`y${index}`),
							data: item,
							axisLabel: {
								show: true,
								interval: 0,
								rotate: 0,
								width: 90,
								overflow: "truncate",
							},
							position: "left",
							offset: index * 100,
						};
				  });

			if (isNumberColumn) {
				xAxis.push({
					...axisString[0],
					data: Object.keys(obj),
					show: false,
				});
			} else {
				yAxis.push({
					...axisString[0],
					data: Object.keys(obj),
					show: false,
				});
			}

			//grid
			grid = isNumberColumn
				? [{ bottom: 100 * this.row.length - (numberTypeRow?.length || 0) }]
				: [{ left: 100 * this.column.length - (numberTypeColumn?.length || 0) }];

			//series
			series = [];
			let seriesType = ""; //获取行/列的指标
			//如果行和列中均有指标
			seriesType = isNumberColumn ? numberTypeColumn : numberTypeRow;
			const aaa = isNumberColumn ? stringTypeRow : stringTypeColumn;
			seriesType.forEach((item, index) => {
				console.log(item, index);
				Object.keys(obj).forEach((key) => {
					obj[key].forEach((itemValue, itemIndex) => {
						let name = "";
						aaa.forEach((rowItem) => {
							name += itemValue[rowItem];
						});
						if (!series[index]) series[index] = [];
						if (series[index][itemIndex]) {
							console.log(item, index, 123);
							series[index][itemIndex].data.push(
								isNumberColumn ? [name, itemValue[item], { ...itemValue }] : [itemValue[item], name, { ...itemValue }]
							);
						} else {
							series[index].push({
								type: "bar",
								stack: item,
								xAxisIndex: isNumberColumn ? aaa.length : 0,
								yAxisIndex: !isNumberColumn ? aaa.length : 0,
								data: isNumberColumn ? [[name, itemValue[item], { ...itemValue }]] : [[itemValue[item], name, { ...itemValue }]],
							});
						}
					});
				});
				console.log(series);
			});

			return { xAxis, yAxis, grid, series: series.flat() };
		},

		//轴名 对应 字段名称
		axisToField(name) {
			let obj = {};
			this.row.map((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction) + ` ${item.columnName}`));
			this.column.map((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction) + ` ${item.columnName}`));
			return obj[name];
		},
		//计算属性对应中文
		calculatorObj(name) {
			const obj = {
				sum: "总和",
				avg: "平均值",
				count: "计数",
				countDistinct: "计数(不同)",
				max: "最大值",
				min: "最小值",
				stdev: "标准差",
				undefined: "",
			};
			return obj[name];
		},
	},
	mounted() {},
};
</script>
<style>
.charts {
	height: 100%;
	width: 100%;
}
</style>
