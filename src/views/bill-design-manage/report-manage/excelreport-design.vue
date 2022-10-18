<template>
	<div style="height: 100%">
		<Layout class="layout">
			<!-- 左侧 -->
			<Sider hide-trigger class="sider">
				<!-- 数据集管理 -->
				<div class="title">数据集管理</div>
				<!-- 添加图表 -->
				<div class="icon" @click="queryAllDataSet">
					<Icon type="md-add" />
				</div>
				<!-- DBlist -->
				<div class="dblist">
					<Collapse simple v-for="(item, indexs) in dataSet" :key="indexs">
						<Panel :name="item.setCode" :title="item.setName">
							{{ item.setName }}
							<div slot="content">
								<div class="deletePop">
									<Icon type="md-trash" @click="del(item)" />
								</div>
								<draggable v-model="item.setParamList" :sort="false" group="people" style="margin-left: 10px" @start="onStart(item.setCode, $event)">
									<div class="row" v-for="(i, index) in item.setParamList" :key="index">{{ i }}</div>
								</draggable>
							</div>
						</Panel>
					</Collapse>
				</div>
			</Sider>
			<!-- 中间内容excel -->
			<Content class="content">
				<div class="push_btn">
					<Tooltip class="item" effect="dark" content="保存" placement="bottom-start">
						<Button type="text" @click="save()">
							<Icon type="ios-folder" />
						</Button>
					</Tooltip>
					<Tooltip class="item" effect="dark" content="预览" placement="bottom-start">
						<Button type="text" @click="preview()">
							<Icon type="md-eye" />
						</Button>
					</Tooltip>
					<!-- <Icon custom="iconfont luckysheet-iconfont-hanshu" style="margin-right:5px" /> -->
				</div>
				<div id="luckysheet" style="margin: 0px; padding: 0px; position: absolute; width: 100%; height: 98%; left: 0px; top: 0.2rem"></div>
				<div style="display: none"></div>
			</Content>
			<!-- 右侧基础配置 -->
			<Sider hide-trigger class="sider" style="right: 0; position: absolute">
				<RightTabPane :formData="rightForm" @autoChangeFunc="autoChangeFunc" />
			</Sider>
		</Layout>
		<!-- 数据集管理弹框 -->
		<!-- <dataset-manage ref = "datasetmanage"/> -->
		<dataset-manage ref="datasetmanage" />
		<function-manage ref="functionmanage" :formData="rightForm" @autoChangeFunc="autoChangeFunc" />
	</div>
</template>

<script>
import { getpagelistReq, getDeatilByIdReq } from "@/api/bill-design-manage/data-set.js";
import { getExcelByReportcodeReq, insertExcelReportReq, modifyExcelReportReq } from "@/api/bill-design-manage/report-manage.js";
import draggable from "vuedraggable";
import RightTabPane from "./excelreport-design/right-tabPane.vue";
import DatasetManage from "./excelreport-design/dataset-manage.vue";
import FunctionManage from "./excelreport-design/function-manage.vue";

