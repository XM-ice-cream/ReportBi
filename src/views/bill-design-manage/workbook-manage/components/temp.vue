<template>
	<div class="temp" :class="isPreview ? 'temp-preview' : ''" v-if="visib">
		<div class="title">{{ title }}</div>

		<Button type="text" class="download" @click="exportExcel" v-if="type === 'componentTable'" title="导出excel">
			<icon custom="iconfont icon-excel" />
		</Button>
		<Dropdown class="download" @on-click="exportPDF" v-else title="导出PDF">
			<icon custom="iconfont icon-pdfdayin" />
			<template #list>
				<DropdownMenu>
					<DropdownItem :name="0">导出当前PDF</DropdownItem>
					<DropdownItem :name="1">导出批量PDF</DropdownItem>
				</DropdownMenu>
			</template>
		</Dropdown>

		<div class="workbook-temp" ref="workbookTempRef">
			<div :style="tempStyle" ref="exportContent">
				<template v-if="['bar', 'line', 'scatter'].includes(type)">
					<component
						ref="componentRef"
						is="barLineScatter"
						:id="id"
						:title="title"
						:ispreview="true"
						:visib="visib"
						:tempStyle="tempStyle"
						:chartData="item"
						:mark="mark"
						v-for="(item, index) in chartData"
						:key="index"
					/>
				</template>
				<template v-else>
					<component
						ref="componentRef"
						:is="['bar', 'line', 'scatter'].includes(type) ? 'barLineScatter' : type"
						:id="id"
						:title="title"
						:ispreview="true"
						:visib="visib"
						:tempStyle="tempStyle"
						:chartData="chartData"
						:mark="mark"
					/>
				</template>
			</div>
		</div>
		<canvas id="canvas-img" style="display: none" />
		<canvas id="canvas-base64" style="display: none" />
	</div>
</template>
<script>
import barLineScatter from "./component-bar-line-scatter.vue"; //柱状图
import componentPie from "./component-pie.vue"; //饼图
import componentBoxplot from "./component-boxplot.vue"; //箱线图
import componentHeatMap from "./component-heatmap.vue"; //热力图
import componentText from "./component-text.vue"; //热力图
import componentTable from "./component-table.vue"; //表格
import { getImageReq } from "@/api/bill-design-manage/workbook-design";
import { formatDate } from "@/libs/tools";
import html2Canvas from "html2canvas";
import jsPDF from "jspdf";

import "@/assets/js/simhei-normal.js";

