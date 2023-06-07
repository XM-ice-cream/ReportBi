<template>
	<div style="height: 100%; padding-top: 40px">
		<div class="title">{{ title }}</div>
		<Tooltip content="导出PDF" placement="top-start" class="download">
			<icon custom="iconfont icon-pdfdayin" @click="exportPDF" />
		</Tooltip>
		<div class="workbook-temp" ref="workbookTempRef">
			<div :style="tempStyle" ref="exportContent">
				<component
					ref="componentRef"
					:is="['bar', 'line', 'scatter'].includes(type) ? 'barLineScatter' : type"
					:ispreview="true"
					:visib="visib"
					:chartData="chartData"
					:mark="mark"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import barLineScatter from "./component-bar-line-scatter.vue"; //柱状图
import componentPie from "./component-pie.vue"; //饼图
import componentBoxplot from "./component-boxplot.vue"; //箱线图
import componentHeatMap from "./component-heatmap.vue"; //热力图
import componentText from "./component-text.vue"; //热力图

import { formatDate } from "@/libs/tools";
import html2Canvas from "html2canvas";
import jsPDF from "jspdf";

import "@/assets/js/simhei-normal.js";

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
			tempStyle: { width: "1287px", height: "649px" },
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
				right: 50,
				bottom: 50,
			},
			//颜色的汇总值
			colorResultSummary: [],
			dimension: 0,
		};
	},
	methods: {
		//导出PDF
		async exportPDF() {
			const canvas = this.$refs.componentRef.myChart.getDom().getElementsByTagName("canvas")[0];
			const direction = this.chartData.yAxis[0]?.type == "value" ? "l" : "p";
			const filename = `${this.title}${formatDate(new Date())}.pdf`;
			const title = this.title;
			this.domToPdf(canvas, filename, direction, title);
		},
		domToPdf(dom, filename, direction, title) {
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
			html2Canvas(dom, {
				allowTaint: true,
				useCORS: true,
			}).then((canvas) => {
				let pdf = new jsPDF("landscape", "pt");
				pdf.setFontSize(8);
				pdf.setTextColor("#767676");
				pdf.setFont("simhei");

				let ctx = canvas.getContext("2d");
				ctx.canvas.willReadFrequently = true;

				//pdf 的宽高
				let pdfWidth = pdf.internal.pageSize.getWidth() - 20;
				let pdfHeight = pdf.internal.pageSize.getHeight() - 30;
				let contentWidth = canvas.width;
				let contentHeight = canvas.height;

				let bi = pdfHeight / pdfWidth;
				let imgWidth = direction == "p" ? contentWidth : contentHeight / bi; // A4 页面宽度
				let imgHeight = direction == "l" ? contentHeight : contentWidth * bi;

				let contentRadio = Math.max(contentWidth / pdfWidth, contentHeight / pdfHeight);
				if (contentRadio <= 1) {
					imgWidth = contentWidth;
					imgHeight = contentHeight;
				}
				const radioTmp = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
				// 页面偏移
				let positionX = 0;
				let positionY = 0;

				let iLength = Math.ceil(contentHeight / imgHeight);
				let jLength = Math.ceil(contentWidth / imgWidth);

				for (let i = 0; i < iLength; i++) {
					positionX = 0;
					positionY = i * imgHeight;
					for (let j = 0; j < jLength; j++) {
						let imageData = ctx.getImageData(positionX, positionY, imgWidth, imgHeight);

						let base64Img = this.getImageDataDataURL(imageData);

						// 添加页眉
						pdf.text(`${title}`, pdf.internal.pageSize.width / 2, 10, "center");
						//图片
						pdf.addImage(base64Img, "JPEG", 10, 20, imgWidth * radioTmp, imgHeight * radioTmp);
						//添加页尾
						pdf.text(
							"page " + (i * jLength + j + 1) + " of " + iLength * jLength,
							pdf.internal.pageSize.width / 2,
							pdf.internal.pageSize.height - 10,
							"center"
						);
						if (!(i == iLength - 1 && j == jLength - 1)) pdf.addPage();
						positionX = (j + 1) * imgWidth;
					}
				}

				// 下载操作
				pdf.save(filename);
			});
		},
		// 将 ImageData 转换为 base64 格式的图片数据
		getImageDataDataURL(imageData) {
			let canvasTemp = document.createElement("canvas");
			canvasTemp.width = imageData.width;
			canvasTemp.height = imageData.height;
			canvasTemp.getContext("2d").putImageData(imageData, 0, 0);
			return canvasTemp.toDataURL("image/png");
		},
		//加载图表
		pageLoad() {
			if (this.type === "componentPie") this.chartData = this.dataLogicByPie();
			else this.chartData = this.dataLogic();
			console.log(" this.chartData", this.chartData, this.$refs.componentRef);
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
					//行
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
					//列
					axisConst.forEach((item, index) => {
						const min = Math.min.apply(null, item);
						const max = Math.max.apply(null, item);
						let resultObj = {};
						let resultArray = [];
						for (let i = min; i <= max; i++) {
							resultArray.push(i);
							resultObj[i] = obj[i] || [];
						}
						axisConst.splice(index, 1, resultArray);
						obj = resultObj;
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
				grid = [{ bottom: gridWidth + groupByString.length * 10, left: 100, top: 50, right: 200 }];
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
				grid = [
					{
						left: gridWidth + groupByString.length * 10,
						bottom: isAllNumber ? bottomWidth + axisConstX.length * 10 : 90,
						top: 50,
						right: 200,
					},
				];
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
				this.dimension = 5;
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
						//数组 最后一个是数值
						stringData.push([name, key, "", labels.toString(), item, value.toString()]);
					});
				});
				this.colorResultSummary = stringData.map((item) => item[5] * 1);

				series = [
					[
						{
							type: type,
							data: stringData,
							yAxisIndex: groupByString.length,
							xAxisIndex: xString.length,
							label: {
								show: true,
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
				if (JSON.stringify(markObjColor) !== "{}" && !Object.values(markObjColor)[0].startRange) {
					Object.keys(Object.values(markObjColor)[0]).forEach((item) => {
						legend.push({ name: item, itemStyle: { color: Object.values(markObjColor)[0][item] } });
					});
				}

				objKeys.forEach((key) => {
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
						};
						// 图表颜色 字符串类型
						if (JSON.stringify(markObjColor) !== "{}") {
							//数字
							if (Object.values(markObjColor)[0].startRange) {
								//X轴、Y轴、...、数值 最后一个是热力图的对应的值
								//判断是否为数字类型
								const value0IsNumber = /^\d+$/.test(value[0]);
								data = [value[0], value[1], { ...itemValue }, value0IsNumber ? value[0] : value[1]]; //取前两个
								this.dimension = value0IsNumber ? 0 : 1;
							} else {
								//字符串
								const colorName = itemValue[Object.keys(markObjColor)[0]];
								const color = markObjColor[Object.keys(markObjColor)[0]][colorName];
								data.itemStyle.color = color;
								data.name = colorName;
							}
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
							series[index].push(seriesObj);
						}
					});
				});
			});

			return { series, legend };
		},
		//增减进度条
		getDataZoom(xAxis, yAxis, groupByNumber) {
			// const showData = 15 / groupByNumber.length;
			// const xAxisEnd = { end: xAxis[0]?.data ? (15 / xAxis[0].data.length) * 100 : 100 };
			// const yAxisEnd = { end: yAxis[0]?.data ? (15 / yAxis[0].data.length) * 100 : 100 };
			// const xAxisIndex = xAxis.map((item, index) => index);
			// const yAxisIndex = yAxis.map((item, index) => index);
			//滚动条设定  minValueSpan：最小显示的值数量
			// const xAxisEnd = xAxis[0]?.data ? { minValueSpan: 15, maxValueSpan: 15 } : { end: 100 };
			// const yAxisEnd = yAxis[0]?.data ? { minValueSpan: 15, maxValueSpan: 15 } : { end: 100 };
			const { offsetWidth, offsetHeight } = this.$refs.workbookTempRef;
			const width = offsetWidth - 20;
			const height = offsetHeight - 20;
			const xLength = width / 16 < xAxis[0]?.data?.length ? `${xAxis[0].data.length * 16}px` : `${width}px`;
			const yLength = height / 16 < yAxis[0]?.data?.length ? `${yAxis[0].data.length * 16}px` : `${height}px`;
			console.log(xLength, yLength, width);
			this.tempStyle.width = xLength;
			this.tempStyle.height = yLength;
			// return [
			// 	{
			// 		//区域缩放组件的类型为滑块，默认作用在x轴上
			// 		type: "slider",
			// 		//区域缩放组件的过滤模式，none：不过滤数据，只改变数轴范围。
			// 		filterMode: "none",
			// 		showDataShadow: false,
			// 		bottom: 22,
			// 		height: 10,
			// 		//区域缩放组件边框颜色
			// 		borderColor: "transparent",
			// 		//区域缩放组件边框背景
			// 		backgroundColor: "#e1eaf3",
			// 		//区域缩放组件上的手柄的样式
			// 		handleIcon:
			// 			"M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z", // jshint ignore:line
			// 		//手柄大小
			// 		handleSize: 18,
			// 		...xAxisEnd,
			// 		//为手柄设置阴影效果
			// 		handleStyle: {
			// 			shadowBlur: 6,
			// 			shadowOffsetX: 1,
			// 			shadowOffsetY: 2,
			// 			shadowColor: "#e1eaf3",
			// 		},
			// 		labelFormatter: "",
			// 		moveHandleSize: 12,
			// 		xAxisIndex: xAxisIndex,
			// 	},
			// 	{
			// 		//区域缩放组件的类型为内置在坐标系中，默认作用在x轴的坐标系中
			// 		type: "inside",
			// 		//区域缩放组件的过滤模式，none：不过滤数据，只改变数轴范围。
			// 		filterMode: "none",
			// 		xAxisIndex: xAxisIndex,
			// 	},
			// 	{
			// 		//区域缩放组件的类型为滑块，默认作用在x轴上
			// 		type: "slider",
			// 		//区域缩放组件的过滤模式，none：不过滤数据，只改变数轴范围。
			// 		filterMode: "none",
			// 		showDataShadow: false,
			// 		right: 22,
			// 		width: 10,
			// 		//区域缩放组件边框颜色
			// 		borderColor: "transparent",
			// 		//区域缩放组件边框背景
			// 		backgroundColor: "#e1eaf3",
			// 		//区域缩放组件上的手柄的样式
			// 		handleIcon:
			// 			"M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z", // jshint ignore:line
			// 		//手柄大小
			// 		handleSize: 18,
			// 		...yAxisEnd,
			// 		//为手柄设置阴影效果
			// 		handleStyle: {
			// 			shadowBlur: 6,
			// 			shadowOffsetX: 1,
			// 			shadowOffsetY: 2,
			// 			shadowColor: "#e1eaf3",
			// 		},
			// 		labelFormatter: "",
			// 		yAxisIndex: yAxisIndex,
			// 		moveHandleSize: 12,
			// 	},
			// 	{
			// 		//区域缩放组件的类型为内置在坐标系中，默认作用在x轴的坐标系中
			// 		type: "inside",
			// 		//区域缩放组件的过滤模式，none：不过滤数据，只改变数轴范围。
			// 		filterMode: "none",
			// 		yAxisIndex: yAxisIndex,
			// 	},
			// ];
		},
		//获取颜色
		getVisualMap(markObj) {
			let result = false;
			const { color } = markObj[undefined];
			//说明字段为数字类型
			if (JSON.stringify(color) !== "{}" && Object.values(color)[0]?.startRange) {
				const { color } = markObj[undefined];
				const { startRange, endRange, colorType, pieces, outOfRange } = Object.values(color)[0];
				//区段值
				if (colorType === 0) {
					result = {
						...this.visualMap,
						dimension: this.dimension,
						pieces,
						outOfRange: {
							color: outOfRange,
						},
					};
				} else {
					//连续
					result = {
						...this.visualMap,
						dimension: this.dimension,
						calculable: true,
						inRange: { color: [startRange, endRange] },
						min: Math.min.apply(null, this.colorResultSummary),
						max: Math.max.apply(null, this.colorResultSummary),
					};
				}
			}
			return result;
		},
		//提示框
		tooltipFormatter(params, groupByString) {
			// console.log(groupByString, params);
			let aa = [""];
			const { value, marker, seriesType, percent } = params;
			const tooltipValue = value[4] ? value[4] : value[2];
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
			const numberFunction = ["count", "countDistinct"];
			const isNotContinue = item.dataType === "Number" || numberFunction.includes(item.calculatorFunction);
			return item.isContinue === "1" ? true : item.isContinue === "0" ? false : isNotContinue;
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
<style></style>
<style scoped lang="less">
.workbook-temp {
	width: 100%;
	height: calc(100% - 20px);
	padding: 5px;
	margin: 5px;
	overflow: auto;
}
.title {
	text-align: center;
	font-size: 16px;
	font-weight: bold;
	position: absolute;
	top: 2%;
	left: 50%;
}
.download {
	position: absolute;
	top: 2%;
	right: 2%;
	i {
		font-size: 24px;
		&:hover {
			color: #27ce88;
			font-size: 26px;
		}
	}
}
</style>
