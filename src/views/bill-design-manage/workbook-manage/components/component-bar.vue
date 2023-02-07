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
				// const data = this.$XEUtils.groupBy(data, "tableName");
			},
			deep: true,
			immediate: true,
		},
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
			this.myChart = echarts.init(document.getElementById("barchart"));

			const _this = this;

			const { xAxis, yAxis, grid, series, groupByString } = await this.dataLogic();

			let option = {
				// color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "shadow",
					},
					formatter: function (params) {
						//	console.log(params);
						let aa = [];
						params.forEach((item, index) => {
							//	console.log(item, index);
							aa.push("");
							const { data, marker } = item;
							Object.keys(data[2]).forEach((dataitem) => {
								if (groupByString.includes(dataitem) && index == 0) {
									aa.splice(
										groupByString.findIndex((item) => item === dataitem),
										0,
										_this.axisToField(dataitem) + `:  ${data[2][dataitem]}`
									);
								}

								if (!groupByString.includes(dataitem) && (data[3] === dataitem || typeof data[2][dataitem] === "string")) {
									if (data[3] === dataitem) aa.push(marker + " " + _this.axisToField(dataitem) + `:  ${data[2][dataitem]}`);
									if (typeof data[2][dataitem] === "string") aa.push(_this.axisToField(dataitem) + `:  ${data[2][dataitem]}`);
								}
							});
						});
						console.log(aa);
						return aa.join("<br>");
					},
					appendToBody: true,
					confine: true,
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
			this.myChart.setOption(option, true);
			console.log(option);
			window.addEventListener("resize", function () {
				this.myChart.resize();
			});
		},

		//数据逻辑处理
		dataLogic() {
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

			let xAxis = []; //行
			let yAxis = []; //列
			let grid = []; //
			let series = [];
			let obj = {}; //数据分组
			let numberTypeRow = []; //行中指标
			let stringTypeRow = []; //行中维度
			let numberTypeColumn = []; //列中指标
			let stringTypeColumn = []; //列中维度
			let axisConst = []; //维度常量

			//行
			this.row.forEach((item) => {
				//指标
				if (this.numberType(item)) numberTypeRow.push(item.axis + item.orderBy);
				//维度
				if (this.stringType(item)) stringTypeRow.push(item.axis + item.orderBy);
			});
			//列
			this.column.forEach((item) => {
				//指标
				if (this.numberType(item)) numberTypeColumn.push(item.axis + item.orderBy);
				//维度
				if (this.stringType(item)) stringTypeColumn.push(item.axis + item.orderBy);
			});

			console.log(numberTypeColumn, numberTypeRow, stringTypeRow, stringTypeColumn);

			// 列中有指标，对所有行维度进行分组
			const groupByString = numberTypeColumn.length ? stringTypeRow : stringTypeColumn;
			const groupByNumber = numberTypeColumn.length ? numberTypeColumn : numberTypeRow;

			//整理数据
			//1.排序
			const valueResult = this.$XEUtils.orderBy(this.value, groupByString);
			// 2.分组
			valueResult.forEach((item) => {
				let stringData = "";
				groupByString.forEach((rowItem) => {
					stringData += item[rowItem];
				});
				if (!obj[stringData]) obj[stringData] = [];
				obj[stringData].push(item);
			});
			groupByString.forEach((rowItem, index) => {
				Object.keys(obj).map((keyItem, keyIndex) => {
					if (!axisConst[index]) axisConst[index] = [];
					axisConst[index].push(obj[keyItem][0][rowItem]);
				});
			});

			const objKeys = Object.keys(obj);
			console.log("列中有指标", obj, groupByString);
			console.log("维度常量", axisConst);
			//数据分组
			// 行、列

			//列中有指标
			if (numberTypeColumn.length) {
				yAxis = axisNumber;

				//行为指标?数字data:维度常量
				this.$XEUtils.lastEach(axisConst, (item, index) => {
					console.log(item, index);
					xAxis.push({
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
						offset: (groupByString.length - index - 1) * 100,
					});
				});

				xAxis.push({
					...axisString[0],
					data: objKeys,
					show: false,
				});
				grid = [{ bottom: 100 * this.row.length - (numberTypeRow?.length || 0) }];
			} else {
				//行中有指标，列均为维度
				xAxis = axisNumber;
				this.$XEUtils.lastEach(axisConst, (item, index) => {
					console.log(item, index);
					yAxis.push({
						...axisString[0],
						name: this.axisToField(`y${index}`),
						nameLocation: "start",
						data: item,
						axisLabel: {
							show: true,
							interval: 0,
							rotate: 0,
							width: 90,
							overflow: "truncate",
							align: "right",
							// formatter: function (value, valueIndex, data) {
							// console.log(value, valueIndex, data);
							// if (valueIndex === 0) return value;
							// if (value === axisConst[index][valueIndex - 1]) return "";
							// else return value;
							// },
						},
						inverse: true, //反向坐标
						position: "left",
						offset: (groupByString.length - index - 1) * 100,
					});
				});

				yAxis.push({
					...axisString[0],
					data: objKeys,
					show: false,
					inverse: true, //反向坐标
				});
				grid = [{ left: 100 * this.column.length - (numberTypeColumn?.length || 0) }];
			}
			//series
			series = [];
			groupByNumber.forEach((item, index) => {
				objKeys.forEach((key) => {
					obj[key].forEach((itemValue, itemIndex) => {
						let name = "";
						groupByString.forEach((rowItem) => {
							name += itemValue[rowItem];
						});
						if (!series[index]) series[index] = [];
						if (series[index][itemIndex]) {
							console.log(item, index, 123);
							series[index][itemIndex].data.push(
								numberTypeColumn.length ? [name, itemValue[item], { ...itemValue }, item] : [itemValue[item], name, { ...itemValue }, item]
							);
						} else {
							series[index].push({
								type: "bar",
								stack: item,
								xAxisIndex: numberTypeColumn.length ? groupByString.length : 0,
								yAxisIndex: !numberTypeColumn.length ? groupByString.length : 0,
								data: numberTypeColumn.length ? [[name, itemValue[item], { ...itemValue }, item]] : [[itemValue[item], name, { ...itemValue }, item]],
							});
						}
					});
				});
				console.log(series);
			});

			return { xAxis, yAxis, grid, series: series.flat(), groupByString, groupByNumber };
		},
		//数字类型
		numberType(item) {
			return item.dataType === "Number" || (item.calculatorFunction && item.calculatorFunction !== "toChar");
		},
		//字符串类型
		stringType(item) {
			return item.dataType !== "Number" || !item.calculatorFunction || item.calculatorFunction === "toChar";
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
