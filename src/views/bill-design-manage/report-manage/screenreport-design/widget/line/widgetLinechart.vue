/**折线图 */
<template>
	<div :style="styleObj">
		<v-chart :options="options" autoresize v-if="isShow" @click="chartClick"/>
	</div>
</template>

<script>
export default {
	name: "WidgetLinechart",
	components: {},
	props: {
		value: Object,
		ispreview: Boolean,
		visib: Boolean,
	},
	data() {
		return {
			options: {
				grid: {},
				color: [],
				title: {
					text: "",
					textStyle: {
						color: "#fff",
					},
				},
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b} : {c}%",
				},
				legend: {
					textStyle: {
						color: "#fff",
					},
				},
				dataZoom: [
					{
						type: "slider",
						xAxisIndex: 0,
						filterMode: "none",
					},
				],
				xAxis: {
					type: "category",
					data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
					axisLabel: {
						show: true,
						textStyle: {
							color: "#fff",
						},
					},
				},
				yAxis: {
					type: "value",
					axisLabel: {
						show: true,
						textStyle: {
							color: "#fff",
						},
					},
				},
				series: [
					{
						data: [],
						type: "line",
					},
				],
			},
			optionsStyle: {}, // 样式
			optionsData: {}, // 数据
			optionsCollapse: {}, // 图标属性
			optionsSetup: {},
			isShow: false, //是否显示图表
		};
	},
	computed: {
		styleObj() {
			return {
				position: this.ispreview ? "absolute" : "static",
				width: this.optionsStyle.width + "px",
				height: this.optionsStyle.height + "px",
				left: this.optionsStyle.left + "px",
				top: this.optionsStyle.top + "px",
				background: this.optionsSetup.background,
			};
		},
	},
	watch: {
		value: {
			handler(val) {
				this.optionsStyle = val.position;
				this.optionsData = val.data;
				this.optionsCollapse = val.collapse;
				this.optionsSetup = val.setup;
				this.editorOptions();
			},
			deep: true,
		},
		visib() {
			if (!this.visib) {
				clearInterval(this.flagInter);
			}
		},
	},
	created() {
		this.optionsStyle = this.value.position;
		this.optionsData = this.value.data;
		this.optionsCollapse = this.value.collapse;
		this.optionsSetup = this.value.setup;
		this.editorOptions();
	},
	methods: {
		// 修改图标options属性
		editorOptions() {
			this.isShow = false;
			this.setOptionsTitle();
			this.setOptionsTooltip();
			this.setOptionsData();
			this.setOptionsMargin();
			this.setOptionsLegend();
			this.setOptionsColor();
			this.setOptionsTop();
			this.$nextTick(() => {
				this.isShow = true;
			});
		},
		chartClick(chartObj){
			const optionsSetup = this.optionsSetup;
			if(optionsSetup.clickuri === '' || optionsSetup.clickuri === undefined){
				return;
			}else{
				let uri = optionsSetup.clickuri;
				// 添加url 参数 ，限定只能添加一个参数
				if(optionsSetup.clickuriparam){
					if(uri.includes('?')){
						uri = uri + '&clickuriparamName='+optionsSetup.clickuriparamName+'&clickuriparamValue='+chartObj.name;
					}else{
						uri = uri + '?clickuriparamName='+optionsSetup.clickuriparamName+'&clickuriparamValue='+chartObj.name;
					}
				}
				//let uri = optionsSetup.clickuri.replace('http://localhost:8080/#','');
				console.log(uri);
				if(optionsSetup.currentPage){
				let a = document.createElement('a');
				document.body.appendChild(a);
				a.href = uri;
				a.click();
				document.body.removeChild(a);
				location.reload();
				}
				else
				window.open(uri, "_blank");
			}

		},
		// 标题修改
		setOptionsTitle() {
			const optionsSetup = this.optionsSetup;
			const title = {};
			title.text = optionsSetup.titleText;
			title.show = optionsSetup.isNoTitle;
			title.left = optionsSetup.textAlign;
			title.textStyle = {
				color: optionsSetup.textColor,
				fontSize: optionsSetup.textFontSize,
				fontWeight: optionsSetup.textFontWeight,
			};
			title.subtext = optionsSetup.subText;
			title.subtextStyle = {
				color: optionsSetup.subTextColor,
				fontWeight: optionsSetup.subTextFontWeight,
				fontSize: optionsSetup.subTextFontSize,
			};
			this.options.title = title;
		},
		// X轴设置
		setOptionsX(xAxis) {
			const optionsSetup = this.optionsSetup;
			let xAxisData = [];
			let offset = 0;
			xAxis?.forEach((item) => {
				xAxisData.push({
					type: "category",
					show: optionsSetup.hideX, // 坐标轴是否显示
					name: optionsSetup.xName, // 坐标轴名称
					data: item,
					nameTextStyle: {
						color: optionsSetup.nameColorX,
						fontSize: optionsSetup.nameFontSizeX,
					},
					nameRotate: optionsSetup.textAngle, // 文字角度
					inverse: optionsSetup.reversalX, // 轴反转
					axisLabel: {
						show: true,
						interval: optionsSetup.textInterval, // 文字间隔
						rotate: optionsSetup.textAngle, // 文字角度
						textStyle: {
							color: optionsSetup.Xcolor, // x轴 坐标文字颜色
							fontSize: optionsSetup.fontSizeX,
						},
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: optionsSetup.lineColorX,
						},
					},
					splitLine: {
						show: optionsSetup.isShowSplitLineX,
						lineStyle: {
							color: optionsSetup.splitLineColorX,
						},
					},
					position: "bottom",
					offset,
				});
				offset = offset + optionsSetup.spaceX;
			});
			this.options.xAxis = xAxisData;
			//   this.options.xAxis = xAxis;
		},
		// Y轴设置
		setOptionsY(yAxis) {
			const optionsSetup = this.optionsSetup;
			let yAxisData = [];
			let offset = 0;
			yAxis.forEach((item) => {
				yAxisData.push({
					type: "value",
					scale: optionsSetup.scale,
					splitNumber: optionsSetup.splitNumber, // 均分
					show: optionsSetup.isShowY, // 坐标轴是否显示
					name: optionsSetup.textNameY, // 坐标轴名称
					nameTextStyle: {
						// 别名
						color: optionsSetup.nameColorY,
						fontSize: optionsSetup.namefontSizeY,
					},
					inverse: optionsSetup.reversalY, // 轴反转
					axisLabel: {
						show: true,
						rotate: optionsSetup.ytextAngle, // 文字角度
						textStyle: {
							color: optionsSetup.colorY, // y轴 坐标文字颜色
							fontSize: optionsSetup.fontSizeY,
						},
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: optionsSetup.lineColorY,
						},
					},
					splitLine: {
						show: optionsSetup.isShowSplitLineY,
						lineStyle: {
							color: optionsSetup.splitLineColorY,
						},
					},
					position: "left",
					offset,
				});
				offset = offset + optionsSetup.spaceY;
			});
			this.options.yAxis = yAxisData;
		},
		// 折线设置
		setOptionsTop() {
			const optionsSetup = this.optionsSetup;
			const series = this.options.series;
			for (const key in series) {
				if (series[key].type == "line") {
					series[key].showSymbol = optionsSetup.markPoint;
					series[key].symbolSize = optionsSetup.pointSize;
					series[key].smooth = optionsSetup.smoothCurve;
					if (optionsSetup.area) {
						series[key].areaStyle = {
							opacity: optionsSetup.areaThickness / 100,
						};
					} else {
						series[key].areaStyle = {
							opacity: 0,
						};
					}

					series[key].lineStyle = {
						width: optionsSetup.lineWidth,
					};
					series[key].label = {
						show: optionsSetup.isShow,
						position: "top",
						distance: 10,
						fontSize: optionsSetup.fontSize,
						color: optionsSetup.subTextColor,
						fontWeight: optionsSetup.fontWeight,
					};
				}
			}
			this.options.series = series;
		},
		// tooltip 设置
		setOptionsTooltip() {
			const optionsSetup = this.optionsSetup;
			const tooltip = {
				trigger: "item",
				show: true,
				textStyle: {
					color: optionsSetup.lineColor,
					fontSize: optionsSetup.fontSize,
				},
			};
			this.options.tooltip = tooltip;
		},
		// 边距设置
		setOptionsMargin() {
			const optionsSetup = this.optionsSetup;
			const grid = {
				left: optionsSetup.marginLeft,
				right: optionsSetup.marginRight,
				bottom: optionsSetup.marginBottom,
				top: optionsSetup.marginTop,
				containLabel: true,
			};
			this.options.grid = grid;
		},
		// 图例操作 legend
		setOptionsLegend() {
			const optionsSetup = this.optionsSetup;
			const legend = this.options.legend;
			legend.show = optionsSetup.isShowLegend;
			legend.left = optionsSetup.lateralPosition;
			legend.right = optionsSetup.lateralPosition;
			legend.top = optionsSetup.longitudinalPosition;
			legend.bottom = optionsSetup.longitudinalPosition;
			legend.orient = optionsSetup.layoutFront;
			legend.textStyle = {
				color: optionsSetup.lengedColor,
				fontSize: optionsSetup.fontSize,
			};
			legend.itemWidth = optionsSetup.lengedWidth;
		},
		// 图例名称设置
		setOptionsLegendName(name) {
			const optionsSetup = this.optionsSetup;
			const series = this.options.series;
			const legendName = optionsSetup.legendName;
			// 图例没有手动写则显示原值，写了则显示新值
			if (null == legendName || legendName == "") {
				for (let i = 0; i < name.length; i++) {
					series[i].name = name[i];
				}
				this.options.legend["data"] = name;
			} else {
				const arr = legendName.split("|");
				for (let i = 0; i < arr.length; i++) {
					series[i].name = arr[i];
				}
				this.options.legend["data"] = arr;
			}
		},
		// 图例颜色修改
		setOptionsColor() {
			const optionsSetup = this.optionsSetup;
			const customColor = optionsSetup.customColor;
			if (!customColor) return;
			const arrColor = [];
			for (let i = 0; i < customColor.length; i++) {
				arrColor.push(customColor[i].color);
			}
			this.options.color = arrColor;
			this.options = Object.assign({}, this.options);
		},
		// 处理数据
		setOptionsData() {
			const optionsData = this.optionsData; // 数据类型 静态 or 动态
			optionsData.dataType == "staticData"
				? this.staticDataFn(optionsData.staticData)
				: this.dynamicDataFn(optionsData.dynamicData, optionsData.refreshTime);
		},
		staticDataFn(val) {
			const series = this.options.series;
			let axis = [];
			let data = [];
			for (const i in val) {
				axis[i] = val[i].axis;
				data[i] = val[i].data;
			}
			// x轴
			this.options.xAxis.data = axis;
			// series
			for (const i in series) {
				if (series[i].type == "line") {
					series[i].data = data;
				}
			}
			const legendName = [];
			legendName.push("销售量");
			this.options.legend["data"] = legendName;
			this.setOptionsLegendName(legendName);
		},
		dynamicDataFn(val, refreshTime) {
			if (!val) return;
			if (this.ispreview) {
				this.getEchartData(val);
				this.flagInter = setInterval(() => {
					this.getEchartData(val);
				}, refreshTime);
			} else {
				this.getEchartData(val);
			}
		},
		getEchartData(val) {
			const data = this.queryEchartsData(val);
			data.then((res) => {
				this.renderingFn(res);
			});
		},
		renderingFn(val) {
			//还原x，y轴
			this.restore();
			// 动态列
			this.setOptionsX(val.xAxis);
			// series
			this.options.series = [];
			val.series.forEach((item, index) => {
				let series = {
					type: "line",
					data: item.data,
				};
				this.options.series[index] = series;
			});
			// 设定滚动条
			this.options.dataZoom = [
				{
					show: this.optionsSetup.dataZoomEndFlag,
					type: "slider",
					xAxisIndex: this.options.xAxis.map((item, index) => index),
					filterMode: "none",
					start: 0,
					end: this.optionsSetup.dataZoomEnd,
				},
			];
			this.setOptionsLegendName(val.legend);
		},
		//还原x轴，y轴数据
		restore() {
			this.options = {
				...this.options,
				xAxis: {
					type: "category",
					data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
					axisLabel: {
						show: true,
						textStyle: {
							color: "#fff",
						},
					},
				},
				yAxis: {
					type: "value",
					axisLabel: {
						show: true,
						textStyle: {
							color: "#fff",
						},
					},
				},
			};
		},
	},
};
</script>

<style scoped lang="less">
.echarts {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
</style>
