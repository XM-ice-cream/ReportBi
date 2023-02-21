<template>
	<div style="height: calc(100% - 50px); padding: 5px; margin: 5px">
		<component :is="type" :ispreview="true" :visib="visib" :chartData="chartData" />
	</div>
</template>

<script>
import componentTable from "./component-table.vue";
import bar from "./component-bar.vue"; //柱状图
import componentLine from "./component-line.vue"; //折线图
import componentPie from "./component-pie.vue"; //饼图
import componentScatter from "./component-scatter.vue"; //散点图
import componentBoxplot from "./component-boxplot.vue"; //箱线图

export default {
	name: "componentsTemp",
	components: { componentTable, bar, componentLine, componentPie, componentScatter, componentBoxplot },
	model: {
		prop: "value",
		event: "input",
	},
	props: {
		type: String,
		visib: Boolean,
		row: Array, //行
		column: Array, //列
		mark: Array, //标记
		value: {
			type: Array,
			default: () => {},
		},
	},
	watch: {
		value: {
			handler() {
				this.chartData = this.dataLogic();
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {
			chartData: {},
			// 数字属性
			axisNumber: [
				{
					type: "value",
					boundaryGap: [0, 0.01],
				},
			],
			//字符串属性
			axisString: [
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
			],
		};
	},
	methods: {
		//数据逻辑处理
		dataLogic() {
			let obj = {}; //数据分组
			let rcSummary = { x: { string: [], number: [] }, y: { string: [], number: [] } };
			let axisConst = []; //维度常量
			let markObj = {};

			//指标、维度分类获取
			this.row.concat(this.column).forEach((item) => {
				const { axis, orderBy } = item;
				//指标
				if (this.numberType(item)) rcSummary[axis].number.push(`${axis}${orderBy}`);
				//维度
				if (this.stringType(item)) rcSummary[axis].string.push(`${axis}${orderBy}`);
			});
			const { string: xString, number: xNumber } = rcSummary.x;
			const { string: yString, number: yNumber } = rcSummary.y;

			// 列中有指标，对所有行维度进行分组
			const groupByString = yNumber.length ? xString : yString;
			const groupByNumber = yNumber.length ? yNumber : xNumber;

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
			//标记
			this.mark.forEach((item) => {
				markObj[item.stack] = { color: {}, mark: [], type: item.chartType };
				item.data.forEach((markItem) => {
					const { innerText, markValue, axis, orderBy } = markItem;
					//颜色
					if (innerText === "color") {
						markValue.forEach((data) => {
							const { title, color } = data;
							if (!markObj[item.stack].color[`${axis}${orderBy}`]) markObj[item.stack].color[`${axis}${orderBy}`] = {};
							markObj[item.stack].color[`${axis}${orderBy}`][title] = color;
						});
					}
					//标签
					if (innerText === "mark") {
						markObj[item.stack].mark.push(`${axis}${orderBy}`);
					}
				});
			});

			const objKeys = Object.keys(obj);

			// 行、列
			const { xAxis, yAxis, grid } = this.getxAxisyAxis(yNumber, objKeys, axisConst, groupByString, markObj);
			//series
			const series = this.getSeries(groupByNumber, groupByString, yNumber, objKeys, obj, markObj);

			//dataZoom
			const dataZoom = this.getDataZoom(xAxis, yAxis, groupByNumber);

			return { xAxis, yAxis, grid, series: series.flat(), groupByString, groupByNumber, dataZoom };
		},

		//获取x,y轴属性设定
		getxAxisyAxis(yNumber, objKeys, axisConst, groupByString) {
			let gridWidth = 0;
			let yAxis = [];
			let xAxis = [];
			let axisLabelData = [];
			let grid = [];
			//列中有指标
			if (yNumber.length) {
				yAxis = this.axisNumber;

				//行为指标?数字data:维度常量
				this.$XEUtils.lastEach(axisConst, (item, index) => {
					axisLabelData[index] = [];

					//文本宽度
					const labelWidth =
						this.mark[0].data.filter((markItem) => {
							console.log(markItem, this.axisToField(`x${index}`)?.trim(), markItem.columnName);
							return markItem.innerText === "labelWidth" && this.axisToField(`x${index}`)?.trim() === markItem.columnName;
						})[0]?.markValue || 90;

					gridWidth += gridWidth == 0 ? labelWidth : labelWidth + 10;

					xAxis.push({
						...this.axisString[0],
						data: item,
						position: "bottom",
						axisLabel: {
							show: true,
							interval: 0,
							rotate: 90,
							width: labelWidth,
							overflow: "truncate",
							formatter: function (value, valueIndex, data) {
								axisLabelData[index][valueIndex] = value;
								if (valueIndex === 0 || index === axisLabelData.length - 1) return value;
								if (value === axisLabelData[index][valueIndex - 1]) return "";
								else return value;
							},
						},

						position: "bottom",
						offset: gridWidth - labelWidth,
					});
				});

				xAxis.push({
					...this.axisString[0],
					data: objKeys,
					show: false,
				});
				grid = [{ bottom: gridWidth + groupByString.length * 10 }];
			} else {
				//行中有指标，列均为维度
				xAxis = this.axisNumber;
				this.$XEUtils.lastEach(axisConst, (item, index) => {
					axisLabelData[index] = [];

					// 文本宽度;
					const labelWidth =
						this.mark[0].data.filter((markItem) => {
							return markItem.innerText === "labelWidth" && this.axisToField(`y${index}`)?.trim() === markItem.columnName;
						})[0]?.markValue || 90;

					gridWidth += gridWidth == 0 ? labelWidth : labelWidth + 10;

					yAxis.push({
						...this.axisString[0],
						name: this.axisToField(`y${index}`),
						nameLocation: "start",
						data: item,
						axisLabel: {
							show: true,
							interval: 0,
							rotate: 0,
							width: labelWidth,
							overflow: "truncate",
							align: "right",
							formatter: function (value, valueIndex, data) {
								axisLabelData[index][valueIndex] = value;
								if (valueIndex === 0 || index === axisLabelData.length - 1) return value;
								if (value === axisLabelData[index][valueIndex - 1]) return "";
								else return value;
							},
						},
						inverse: true, //反向坐标
						position: "left",
						offset: gridWidth - labelWidth,
					});
				});

				yAxis.push({
					...this.axisString[0],
					data: objKeys,
					show: false,
					inverse: true, //反向坐标
				});
				grid = [{ left: gridWidth + groupByString.length * 10 }];
			}
			return { xAxis, yAxis, grid };
		},
		//获取series
		getSeries(groupByNumber, groupByString, yNumber, objKeys, obj, markObj) {
			let series = [];
			groupByNumber.forEach((item, index) => {
				//颜色、标签
				const { color: markObjColor, mark: markArray, type } = markObj[item];
				objKeys.forEach((key) => {
					obj[key].forEach((itemValue, itemIndex) => {
						let name = "";
						groupByString.forEach((rowItem) => {
							name += itemValue[rowItem];
						});

						const value = yNumber.length ? [name, itemValue[item], { ...itemValue }, item] : [itemValue[item], name, { ...itemValue }, item];
						let data = {
							value: value,
							itemStyle: {},
							// 图表文字显示
							label: {
								show: true,
								position: "top",
								formatter: function (val) {
									let result = [];
									markArray.forEach((item) => {
										result.push(val.value[2][item]);
									});
									return result.join("\n");
								},
							},
						};
						// 图表颜色
						if (JSON.stringify(markObjColor) !== "{}") {
							data.itemStyle.color = markObjColor[Object.keys(markObjColor)[0]][itemValue[Object.keys(markObjColor)[0]]];
						}
						if (!series[index]) series[index] = [];
						if (series[index][itemIndex]) {
							series[index][itemIndex].data.push(data);
						} else {
							series[index].push({
								type,
								stack: item,
								xAxisIndex: yNumber.length ? groupByString.length : 0,
								yAxisIndex: !yNumber.length ? groupByString.length : 0,
								data: [data],
								labelLayout: {
									hideOverlap: true,
								},
							});
						}
					});
				});
			});
			return series;
		},
		//增减进度条
		getDataZoom(xAxis, yAxis, groupByNumber) {
			const showData = 50 / groupByNumber.length;
			const xAxisEnd = xAxis[0]?.data ? (showData / xAxis[0].data.length) * 100 : 100;
			const yAxisEnd = yAxis[0].data ? (showData / yAxis[0].data.length) * 100 : 100;
			const xAxisIndex = xAxis.map((item, index) => index);
			const yAxisIndex = yAxis.map((item, index) => index);
			return [
				{
					//区域缩放组件的类型为滑块，默认作用在x轴上
					type: "slider",
					//区域缩放组件的过滤模式，none：不过滤数据，只改变数轴范围。
					filterMode: "none",
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
					end: xAxisEnd,
					//为手柄设置阴影效果
					handleStyle: {
						shadowBlur: 6,
						shadowOffsetX: 1,
						shadowOffsetY: 2,
						shadowColor: "#e1eaf3",
					},
					labelFormatter: "",
					xAxisIndex: xAxisIndex,
				},
				{
					//区域缩放组件的类型为内置在坐标系中，默认作用在x轴的坐标系中
					type: "inside",
					//区域缩放组件的过滤模式，none：不过滤数据，只改变数轴范围。
					filterMode: "none",
					xAxisIndex: xAxisIndex,
				},
				{
					//区域缩放组件的类型为滑块，默认作用在x轴上
					type: "slider",
					//区域缩放组件的过滤模式，none：不过滤数据，只改变数轴范围。
					filterMode: "none",
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
					end: yAxisEnd,
					//为手柄设置阴影效果
					handleStyle: {
						shadowBlur: 6,
						shadowOffsetX: 1,
						shadowOffsetY: 2,
						shadowColor: "#e1eaf3",
					},
					labelFormatter: "",
					yAxisIndex: yAxisIndex,
				},
				{
					//区域缩放组件的类型为内置在坐标系中，默认作用在x轴的坐标系中
					type: "inside",
					//区域缩放组件的过滤模式，none：不过滤数据，只改变数轴范围。
					filterMode: "none",
					yAxisIndex: yAxisIndex,
				},
			];
		},
		//提示框
		tooltipFormatter(params, groupByString) {
			let aa = [];
			params.forEach((item, index) => {
				aa.push("");
				const { data, marker } = item;
				const { value } = data;
				Object.keys(value[2]).forEach((dataitem) => {
					if (groupByString.includes(dataitem) && index == 0) {
						aa.splice(
							groupByString.findIndex((item) => item === dataitem),
							0,
							this.axisToField(dataitem) + `:  ${value[2][dataitem]}`
						);
					}

					if (!groupByString.includes(dataitem) && (value[3] === dataitem || typeof value[2][dataitem] === "string" || dataitem.indexOf("z") > -1)) {
						if (value[3] === dataitem) aa.push(marker + " " + this.axisToField(dataitem) + `:  ${value[2][dataitem]}`);
						else aa.push(this.axisToField(dataitem) + `:  ${value[2][dataitem]}`);
					}
				});
			});
			return Array.from(new Set([...aa])).join("<br>");
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
			this.row.map((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction, item.columnName)));
			this.column.map((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction, item.columnName)));
			this.mark.forEach((markItem) => {
				markItem.data.forEach((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction, item.columnName)));
			});

			return obj[name];
		},
		//计算属性对应中文
		calculatorObj(name, columnName) {
			const obj = {
				sum: "总和",
				avg: "平均值",
				count: "计数",
				countDistinct: "计数(不同)",
				max: "最大值",
				min: "最小值",
				stdev: "标准差",
				undefined: "",
				toChar: "",
				"": "",
				null: "",
			};
			return `${obj[name]} ${columnName}`;
		},
	},
};
</script>

<style scoped lang="less"></style>
