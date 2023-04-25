<template>
	<div class="workbook-temp">
		<div class="title">{{ title }}</div>
		<component
			ref="componentRef"
			:is="['bar', 'line', 'scatter'].includes(type) ? 'barLineScatter' : type"
			:ispreview="true"
			:visib="visib"
			:chartData="chartData"
			:mark="mark"
		/>
	</div>
</template>

<script>
import barLineScatter from "./component-bar-line-scatter.vue"; //柱状图
import componentPie from "./component-pie.vue"; //饼图
import componentBoxplot from "./component-boxplot.vue"; //箱线图
import componentHeatMap from "./component-heatmap.vue"; //热力图
import componentText from "./component-text.vue"; //热力图
export default {
	name: "componentsTemp",
	components: { barLineScatter, componentPie, componentBoxplot, componentHeatMap, componentText },
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
		title: String,
		value: {
			type: Array,
			default: () => {},
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
			visualMap: {
				min: 0,
				max: 10,
				calculable: true,
				orient: "vertical",
				right: 50,
				bottom: "0",
				inRange: {
					color: ["transparent"],
				},
			},
			//颜色的汇总值
			colorResultSummary: [],
		};
	},
	methods: {
		//加载图表
		pageLoad() {
			if (this.type === "componentPie") this.chartData = this.dataLogicByPie();
			else this.chartData = this.dataLogic();
			this.$nextTick(() => {
				this.$refs.componentRef.pageLoad();
			});
		},
		//饼图
		dataLogicByPie() {
			let series = { type: "pie", data: [] };

			const { color, angle, mark } = this.markDataLogic().undefined;

			this.value.forEach((item) => {
				series.data.push({
					name: item[Object.keys(color)[0]],
					value: [item[angle[0]] || 1, item[Object.keys(color)[0]], item, "x0"],
					itemStyle: {
						color: Object.keys(color)[0] ? color[Object.keys(color)[0]][item[Object.keys(color)[0]]] : "#5470c6",
					},
					label: {
						show: true,
						position: "top",
						formatter: function (val) {
							const { percent } = val;
							let result = [];
							mark.forEach((item) => {
								result.push(val.value[2][item]);
							});
							result.push(`占比:${percent}%`);
							return result.join("\n");
						},
					},
				});
			});
			return { series };
		},
		//数据逻辑处理
		dataLogic() {
			let rcSummary = { x: { string: [], number: [] }, y: { string: [], number: [] } };
			let result = {}; //结果集

			//指标、维度分类获取
			this.row.concat(this.column).forEach((item) => {
				const { axis, orderBy } = item;
				//指标
				if (this.numberType(item)) rcSummary[axis].number.push(`${axis}${orderBy}`);
				else rcSummary[axis].string.push(`${axis}${orderBy}`);
			});

			//有指标
			result = this.numberFunction(rcSummary);

			return { ...result };
		},

		// ====================================行.列中有指标===============================================
		// 行 列中有指标
		numberFunction(rcSummary) {
			let axisConst = []; //维度常量
			let obj = {}; //数据分组
			let { string: xString, number: xNumber } = rcSummary.x;
			let { string: yString, number: yNumber } = rcSummary.y;
			//说明行列均为指标
			if (!xString.length && !yString.length) {
				xString = xNumber;
				yString = yNumber;
				yNumber = [];
				xNumber = [];
			}
			// 列中有指标，对所有行维度进行分组
			const groupByString = yNumber.length ? xString : yString;
			const groupByNumber = yNumber.length ? yNumber : xNumber;

			//整理数据
			//1.排序[取消排序，排序为后台]
			const valueResult = this.value;
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
			//如果 行列均为维度 获取x的所有常量
			let axisConstX = [];
			let stringObj = {};
			if (!xNumber.length && !yNumber.length) {
				valueResult.forEach((item) => {
					let stringData = "";
					xString.forEach((rowItem) => {
						stringData += item[rowItem];
					});
					if (!stringObj[stringData]) stringObj[stringData] = [];
					stringObj[stringData].push(item);
				});
				xString.forEach((item, index) => {
					Object.keys(stringObj).forEach((value) => {
						if (!axisConstX[index]) axisConstX[index] = [];
						console.log(value[item]);
						axisConstX[index].push(stringObj[value][0][item]);
					});
				});
				//如果都是指标 ，要补缺少的值，成为虚假的连续值
				if (!rcSummary.x.string.length && !rcSummary.y.string.length) {
					axisConstX.forEach((item, index) => {
						const min = Math.min.apply(null, item);
						const max = Math.max.apply(null, item);
						let resultObj = {};
						let resultArray = [];
						for (let i = min; i <= max; i++) {
							resultArray.push(i);
							resultObj[i] = axisConstX[index][i];
						}
						axisConstX.splice(index, 1, resultArray);
						stringObj = resultObj;
					});
				}
			}
			console.log("行列数据与", obj, stringObj, axisConstX, axisConst);
			const objKeys = Object.keys(obj);

			//标记
			const markObj = this.markDataLogic();

			// 行、列
			const { xAxis, yAxis, grid } = this.getxAxisyAxis(yNumber, xNumber, objKeys, axisConst, groupByString, markObj, axisConstX, stringObj);
			//series
			const { series, legend } = this.getSeries(groupByNumber, groupByString, yNumber, objKeys, obj, markObj, axisConstX, xString);

			//dataZoom
			const dataZoom = this.getDataZoom(xAxis, yAxis, groupByNumber);

			//visualMap
			const visualMap = this.getVisualMap(markObj);

			return {
				xAxis,
				yAxis,
				grid,
				series: series.flat(),
				groupByString,
				groupByNumber,
				dataZoom,
				legend,
				resultKeys: Object.keys(obj),
				visualMap,
			};
		},
		//获取x,y轴 grid属性设定
		getxAxisyAxis(yNumber, xNumber, objKeys, axisConst, groupByString, markObj, axisConstX, stringObj) {
			let gridWidth = 0;
			let bottomWidth = 0;
			let yAxis = [];
			let xAxis = [];
			let axisLabelData = [];
			let grid = [];
			let isAllNumber = !xNumber.length && !yNumber.length; //均为维度
			//列中有指标
			if (yNumber.length) {
				yAxis = this.axisNumber;

				//行为指标?数字data:维度常量
				this.$XEUtils.lastEach(axisConst, (item, index) => {
					axisLabelData[index] = [];

					//文本宽度
					const labelWidth =
						this.mark[0].data.filter((markItem) => {
							return markItem.innerText === "labelWidth" && this.axisToField(`x${index}`)?.trim() === markItem.columnRename;
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
				xAxis = isAllNumber ? [] : this.axisNumber;
				this.$XEUtils.lastEach(axisConst, (item, index) => {
					axisLabelData[index] = [];

					// 文本宽度;
					const labelWidth =
						this.mark[0].data.filter((markItem) => {
							return markItem.innerText === "labelWidth" && this.axisToField(`y${index}`)?.trim() === markItem.columnRename;
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
						splitArea: {
							show: isAllNumber,
						},
						inverse: true, //反向坐标
						position: "left",
						offset: gridWidth - labelWidth,
					});
				});
				//均为维度的逻辑
				if (isAllNumber) {
					axisConstX.forEach((item, index) => {
						// 文本宽度;
						const labelWidth =
							this.mark[0].data.filter((markItem) => {
								return markItem.innerText === "labelWidth" && this.axisToField(`x${index}`)?.trim() === markItem.columnRename;
							})[0]?.markValue || 90;

						bottomWidth += bottomWidth == 0 ? labelWidth : labelWidth + 10;

						xAxis.push({
							...this.axisString[0],
							data: item,
							show: true,
							position: "bottom",
							axisLabel: {
								show: true,
								interval: 0,
								rotate: 90,
								width: 90,
								overflow: "truncate",
							},
							splitArea: {
								show: isAllNumber,
							},
							offset: bottomWidth - labelWidth,
						});
					});
					xAxis.push({
						...this.axisString[0],
						data: Object.keys(stringObj),
						show: false,
						position: "bottom",
						splitArea: {
							show: isAllNumber,
						},
					});
				}

				yAxis.push({
					...this.axisString[0],
					data: objKeys,
					show: false,
					inverse: true, //反向坐标
					splitArea: {
						show: isAllNumber,
					},
				});
				grid = [{ left: gridWidth + groupByString.length * 10, bottom: isAllNumber ? bottomWidth + axisConstX.length * 10 : 90 }];
			}
			return { xAxis, yAxis, grid };
		},
		//获取series /legend
		getSeries(groupByNumber, groupByString, yNumber, objKeys, obj, markObj, axisConstX, xString) {
			let series = [];
			let legend = [];
			let stringData = []; //维度汇总数据
			this.colorResultSummary = []; //颜色
			//说明均为维度
			if (axisConstX.length) {
				const { mark: markArray, type, color } = markObj[undefined];
				objKeys.forEach((key) => {
					obj[key].forEach((item) => {
						let name = "";
						let labels = [];
						let value = [item[Object.keys(color)]] || labels;

						xString.forEach((xkey) => {
							name += item[xkey];
						});
						markArray.forEach((mkey) => {
							labels.push(item[mkey]);
						});
						stringData.push([name, key, value.toString(), labels.toString()]);
					});
				});
				this.colorResultSummary = stringData.map((item) => item[2] * 1);

				series = [
					[
						{
							type: type,
							data: stringData,
							yAxisIndex: groupByString.length,
							xAxisIndex: xString.length,
							label: {
								show: true,
								color: "#000",
								formatter: function (val) {
									return val.data[3].replace(",", "\n");
								},
							},
						},
					],
				];
				return { series, legend };
			}
			groupByNumber.forEach((item, index) => {
				const markValue = markObj[item] ? markObj[item] : markObj[undefined];
				//颜色、标签
				const { color: markObjColor, mark: markArray, type } = markValue;
				console.log("markObjColor", markValue);
				//legend 设定
				if (JSON.stringify(markObjColor) !== "{}") {
					Object.keys(Object.values(markObjColor)[0]).forEach((item) => {
						legend.push({ name: item, itemStyle: { color: Object.values(markObjColor)[0][item] } });
					});
				}

				objKeys.forEach((key) => {
					console.log(obj[key]);
					obj[key].forEach((itemValue, itemIndex) => {
						//visualMap 汇总值 为获取最小值与最大值 [若有颜色设定]
						if (JSON.stringify(markObjColor) !== "{}") this.colorResultSummary.push(itemValue[Object.keys(markObjColor)[0]]);

						let name = "";
						groupByString.forEach((rowItem) => {
							name += itemValue[rowItem];
						});

						const value = yNumber.length ? [name, itemValue[item], { ...itemValue }, item] : [itemValue[item], name, { ...itemValue }, item];
						let data = {
							name: "",
							value: value,
							itemStyle: {},
							// 图表文字显示
							label: {
								show: true,
								position: yNumber.length ? "top" : "right",
								formatter: function (val) {
									let result = [];
									markArray.forEach((item) => {
										result.push(val.value[2][item]);
									});
									return result.join("\n");
								},
							},
						};
						// 图表颜色 字符串类型
						if (JSON.stringify(markObjColor) !== "{}" && !Object.values(markObjColor)[0].startRange) {
							const colorName = itemValue[Object.keys(markObjColor)[0]];
							const color = markObjColor[Object.keys(markObjColor)[0]][colorName];
							data.itemStyle.color = color;
							data.name = colorName;
						}
						if (!series[index]) series[index] = [];
						if (series[index][itemIndex]) {
							series[index][itemIndex].data.push(data);
						} else {
							let seriesObj = {
								type,
								stack: item,
								xAxisIndex: yNumber.length ? groupByString.length : 0,
								yAxisIndex: !yNumber.length ? groupByString.length : 0,
								data: [data],
								labelLayout: {
									hideOverlap: true,
								},
							};
							series[index].push(seriesObj);
						}
					});
				});
			});

			return { series, legend };
		},
		//增减进度条
		getDataZoom(xAxis, yAxis, groupByNumber) {
			const showData = 15 / groupByNumber.length;
			const xAxisEnd = { end: xAxis[0]?.data ? (showData / xAxis[0].data.length) * 100 : 100 };
			const yAxisEnd = { end: yAxis[0]?.data ? (showData / yAxis[0].data.length) * 100 : 100 };
			//滚动条设定  minValueSpan：最小显示的值数量
			// const xAxisEnd = xAxis[0]?.data ? { minValueSpan: 15, maxValueSpan: 15 } : { end: 100 };
			// const yAxisEnd = yAxis[0]?.data ? { minValueSpan: 15, maxValueSpan: 15 } : { end: 100 };
			const xAxisIndex = xAxis.map((item, index) => index);
			const yAxisIndex = yAxis.map((item, index) => index);
			return [
				{
					//区域缩放组件的类型为滑块，默认作用在x轴上
					type: "slider",
					//区域缩放组件的过滤模式，none：不过滤数据，只改变数轴范围。
					filterMode: "none",
					showDataShadow: false,
					bottom: 22,
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
					...xAxisEnd,
					//为手柄设置阴影效果
					handleStyle: {
						shadowBlur: 6,
						shadowOffsetX: 1,
						shadowOffsetY: 2,
						shadowColor: "#e1eaf3",
					},
					labelFormatter: "",
					moveHandleSize: 12,
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
					right: 22,
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
					...yAxisEnd,
					//为手柄设置阴影效果
					handleStyle: {
						shadowBlur: 6,
						shadowOffsetX: 1,
						shadowOffsetY: 2,
						shadowColor: "#e1eaf3",
					},
					labelFormatter: "",
					yAxisIndex: yAxisIndex,
					moveHandleSize: 12,
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
		//获取颜色
		getVisualMap(markObj) {
			let result = false;
			const { color } = markObj[undefined];
			//说明字段为数字类型
			if (JSON.stringify(color) !== "{}" && Object.values(color)[0]?.startRange) {
				const { color } = markObj[undefined];
				const { startRange, endRange } = Object.values(color)[0];
				result = {
					...this.visualMap,
					inRange: { color: [startRange, endRange] },
					min: Math.min.apply(null, this.colorResultSummary),
					max: Math.max.apply(null, this.colorResultSummary),
				};
			}
			return result;
		},
		//提示框
		tooltipFormatter(params, groupByString) {
			console.log(groupByString, params);
			let aa = [""];
			const { value, marker, seriesType, percent } = params;
			const tooltipValue = value[4] ? value[4] : value[2];
			console.log(tooltipValue);
			Object.keys(tooltipValue).forEach((dataitem) => {
				if (groupByString.includes(dataitem)) {
					aa.splice(
						groupByString.findIndex((item) => item === dataitem),
						0,
						this.axisToField(dataitem) + `:  ${tooltipValue[dataitem]}`
					);
				}

				if (
					!groupByString.includes(dataitem) &&
					(value[3] === dataitem || typeof tooltipValue[dataitem] === "string" || dataitem.indexOf("z") > -1)
				) {
					if (value[3] === dataitem) aa.push(marker + " " + this.axisToField(dataitem) + `:  ${tooltipValue[dataitem]}`);
					else aa.push(this.axisToField(dataitem) + `:  ${tooltipValue[dataitem]}`);
				}
			});
			//饼图增加百分比
			if (seriesType == "pie") aa.push(`占比:${percent}%`);
			return Array.from(new Set([...aa])).join("<br>");
		},
		//标记
		markDataLogic() {
			let markObj = {};
			//标记
			this.mark.forEach((item) => {
				markObj[item.stack] = { color: {}, mark: [], angle: [], type: item.chartType };
				item.data.forEach((markItem) => {
					const { innerText, markValue, axis, orderBy } = markItem;
					//颜色
					if (innerText === "color") {
						//数组类型
						if (Array.isArray(markValue)) {
							markValue?.forEach((data) => {
								const { title, color } = data;
								if (!markObj[item.stack].color[`${axis}${orderBy}`]) markObj[item.stack].color[`${axis}${orderBy}`] = {};
								markObj[item.stack].color[`${axis}${orderBy}`][title] = color;
							});
						} else {
							markObj[item.stack].color[`${axis}${orderBy}`] = markValue;
						}
					}
					//标签
					if (innerText === "mark") {
						markObj[item.stack].mark.push(`${axis}${orderBy}`);
					}
					//角度
					if (innerText === "angle") {
						markObj[item.stack].angle.push(`${axis}${orderBy}`);
					}
				});
			});
			return markObj;
		},
		//数字类型
		numberType(item) {
			const stringFunction = ["toChar", "YYYY", "MM", "DD", "Q", "WK", "HH"];
			return item.dataType === "Number" || (item.calculatorFunction && !stringFunction.includes(item.calculatorFunction));
		},
		//字符串类型
		stringType(item) {
			const stringFunction = ["toChar", "YYYY", "MM", "DD", "Q", "WK", "HH"];
			return item.dataType !== "Number" || !item.calculatorFunction || stringFunction.includes(item.calculatorFunction);
		},

		//轴名 对应 字段名称
		axisToField(name) {
			let obj = {};
			this.row.map((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction, item.columnRename)));
			this.column.map((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction, item.columnRename)));
			this.mark.forEach((markItem) => {
				markItem.data.forEach((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction, item.columnRename)));
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
				YYYY: "年",
				MM: "月",
				DD: "日",
				HH: "时",
				Q: "季",
				WK: "周",
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

<style scoped lang="less">
.workbook-temp {
	height: calc(100% - 50px);
	padding: 5px;
	margin: 5px;
	.title {
		text-align: center;
		font-size: 16px;
		font-weight: bold;
	}
}
</style>