export default {
	name: "excelreport-design",
	components: { draggable, RightTabPane, DatasetManage, FunctionManage },
	data() {
		return {
			dataSet: [],
			setCode: "",
			reportCode: "",
			draggableFieldLabel: "", //拖拽的文本内容
			sheetData: "",
			blankNum: 1, //空白格
			rightForm: {
				coordinate: "",
				value: "",
				r: "",
				c: "",
				auto: false,
				autoIsShow: false,
				// 单元格属性
				cellAttribute: {
					//扩展属性
					expend: {
						expend: "portrait", //扩展方向：默认纵向（cross为纵向）
						expendSort: "no", //是否排序：默认无（asc,desc:顺序，逆序）
						leftParent: "default", //左父格：默认default(no/userDefined:无/自定义)
						topParent: "default", //上父格：默认default(no/userDefined:无/自定义)
						topParentValue: "", //上父格所选单元格（横向扩展或自定义值），无：""
						leftParentValue: "", //左父格所选单元格（纵向扩展或自定义值）无：""
					},
				},
				cell: {
					showType: "group", //数据设置,默认 分组
					showTypeValue: "ordinary", //数据设置值 默认为普通
				},
			},
			reportExcelDto: {
				id: null,
				jsonStr: "",
				setCodes: "",
				setParam: "",
				reportCode: "",
			},
		};
	},
	methods: {
		//初始化
		design() {
			// 根据reportCode获取单条报表
			getExcelByReportcodeReq({ reportCode: this.reportCode }).then((res) => {
				if (res.code === 200) {
					const { result } = res;
					if (result != null) {
						this.reportId = result.reportCode;
					}
					this.sheetData = result == null ? [{}] : JSON.parse(result.jsonStr);
					this.createSheet();
					if (result != null) {
						if (result.setCodes != null && result.setCodes !== "") {
							let dataSetList = result.setCodes.split("|");
							dataSetList.forEach((code) => {
								this.detail(code).then((res) => {
									this.dataSet.push(res);
								});
							});
						}
					}
				}
			});
		},
		//初始化表格
		createSheet() {
			//将vue对象传入
			const that = this;
			let options = {
				container: "luckysheet", // 设定DOM容器的id
				title: "", // 设定表格名称
				lang: "zh", // 设定表格语言
				plugins: ["chart"],
				hook: {
					cellDragStop: function (cell, postion, sheetFile, ctx) {
						that.setRightForm(cell, postion, sheetFile, ctx, that.draggableFieldLabel); //rightForm默认值
					},
					cellMousedown: function (cell, postion, sheetFile, ctx) {
						const value = cell == null ? "" : cell.v;
						that.setRightForm(cell, postion, sheetFile, ctx, value); //rightForm默认值
					},
				},
				data: [
					{
						name: "report", //工作表名称
						color: "", //工作表颜色
						index: 0, //工作表索引
						status: 1, //激活状态
						order: 0, //工作表的下标
						hide: 0, //是否隐藏
						row: 36, //行数
						column: 18, //列数
						defaultRowHeight: 19, //自定义行高
						defaultColWidth: 73, //自定义列宽
						celldata: [], //初始化使用的单元格数据
						config: {
							merge: {}, //合并单元格
							rowlen: {}, //表格行高
							columnlen: {}, //表格列宽
							rowhidden: {}, //隐藏行
							colhidden: {}, //隐藏列
							borderInfo: {}, //边框
							authority: {}, //工作表保护
						},
						scrollLeft: 0, //左右滚动条位置
						scrollTop: 315, //上下滚动条位置
						luckysheet_select_save: [], //选中的区域
						calcChain: [], //公式链
						isPivotTable: false, //是否数据透视表
						pivotTable: {}, //数据透视表设置
						filter_select: {}, //筛选范围
						filter: null, //筛选配置
						luckysheet_alternateformat_save: [], //交替颜色
						luckysheet_alternateformat_save_modelCustom: [], //自定义交替颜色
						luckysheet_conditionformat_save: {}, //条件格式
						frozen: {}, //冻结行列配置
						chart: [], //图表配置
						zoomRatio: 1, // 缩放比例
						image: [], //图片
						showGridLines: 1, //是否显示网格线
						dataVerification: {}, //数据验证配置
					},
				],
			};
			options.data = this.sheetData;
			this.$nextTick(() => {
				$(function () {
					luckysheet.create(options);
				});
				document.getElementById("luckysheet-wa-functionbox-fx").addEventListener("click", function () {
					//点击原本函数弹框的取消按钮
					//   document.getElementById("luckysheet-modal-dialog-mask").style.display = "none";
					//    document.getElementById("luckysheet-search-formula").style.display = "none";
					document.getElementsByClassName("luckysheet-model-close-btn")[0].click();
					that.$refs.functionmanage.outerVisible = true;
					that.$refs.functionmanage.getDataItemData(); // 数据字典
				});
			});
		},

		//设定RightForm
		setRightForm(cell, postion, sheetFile, ctx, value) {
			console.log(cell, postion, sheetFile, ctx, value, luckysheet.getAllSheets());

			const { r, c } = postion;
			//单元格属性扩展
			let { expend, expendSort, leftParent, topParent, leftParentValue, topParentValue } = cell?.cellAttribute?.expend || {};
			//设定父子格值

			if (leftParent === "default") leftParentValue = this.getParentValue(r, c)?.leftParentValue || "";
			if (topParent === "default") topParentValue = this.getParentValue(r, c)?.topParentValue || "";

			//单元格元素数据设置
			let { showType, showTypeValue, filterData, isFather, data } = cell?.cell || {};

			this.rightForm = {
				r,
				c,
				coordinate: r + "," + c,
				// value,
				// autoIsShow: true,
				v: value,
				m: value,
				//单元格属性
				cellAttribute: {
					//扩展参数及默认值
					expend: {
						expend: expend || (value.indexOf("{") > -1 ? "portrait" : "no"),
						expendSort: expendSort || "no",
						leftParent: leftParent || "default",
						leftParentValue: leftParentValue || "",
						topParent: topParent || "default",
						topParentValue: topParentValue || "",
					},
				},
				// 单元格元素
				cell: {
					showType: showType || "list", //数据默认为list
					showTypeValue: showTypeValue || "ordinary",
					filterData: filterData || "",
					isFather: isFather || true,
					label: value,
					data: data || [],
				},
				// 条件属性
				conditions: cell?.conditions || [],
			};
			if (value) {
				window.luckysheet.setCellValue(r, c, { ...this.rightForm });
				// this.imageExpendUpdate(this.rightForm.cellAttribute.expend.expend, r, c, "expend");
			}
		},
		//更新扩展方向图片
		imageExpendUpdate(expend, r, c) {
			// 删除添加过的图片
			luckysheet.getAllSheets().forEach((item) => {
				if (item.images) {
					Object.keys(item.images).forEach((kItem) => {
						const { rowIndex, colIndex, te } = item.images[kItem];
						if (rowIndex === r && colIndex === c && (te == "expend" || expend === "no")) {
							luckysheet.deleteImage({ order: 0, idList: [kItem] });
						}
					});
				}
			});
			const obj = { order: 0, rowIndex: r, colIndex: c, type: "expend" };
			if (expend !== "no") luckysheet.insertImage(require(`@/assets/images/report-design/${expend}.png`), obj);
		},
		//更新父格方向图片
		imageParentUpdate(expend, r, c) {
			// 删除添加过的图片
			luckysheet.getAllSheets().forEach((item) => {
				if (item.images) {
					Object.keys(item.images).forEach((kItem) => {
						const { rowIndex, colIndex, te } = item.images[kItem];
						if (te == "parent") luckysheet.deleteImage({ order: 0, idList: [kItem] });
					});
				} //删除父格
			});
			const obj = { order: 0, rowIndex: r, colIndex: c, type: "parent" };
			if (expend) luckysheet.insertImage(require(`@/assets/images/report-design/${expend}.png`), obj);
		},

		// 左侧列表拖拽
		onStart(setCode, evt) {
			this.setCode = setCode;
			let fieldLabel = evt.item.innerText; // 列名称
			this.draggableFieldLabel = "#{" + this.setCode + "." + fieldLabel + "}";
		},
		//更新单元格信息，扩展、排序...
		autoChangeFunc(right) {
			const { r, c, cellAttribute, cell } = right;
			if (r !== undefined && c !== undefined) {
				luckysheet.setCellValue(r, c, { ...right });
				console.log("right", right);
				this.$nextTick(() => {
					luckysheet.refresh();
					luckysheet.getCellValue(r, c);
				});
				this.blankNum = cell.blankNum; //存储空白格值
				//    this.imageExpendUpdate(cellAttribute.expend.expend, r, c, "expend");
			}
		},

		async detail(setCode) {
			const obj = { setCode: setCode };
			return await getDeatilByIdReq(obj).then((res) => {
				if (res.code === 200) {
					const data = res.result;
					return data;
				}
			});
		},

		//预览
		preview() {
			const { href } = this.$router.resolve({
				path: "/bill-design-manage/excelreport-preview",
				query: {
					reportCode: this.reportCode,
					reportName: this.$route.query.reportName,
				},
			});
			window.open(href, "_blank");
		},
		//保存
		async save() {
			//设定传参
			this.reportExcelDto = this.setReportExcelDto();
			console.log("reportExcelDto", this.reportExcelDto);
			//   return;
			const requestReq = this.reportId == null ? insertExcelReportReq : modifyExcelReportReq;
			this.reportExcelDto.id = this.reportId || null;
			const { code, message } = await requestReq(this.reportExcelDto);
			if (code != 200) {
				this.$Message.error(message);
				return;
			}
			this.$Message.success("保存成功");
		},
		//设定传参
		setReportExcelDto() {
			//删除父格方向图片
			//   this.imageParentUpdate();

			let jsonData = luckysheet.getAllSheets();
			console.log("jsonData", jsonData);

			//查询参数
			const { setCodeList, setParams } = this.resetDataSet();

			//修正一遍左上父格的值
			jsonData.forEach((item, itemIndex) => {
				const { celldata } = item;
				jsonData[itemIndex].relationList = [];
				jsonData[itemIndex].data = [];
				jsonData[itemIndex].blankNum = this.blankNum; //空白格
				for (let i = celldata.length - 1; i >= 0; i--) {
					//说明为静态数据，不判断父子格
					const v = jsonData[itemIndex].celldata[i].v;
					if (!v?.cellAttribute || !v.v) {
						//去除数据为空的无效单元格
						if (JSON.stringify(v) === "{}" || (!v.v && !v.bg)) {
							jsonData[itemIndex].celldata.splice(i, 1);
						}
						continue;
					}
					// 常量
					if (v.v.indexOf("#") === -1 && v.cellAttribute) {
						delete jsonData[itemIndex].celldata[i].v.cellAttribute;
						delete jsonData[itemIndex].celldata[i].v.cell;
						continue;
					}

					const expend = v.cellAttribute.expend;
					const { leftParent, topParent } = expend;
					const { r, c } = celldata[i];
					let relationObj = "";
					// 确定父子格
					if (leftParent === "default" || topParent === "default") {
						//设定父子格值
						const { topParentValue, leftParentValue } = this.getParentValue(r, c);
						if (leftParent === "default") expend.leftParentValue = leftParentValue;
						if (topParent === "default") expend.topParentValue = topParentValue;
					}
					//确定关系块
					const { leftParentValue, topParentValue } = expend;
					if (leftParentValue || topParentValue) {
						relationObj = { start: `${r},${c}`, end: `${r},${c}` };
						if (leftParentValue?.value) relationObj = this.compareValue(relationObj, leftParentValue.value);
						if (topParentValue?.value) relationObj = this.compareValue(relationObj, topParentValue.value);
					}
					if (relationObj) jsonData[itemIndex].relationList.push(relationObj);
				}
			});

			//确定数据块
			jsonData.forEach((item, itemIndex) => {
				jsonData[itemIndex].relationList.forEach((relation, relationIndex) => {
					const { start, end } = relation;
					const minRow = Number(start.split(",")[0]);
					const minColumn = Number(start.split(",")[1]);
					const maxRow = Number(end.split(",")[0]);
					const maxColumn = Number(end.split(",")[1]);
					jsonData[itemIndex].relationList.forEach((rela, relaIndex) => {
						//索引相同说明值相同，不进行比较
						// if (relationIndex !== relaIndex) {
						const { start: startRela, end: endRela } = rela;
						const startCell = startRela.split(",");
						const endCell = endRela.split(",");
						//   最小行B在最小行A与最大行A直接  || 最大行B在最小行A与最大行A直接
						const isRow = (minRow >= Number(startCell[0]) && minRow <= Number(endCell[0])) || (maxRow >= Number(startCell[0]) && maxRow <= Number(endCell[0]));
						// 最小列B在最小列A与最大列A之间 || 最大列B在最小列A与最大列A之间
						const isColumn = (minColumn >= Number(startCell[1]) && minColumn <= Number(endCell[1])) || (maxColumn >= Number(startCell[1]) && maxColumn <= Number(endCell[1]));
						//以上条件为TRUE ，则为一个数据块
						if (isRow && isColumn) {
							jsonData[itemIndex].relationList[relationIndex] = this.compareValue(jsonData[itemIndex].relationList[relationIndex], startRela);
							jsonData[itemIndex].relationList[relationIndex] = this.compareValue(jsonData[itemIndex].relationList[relationIndex], endRela);

							if (relationIndex !== relaIndex) delete jsonData[itemIndex].relationList[relaIndex]; //删除已经计算过的父子格区间
						}
						// }
					});
				});
				jsonData[itemIndex].relationList = jsonData[itemIndex].relationList.filter((item) => item);
			});

			return {
				...this.reportExcelDto,
				jsonStr: JSON.stringify(jsonData),
				setParam: JSON.stringify(setParams),
				setCodes: setCodeList.join("|"),
				reportCode: this.reportCode,
			};
		},
		//重置数据集参数
		resetDataSet() {
			let setCodeList = [];
			let setParams = {};
			this.dataSet.forEach((code) => {
				setCodeList.push(code.setCode);
				if (code.dataSetParamDtoList != null && code.dataSetParamDtoList.length > 0) {
					let dataSetParam = {};
					code.dataSetParamDtoList.forEach((value) => {
						const paramName = value.paramName;
						dataSetParam[paramName] = value.sampleItem;
						dataSetParam[paramName + "required"] = value.requiredFlag;
						dataSetParam[paramName + "type"] = value.paramType;
						dataSetParam[paramName + "paramAstrict"] = value.paramAstrict;
						dataSetParam[paramName + "paramDesc"] = value.paramDesc; //参数名称
					});
					setParams[code.setCode] = dataSetParam;
				}
			});
			return { setCodeList, setParams };
		},
		//比较数据 取块
		compareValue(relation, parentValue) {
			//比较的行与列
			const value = parentValue.split(",");
			const row = value[0]; //父格行
			const column = value[1]; //父格列
			//原始行与列
			let relationObj = { ...relation };
			let start = relationObj.start.split(",");
			let end = relationObj.end.split(",");
			start[0] = Math.min(Number(start[0]), Number(row));
			start[1] = Math.min(Number(start[1]), Number(column));
			end[0] = Math.max(Number(end[0]), Number(row));
			end[1] = Math.max(Number(end[1]), Number(column));
			return { start: `${start[0]},${start[1]}`, end: `${end[0]},${end[1]}` };
		},
		//获取父格值
		getParentValue(r, c) {
			let topParentValue = ""; //上父格值
			let leftParentValue = ""; //左父格值
			// 列
			for (let i = c - 1; i >= 0; i--) {
				const expend = luckysheet.getCellValue(r, i, { type: "cellAttribute" })?.expend.expend || "";
				const v = luckysheet.getCellValue(r, i, { type: "v" });
				//扩展方向为纵向，即为左父格(有值且为变量)
				if (expend === "portrait" && v && v.indexOf("#") !== -1) {
					leftParentValue = { label: `${r},${i}`, value: `${r},${i}` };
					// 添加图片父箭头
					//   this.imageParentUpdate("leftParent", r, i, "parent");
					break;
				}
			}
			// 行
			for (let i = r - 1; i >= 0; i--) {
				const expend = luckysheet.getCellValue(i, c, { type: "cellAttribute" })?.expend.expend || "";
				const v = luckysheet.getCellValue(i, c, { type: "v" });
				//扩展方向为横向，即为左父格(有值且为变量)
				if (expend === "cross" && v && v.indexOf("#") !== -1) {
					topParentValue = { label: `${i},${c}`, value: `${i},${c}` };
					// 添加图片父箭头
					//   this.imageParentUpdate("topParent", i, c, "parent");
					break;
				}
			}
			return { topParentValue, leftParentValue };
		},
		//删除数据集数据
		del(val) {
			this.$Modal.confirm({
				title: "确定删除" + val.setName + "吗？",
				onOk: () => {
					for (let i = 0; i < this.dataSet.length; i++) {
						if (this.dataSet[i].setCode === val.setCode) {
							this.dataSet.splice(i, 1);
							this.$Message.success("删除成功");
							break;
						}
					}
				},
			});
		},
		queryAllDataSet() {
			this.$refs.datasetmanage.outerVisible = true;
			this.$refs.datasetmanage.queryAllDataSet(); //所有数据集
			this.$refs.datasetmanage.getDataItemData(); // 数据字典
		},
	},
	created() {
		this.$nextTick(() => {
			this.reportCode = this.$route.query.reportCode;
			this.design();
		});
	},
};
</script>
<style src="../../../../public/luckysheet/assets/iconfont/iconfont.css" />
<style>
#luckysheet_info_detail_title,
#luckysheet_info_detail_update,
#luckysheet_info_detail_save {
	display: none;
}
</style>
<style lang="less" scoped>
.sider {
	width: 300px !important;
	min-width: 300px !important;
	max-width: 300px !important;
	flex: 0 0 300px !important;
	height: 100%;
	margin: 0 0.5rem;
	background-color: transparent;
	.title {
		width: 100%;
		height: 2rem;
		color: #1ec0d1;
		text-align: center;
		margin: 0.2rem 0 0;
		line-height: 2rem;
		font-weight: bold;
		font-size: 0.94rem;
		background: #fff;
		border-radius: 0 0 0 1.4rem;
	}
	.icon {
		height: 2rem;
		text-align: right;
		padding-right: 1rem;
		font-size: 1.5rem;
		line-height: 2rem;
		background: #efefef;
		color: #1ec0d1;
	}
	.dblist {
		height: calc(100% - 5rem);
		overflow-y: scroll;
		background-color: #fff;
		border-radius: 1.4rem 0 0 0;
		.row {
			padding: 0.2rem;
			margin: 0 1.6rem 0.3rem;
		}
		.deletePop {
			position: absolute;
			right: -1rem;
			top: -1.8rem;
			i {
				color: #ff6161;
				font-size: 1.02rem;
			}
		}
	}
}
/deep/ .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
	overflow: hidden;
	padding-right: 0.5rem;
}
:deep(.luckysheet-grid-container) {
	z-index: 1;
}
.content {
	width: calc(100% - 600px);
	height: 100%;
	background-color: #fff;
	position: absolute;
	overflow-x: visible !important;
	margin-left: 300px;
	margin-right: 300px;
	overflow-x: visible !important;
	.push_btn {
		position: absolute;
		top: 15px;
		right: 4%;
		z-index: 99;
		i {
			color: #6c6666;
			font-size: 1.12rem;
			margin-right: 0.3rem;
		}
	}
}
/deep/ .ivu-collapse-simple > .ivu-collapse-item > .ivu-collapse-content > .ivu-collapse-content-box {
	position: relative;
}

/deep/.ivu-modal-fullscreen .ivu-modal-body {
	width: 100%;
	overflow: auto;
	position: absolute;
	top: 43px;
	bottom: 43px;
	right: 0;
	left: 0px;
	padding: 0;
}
/deep/.layout,
.ivu-layout {
	height: 100%;
	background: #efefef;
}
/deep/.ivu-collapse-simple {
	border-top: none;
}
/deep/.luckysheet-stat-area {
	background: transparent;
}
/deep/.luckysheet {
	border-top: none;
}
/deep/.luckysheet-share-logo {
	display: none;
}
/deep/.ivu-layout-sider-children {
	background-color: #fff;
}

/deep/ #luckysheet-row-count-show {
	width: 1.2rem !important;
}
</style>