export default {
	name: "componentsTemp",
	components: { barLineScatter, componentPie, componentBoxplot, componentHeatMap, componentText, componentTable },
	model: {
		prop: "value",
		event: "input",
	},
	props: {
		isPreview: Boolean, //是否是预览
		id: String,
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
			modalLoading: false,
			chartData: {},
			tempStyle: { width: "1287px", height: "649px" },
			// 数字属性
			axisNumber: {
				type: "value",
				boundaryGap: [0, 0.01],
			},
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
						padding: [0, 8, 0, 0],
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
			domCanvas: null,
			pdf: "",
			canvasTemp: null,
			//维度对应的字段名称
			fileName: {},
		};
	},
	methods: {
		//导出PDF
		async exportPDF(type) {
			//创建PDF
			this.pdf = new jsPDF("landscape", "pt");
			this.pdf.setFontSize(8);
			this.pdf.setTextColor("#767676");
			this.pdf.setFont("simhei");
			//PDF名称
			let filename = "";

			//导出当前工作簿
			if (!type) {
				const dom = this.$refs.componentRef.myChart[this.id].getDom().getElementsByTagName("canvas")[0];

				html2Canvas(dom, { allowTaint: true, useCORS: true }).then((canvas) => {
					let contentWidth = canvas.width;
					let contentHeight = canvas.height;
					let ctx = canvas.getContext("2d");

					ctx.canvas.willReadFrequently = true;
					const direction = this.chartData.yAxis && this.chartData.yAxis[0]?.type == "value" ? "l" : "p";
					filename = `${this.title}_`;
					const title = this.title;
					const obj = { ctx, direction, title, contentWidth, contentHeight, filename, index: 1, indexLength: 1 };
					this.domToPdf(obj);
				});
			} else {
				//获取对应人员 导出打开界面的所有工作簿
				let pageTotalTemp = 1;
				let pageIndexTemp = 1;
				this.$Spin.show();
				for (let i = pageIndexTemp; i <= pageTotalTemp; i++) {
					const obj = {
						orderField: "id",
						ascending: true,
						pageSize: 1,
						pageIndex: pageIndexTemp,
						total: 0,
						data: {
							id: window.localStorage.getItem("workBook"),
						},
					};
					await getImageReq(obj).then(async (res) => {
						const result = res?.result || [];
						const { pageSize, pageIndex, totalPage, data } = result;
						const item = data[0];

						pageTotalTemp = totalPage;

						const { canvas, direction, title, tempStyle } = JSON.parse(item.imageJson);

						const { width: contentWidth, height: contentHeight } = tempStyle;
						const ctx = await this.drawImage(canvas, contentWidth, contentHeight);
						filename += `${title}_`;

						const obj = { ctx, direction, title, contentWidth, contentHeight, filename, index: pageIndexTemp, indexLength: pageTotalTemp };
						await this.domToPdf(obj);
						pageIndexTemp++;
						// result?.forEach(async (item, index) => {

						// });
					});
				}
			}
		},
		//导出pdf
		async domToPdf(data) {
			const { ctx, direction, title, contentWidth, contentHeight, filename, index, indexLength } = data;
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;

			//pdf 的宽高
			let pdfWidth = this.pdf.internal.pageSize.getWidth() - 20;
			let pdfHeight = this.pdf.internal.pageSize.getHeight() - 30;

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
					// let imageData = ctx.getImageData(0, 0, contentWidth, contentHeight);
					let base64Img = this.getImageDataDataURL(imageData);
					// await this.createImage(base64Img, "截图");
					// 添加页眉
					this.pdf.text(`${title}`, this.pdf.internal.pageSize.width / 2, 10, "center");
					//图片
					this.pdf.addImage(base64Img, "JPEG", 10, 20, imgWidth * radioTmp, imgHeight * radioTmp);
					//添加页尾
					this.pdf.text(
						"page " + (i * jLength + j + 1) + " of " + iLength * jLength,
						this.pdf.internal.pageSize.width / 2,
						this.pdf.internal.pageSize.height - 10,
						"center"
					);
					if (!(i == iLength - 1 && j == jLength - 1 && index == indexLength)) {
						this.pdf.addPage();
					}
					positionX = (j + 1) * imgWidth;
				}
			}

			// 清空整个 Canvas
			ctx.clearRect(0, 0, contentWidth, contentHeight);
			// 下载操作(下载到最后一个生成pdf)
			// await this.$nextTick();
			if (index == indexLength) {
				this.pdf.save(`${filename}${formatDate(new Date())}.pdf`);
				this.$Spin.hide(); //隐藏loading
			}
		},
		createImage(base64Img, type) {
			const div = document.getElementsByClassName("workbook-temp")[0];
			var im = document.createElement("img"); //创建图片
			var p = document.createElement("p");
			p.appendChild(document.createTextNode(`---------------,${type}`));
			im.src = base64Img;
			//图片设置成和div一样大小
			im.style.width = 900;
			im.style.height = 600;
			div.appendChild(p);
			div.appendChild(im);
		},
		// 将 ImageData 转换为 base64 格式的图片数据
		getImageDataDataURL(imageData) {
			// 从内存中清除 <canvas> 元素
			if (this.canvasTemp?.width) {
				this.canvasTemp.width = 0;
				this.canvasTemp.height = 0;
				this.canvasTemp = null;
			}

			this.canvasTemp = document.getElementById("canvas-base64");

			this.canvasTemp.width = imageData.width;
			this.canvasTemp.height = imageData.height;
			const context = this.canvasTemp.getContext("2d");

			context.putImageData(imageData, 0, 0);
			const base64Image = this.canvasTemp.toDataURL("image/png");
			// this.createImage(base64Image, "ImageData");
			//清空内容
			context.clearRect(0, 0, 2000, 2000);

			return base64Image;
		},
		//base64码转成canvas
		drawImage(base64Image, width, height) {
			// 从内存中清除 <canvas> 元素
			if (this.domCanvas?.width) {
				this.domCanvas.width = 0;
				this.domCanvas.height = 0;
				this.domCanvas = null;
			}
			// 创建一个新的 canvas 元素
			this.domCanvas = document.getElementById("canvas-img");
			this.domCanvas.width = width;
			this.domCanvas.height = height;

			const ctx = this.domCanvas.getContext("2d");

			const img = new Image();
			const promise = new Promise((resolve) => {
				img.onload = function () {
					ctx.drawImage(img, 0, 0);
					resolve();
				};
			});
			img.src = base64Image;

			return promise.then(() => {
				// this.createImage(this.domCanvas.toDataURL(), "转成canvas");
				return ctx;
			});
		},
		//导出表格
		exportExcel() {
			const fileName = `${this.title}` + "-" + `${formatDate(new Date())}.xls`;
			// 前端自己导出表格
			$("#myTable").table2excel({
				exclude: ".hidden-cell", // 排除包含 .hidden-cell 类的单元格
				filename: fileName, //文件名称,
				exclude_bg_color: false, //是否显示背景颜色
			});
		},

		//加载图表
		pageLoad() {
			//表格
			if (this.type === "componentTable") {
				this.tempStyle = { width: "100%", height: "100%" };
				this.chartData = { row: this.row, column: this.column, mark: this.mark, value: this.value, renameObj: this.axisToField() };
			}
			//饼图
			else if (this.type === "componentPie") this.chartData = this.dataLogicByPie();
			else this.chartData = this.dataLogic();
			this.$nextTick(() => {
				console.log(this.$refs);
				this.$refs.componentRef.forEach((item) => item.pageLoad());
				this.$nextTick(() => {
					// 当滚动条从没有到有时，不加setTimeout滚动条将不会滚动到底部
					setTimeout(() => {
						let overflowY = this.$el.getElementsByClassName("workbook-temp")[0];
						if (!overflowY) {
							return;
						}
						overflowY.scrollTop = overflowY.scrollHeight;
					}, 1);
				});
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
			debugger;
			let rcSummary = { x: { string: [], number: [] }, y: { string: [], number: [] }, commonGrid: [] };
			let result = []; //结果集

			//指标、维度分类获取
			this.row.concat(this.column).forEach((item) => {
				console.log(item);
				const { axis, orderBy, columnRename } = item;
				if (item?.setGrid) {
					const { isDesign } = item.setGrid;
					isDesign ? rcSummary.commonGrid.push(`${axis}${orderBy}`) : "";
				}
				rcSummary[`${axis}${orderBy}`] = columnRename;

				//指标
				if (this.numberType(item)) rcSummary[axis].number.push(`${axis}${orderBy}`);
				else rcSummary[axis].string.push(`${axis}${orderBy}`);
			});
			this.fileName = rcSummary;
			//有指标
			result = this.numberFunction(rcSummary);
			console.log("result", result);
			return result;
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
						axisConstX[index].push(stringObj[value][0][item]);
					});
				});
				//如果都是指标 ，要补缺少的值，成为虚假的连续值
				if (!rcSummary.x.string.length && !rcSummary.y.string.length) {
					//行
					axisConstX.forEach((item, index) => {
						const remark = JSON.parse(this.row[index].remark);
						const min = remark ? remark.min : Math.min.apply(null, item);
						const max = remark ? remark.max : Math.max.apply(null, item);

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
						const remark = JSON.parse(this.column[index].remark);
						const min = remark ? remark.min : Math.min.apply(null, item);
						const max = remark ? remark.max : Math.max.apply(null, item);
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
			const objKeys = Object.keys(obj);

			//标记
			const markObj = this.markDataLogic();
			const paramsObj = {
				yNumber,
				xNumber,
				objKeys,
				axisConst,
				groupByString,
				markObj,
				axisConstX,
				stringObj,
				commonGrid: rcSummary.commonGrid,
				groupByNumber,
				yNumber,
				obj,
				xString,
			};
			// 行、列
			const { xAxis, yAxis, grid } = this.getxAxisyAxis(paramsObj);
			//series
			const { series, legend } = this.getSeries(paramsObj);
			//dataZoom
			const dataZoom = this.getDataZoom(paramsObj, grid);

			//visualMap
			const visualMap = this.getVisualMap(markObj);

			//把他变成分组 5000为一组
			// const splitNum = 5000;
			// const group = Math.ceil(series.flat()[0].data.length / splitNum);
			// let groupArr = [];
			// for (let i = 0; i < group; i++) {
			// 	groupArr.push({
			// 		xAxis: xAxis[0]?.data
			// 			? xAxis.map((item) => {
			// 					return { ...item, data: item.data.slice(i, (i + 1) * splitNum) };
			// 			  })
			// 			: xAxis,
			// 		yAxis: yAxis[0]?.data
			// 			? yAxis.map((item) => {
			// 					return { ...item, data: item.data.slice(i, (i + 1) * splitNum) };
			// 			  })
			// 			: yAxis,
			// 		grid,
			// 		series: series.flat().map((item) => {
			// 			return { ...item, data: item.data.slice(i, (i + 1) * splitNum), large: true, largeThreshold: 500, sampling: "lttb" };
			// 		}),
			// 		groupByString,
			// 		groupByNumber,
			// 		dataZoom,
			// 		legend,
			// 		resultKeys: Object.keys(obj),
			// 		visualMap,
			// 	});
			// }
			// console.log(groupArr);
			return [
				{
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
				},
			];
		},
		//获取x,y轴 grid属性设定
		getxAxisyAxis(paramsObj) {
			const { yNumber, xNumber, objKeys, axisConst, groupByString, markObj, axisConstX, stringObj, commonGrid } = paramsObj;
			console.log(yNumber, xNumber, objKeys, axisConst, groupByString, markObj, axisConstX, stringObj);
			let gridWidth = 0;
			let bottomWidth = 0;
			let yAxis = [];
			let xAxis = [];
			let axisLabelData = [];
			let grid = [];
			console.log(xNumber.length, yNumber.length);
			debugger;
			let isAllNumber = !xNumber.length && !yNumber.length; //均为维度
			const { offsetWidth, offsetHeight } = this.$refs.workbookTempRef;
			const width = offsetWidth - 20 - 20;
			const height = offsetHeight - 20 - 50;
			//列中有指标
			if (yNumber.length) {
				//计算每个图表高度
				for (let i = 0; i < yNumber.length; i++) {
					gridWidth = 0;
					console.log(commonGrid.includes(yNumber[i]), 1);
					//如果不存在合并图表
					if (!commonGrid.includes(yNumber[i])) {
						console.log(3);
						grid.push({ right: 20, left: 100 });
						yAxis.push({
							name: this.axisToField()[`${yNumber[i]}`]?.trim(),
							nameTextStyle: {
								fontStyle: "normal",
								fontSize: 16,
								padding: [14, 14, 14, 14],
							},
							nameLocation: "middle",
							...this.axisNumber,
							gridIndex: i,
						});
					}

					//行为指标?数字data:维度常量
					this.$XEUtils.lastEach(axisConst, (item, index) => {
						axisLabelData[index] = [];

						//文本宽度
						const labelWidth =
							this.mark[0].data.filter((markItem) => {
								return (
									markItem.innerText === "labelWidth" &&
									this.axisToField()[`x${index}`]?.trim() === this.axisToField()[`z${markItem.orderBy}`]?.trim()
								);
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
							gridIndex: i,
							show: i === 0,
						});
					});
					xAxis.push({
						...this.axisString[0],
						data: objKeys,
						show: false,
						gridIndex: i,
					});
				}
				const boxHeight = yNumber.length > 3 ? 150 : (height - gridWidth) / yNumber.length;
				grid = grid.map((item, index) => {
					if (index === grid.length - 1) {
						item.top = 50;
						item.height = "auto";
					} else {
						item.height = boxHeight - 20; //减20 让每一个grid上下有间距
					}
					return { ...item, bottom: boxHeight * index + gridWidth };
				});

				// grid = [{ bottom: gridWidth + groupByString.length * 10, left: 100, top: 70, right: 200 }];
			} else {
				//均为维度的逻辑
				if (isAllNumber) {
					xAxis = [];
					this.$XEUtils.lastEach(axisConst, (item, index) => {
						axisLabelData[index] = [];

						// 文本宽度;
						const labelWidth =
							this.mark[0].data.filter((markItem) => {
								return (
									markItem.innerText === "labelWidth" &&
									this.axisToField()[`y${index}`]?.trim() === this.axisToField()[`z${markItem.orderBy}`]?.trim()
								);
							})[0]?.markValue || 90;

						gridWidth += gridWidth == 0 ? labelWidth : labelWidth + 10;
						yAxis.push({
							...this.axisString[0],
							name: this.axisToField()[`y${index}`],
							nameLocation: this.type === "componentHeatMap" ? "end" : "start",
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
							inverse: !(this.type === "componentHeatMap"), //反向坐标
							position: "left",
							offset: gridWidth - labelWidth,
						});
					});
					axisConstX.forEach((item, index) => {
						// 文本宽度;
						const labelWidth =
							this.mark[0].data.filter((markItem) => {
								return (
									markItem.innerText === "labelWidth" &&
									this.axisToField()[`x${index}`]?.trim() === this.axisToField()[`z${markItem.orderBy}`]?.trim()
								);
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
					yAxis.push({
						...this.axisString[0],
						data: objKeys,
						show: false,
						inverse: !(this.type === "componentHeatMap"), //反向坐标
						splitArea: {
							show: isAllNumber,
						},
					});
					grid = [
						{
							left: gridWidth + groupByString.length * 10,
							bottom: isAllNumber ? bottomWidth + axisConstX.length * 10 : 90,
							top: 70,
							right: 200,
						},
					];
				} else {
					for (let i = 0; i < xNumber.length; i++) {
						gridWidth = 0;
						//如果不存在合并图表
						if (!commonGrid.includes(xNumber[i])) {
							grid.push({
								top: 50,
								bottom: 90,
							});
							xAxis.push({
								name: this.axisToField()[`${xNumber[i]}`]?.trim(),
								nameTextStyle: {
									fontStyle: "normal",
									fontSize: 16,
									padding: [14, 14, 14, 14],
								},
								nameLocation: "middle",
								...this.axisNumber,
								gridIndex: i,
							});
						}
						this.$XEUtils.lastEach(axisConst, (item, index) => {
							axisLabelData[index] = [];

							// 文本宽度;
							const labelWidth =
								this.mark[0].data.filter((markItem) => {
									return (
										markItem.innerText === "labelWidth" &&
										this.axisToField()[`y${index}`]?.trim() === this.axisToField()[`z${markItem.orderBy}`]?.trim()
									);
								})[0]?.markValue || 90;

							gridWidth += gridWidth == 0 ? labelWidth : labelWidth + 10;
							yAxis.push({
								...this.axisString[0],
								name: this.axisToField()[`y${index}`],
								nameLocation: this.type === "componentHeatMap" ? "end" : "start",
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
								inverse: !(this.type === "componentHeatMap"), //反向坐标
								position: "left",
								offset: gridWidth - labelWidth,
								gridIndex: i,
								show: i === 0,
							});
						});
						yAxis.push({
							...this.axisString[0],
							data: objKeys,
							show: false,
							inverse: !(this.type === "componentHeatMap"), //反向坐标
							splitArea: {
								show: isAllNumber,
							},
							show: false,
							gridIndex: i,
						});
					}
					const boxWidth = xNumber.length > 3 ? 400 : (width - gridWidth) / xNumber.length;

					grid = grid.map((item, index) => {
						if (index === grid.length - 1) {
							item.right = 20;
							item.width = "auto";
						} else {
							item.width = boxWidth - 20; //减20 让每一个grid左右有间距
						}
						return { ...item, left: boxWidth * index + gridWidth };
					});
				}

				// console.log(isAllNumber, xNumber);
				//行中有指标，列均为维度
				// xAxis = isAllNumber ? [] : [this.axisNumber];
				// this.$XEUtils.lastEach(axisConst, (item, index) => {
				// 	axisLabelData[index] = [];

				// 	// 文本宽度;
				// 	const labelWidth =
				// 		this.mark[0].data.filter((markItem) => {
				// 			return (
				// 				markItem.innerText === "labelWidth" && this.axisToField()[`y${index}`]?.trim() === this.axisToField()[`z${markItem.orderBy}`]?.trim()
				// 			);
				// 		})[0]?.markValue || 90;

				// 	gridWidth += gridWidth == 0 ? labelWidth : labelWidth + 10;
				// 	yAxis.push({
				// 		...this.axisString[0],
				// 		name: this.axisToField()[`y${index}`],
				// 		nameLocation: this.type === "componentHeatMap" ? "end" : "start",
				// 		data: item,
				// 		axisLabel: {
				// 			show: true,
				// 			interval: 0,
				// 			rotate: 0,
				// 			width: labelWidth,
				// 			overflow: "truncate",
				// 			align: "right",
				// 			formatter: function (value, valueIndex, data) {
				// 				axisLabelData[index][valueIndex] = value;
				// 				if (valueIndex === 0 || index === axisLabelData.length - 1) return value;
				// 				if (value === axisLabelData[index][valueIndex - 1]) return "";
				// 				else return value;
				// 			},
				// 		},
				// 		splitArea: {
				// 			show: isAllNumber,
				// 		},
				// 		inverse: !(this.type === "componentHeatMap"), //反向坐标
				// 		position: "left",
				// 		offset: gridWidth - labelWidth,
				// 	});
				// });
				// //均为维度的逻辑
				// if (isAllNumber) {
				// 	axisConstX.forEach((item, index) => {
				// 		// 文本宽度;
				// 		const labelWidth =
				// 			this.mark[0].data.filter((markItem) => {
				// 				return (
				// 					markItem.innerText === "labelWidth" &&
				// 					this.axisToField()[`x${index}`]?.trim() === this.axisToField()[`z${markItem.orderBy}`]?.trim()
				// 				);
				// 			})[0]?.markValue || 90;

				// 		bottomWidth += bottomWidth == 0 ? labelWidth : labelWidth + 10;

				// 		xAxis.push({
				// 			...this.axisString[0],
				// 			data: item,
				// 			show: true,
				// 			position: "bottom",
				// 			axisLabel: {
				// 				show: true,
				// 				interval: 0,
				// 				rotate: 90,
				// 				width: 90,
				// 				overflow: "truncate",
				// 			},
				// 			splitArea: {
				// 				show: isAllNumber,
				// 			},
				// 			offset: bottomWidth - labelWidth,
				// 		});
				// 	});
				// 	xAxis.push({
				// 		...this.axisString[0],
				// 		data: Object.keys(stringObj),
				// 		show: false,
				// 		position: "bottom",
				// 		splitArea: {
				// 			show: isAllNumber,
				// 		},
				// 	});
				// }

				// yAxis.push({
				// 	...this.axisString[0],
				// 	data: objKeys,
				// 	show: false,
				// 	inverse: !(this.type === "componentHeatMap"), //反向坐标
				// 	splitArea: {
				// 		show: isAllNumber,
				// 	},
				// });
				// grid = [
				// 	{
				// 		left: gridWidth + groupByString.length * 10,
				// 		bottom: isAllNumber ? bottomWidth + axisConstX.length * 10 : 90,
				// 		top: 70,
				// 		right: 200,
				// 	},
				// ];
			}
			console.log("{ xAxis, yAxis, grid }", { xAxis, yAxis, grid });
			return { xAxis, yAxis, grid };
		},
		//获取series /legend
		getSeries(paramsObj) {
			const { groupByNumber, groupByString, yNumber, objKeys, obj, markObj, axisConstX, xString, axisConst } = paramsObj;
			console.log(paramsObj);
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
							const { columnRename, axisOrder } = mkey;
							//热力图显示 "重命名名称：值" 其余的图表类型只显示 "值"
							this.type === "componentHeatMap" ? labels.push(`${columnRename}: ${item[axisOrder]}`) : labels.push(`${item[axisOrder]}`);
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
				const { color: markObjColor, mark: markArray, type, isStack } = markValue;
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
								name: this.fileName[item],
								type,
								isStack,
								stack: item,
								// xAxisIndex: yNumber.length ? groupByString.length : 0,
								// yAxisIndex: !yNumber.length ? groupByString.length : 0,
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
											result.push(val.value[2][item.axisOrder]);
										});
										return result.join("\n");
									},
								},
								xAxisIndex: yNumber.length ? (axisConst.length + 1) * series.length - 1 : series.length - 1,
								yAxisIndex: !yNumber.length ? (axisConst.length + 1) * series.length - 1 : series.length - 1,
								barMaxWidth: 50,
							};

							series[index].push(seriesObj);
						}
					});
				});
			});
console.log("{ series, legend }",{ series, legend })
			return { series, legend };
		},
		//增减进度条
		getDataZoom(paramsObj, grid) {
			const { xAxis, yAxis, groupByNumber } = paramsObj;
			// console.log(xAxis, yAxis, groupByNumber, grid);
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
			// const xLength = width / 16 < xAxis[0]?.data?.length ? `${xAxis[0].data.length * 50}px` : `${width}px`;
			// const yLength = height / 16 < yAxis[0]?.data?.length ? `${yAxis[0].data.length * 50}px` : `${height}px`;
			let boxWidthHeight = 0;
			if (grid.length > 3) {
				//说明是纵向
				if (grid[grid.length - 1].height) {
					const { bottom, top } = grid[grid.length - 1];
					const { height: gridHeight } = grid[grid.length - 2];
					boxWidthHeight = bottom + top + gridHeight;
				} else {
					const { left, right } = grid[grid.length - 1];
					const { width: gridWidth } = grid[grid.length - 2];
					boxWidthHeight = left + right + gridWidth;
				}
			}
			let xLength = 0;
			if (xAxis[0]?.data) {
				if (width / 16 < xAxis[0]?.data?.length) {
					xLength = `${xAxis[0].data.length * 50}`;
				} else {
					xLength = `${width}`;
				}
			} else if (xAxis.length > 3) {
				xLength = `${boxWidthHeight}`;
			} else {
				xLength = `${width}`;
			}

			let yLength = 0;
			if (yAxis[0]?.data) {
				if (height / 16 < yAxis[0]?.data?.length) {
					yLength = `${yAxis[0].data.length * 50}`;
				} else {
					yLength = `${height}`;
				}
			} else if (yAxis.length > 3) {
				yLength = `${boxWidthHeight}`;
			} else {
				yLength = `${height}`;
			}
			// const xLength = xAxis[0]?.data
			// 	? width / 16 < xAxis[0]?.data?.length
			// 		? `${xAxis[0].data.length * 50}px`
			// 		: `${width}px`
			// 	: xAxis.length > 3
			// 	? `${boxWidthHeight}px`
			// 	: `${width}px`;
			// const yLength = yAxis[0]?.data
			// 	? height / 16 < yAxis[0]?.data?.length
			// 		? `${yAxis[0].data.length * 50}px`
			// 		: `${height}px`
			// 	: yAxis.length > 3
			// 	? `${boxWidthHeight}px`
			// 	: `${height}px`;
			console.log(xLength, yLength);
			this.tempStyle.width = xLength > 65567 ? "65567px" : `${xLength}px`;
			this.tempStyle.height = yLength > 65567 ? "65567px" : `${yLength}px`;
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
			let aa = [""];
			const { value, marker, seriesType, percent } = params[0] || params;
			const tooltipValue = value[4] ? value[4] : value[2];
			Object.keys(tooltipValue).forEach((dataitem) => {
				if (groupByString.includes(dataitem)) {
					aa.splice(
						groupByString.findIndex((item) => item === dataitem),
						0,
						this.axisToField()[dataitem] + `:  ${tooltipValue[dataitem]}`
					);
				}

				if (
					!groupByString.includes(dataitem) &&
					(value[3] === dataitem || typeof tooltipValue[dataitem] === "string" || dataitem.indexOf("z") > -1)
				) {
					if (value[3] === dataitem) aa.push(marker + " " + this.axisToField()[dataitem] + `:  ${tooltipValue[dataitem]}`);
					else aa.push(this.axisToField()[dataitem] + `:  ${tooltipValue[dataitem]}`);
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
				markObj[item.stack] = { color: {}, mark: [], angle: [], type: item.chartType, isStack: item.isStack || "N" };
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
						// markObj[item.stack].mark.push(`${axis}${orderBy}`);
						markObj[item.stack].mark.push({ ...markItem, axisOrder: `${axis}${orderBy}` });
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
			return item.isContinue === 1 ? true : item.isContinue === 0 ? false : isNotContinue;
		},

		//轴名 对应 字段名称
		axisToField() {
			let obj = {};
			this.row.map((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction, item.columnRename)));
			this.column.map((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction, item.columnRename)));
			this.mark.forEach((markItem) => {
				markItem.data.forEach((item) => (obj[`${item.axis}${item.orderBy}`] = this.calculatorObj(item.calculatorFunction, item.columnRename)));
			});
			return obj;
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
				HM: "分",
				HMS: "秒",
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
.temp-preview {
	padding-top: 10px !important;
}
.temp {
	height: 100%;
	padding-top: 40px;
	.workbook-temp {
		width: calc(100% - 10px);
		height: calc(100% - 40px);
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
		transform: translate(-50%, -2%);
	}
	.download {
		position: absolute;
		top: 2%;
		right: 4%;
		i {
			font-size: 24px;
			&:hover {
				color: #27ce88;
			}
		}
	}
}
</style>
