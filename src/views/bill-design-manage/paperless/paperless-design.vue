<template>
	<!-- <div v-if="modalFlag" style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; z-index: 1"> -->
	<Modal v-model="modalFlag" title="无纸化表单设计" fullscreen :mask="false" :z-index="999" transfer>
		<Layout class="layout">
			<!-- 中间内容excel -->
			<Content class="content">
				<div class="push_btn">
					<Tooltip class="item" effect="dark" content="保存" placement="bottom-start">
						<Button type="text" @click="save()">
							<Icon type="ios-folder" />
						</Button>
					</Tooltip>
					&nbsp;&nbsp;
					<Tooltip class="item" effect="dark" content="预览" placement="bottom-start">
						<Button type="text" @click="preview()">
							<Icon type="md-eye" />
						</Button>
					</Tooltip>
				</div>
				<div id="luckysheet" style="margin: 0px; padding: 0px; position: absolute; width: 100%; height: 100%; left: 0px; top: 0"></div>
				<div style="display: none"></div>
			</Content>
			<!-- 右侧基础配置 -->
			<Sider hide-trigger class="sider" style="right: 0; position: absolute">
				<RightSetting :formData="rightForm" @autoChangeFunc="autoChangeFunc" />
			</Sider>
		</Layout>
	</Modal>
	<!-- </div> -->
</template>

<script>
import RightSetting from "./right-setting.vue";
export default {
	name: "excelreport-design",
	props: {
		isAdd: Boolean,
	},
	watch: {
		modalFlag(newVal) {
			console.log(newVal);
			if (newVal) {
				this.pageLoad();
			}
		},
	},
	components: { RightSetting },
	data() {
		return {
			modalFlag: false,
			sheetData: [],
			rightForm: {},
			selectRange: {}, //选中范围
		};
	},
	methods: {
		pageLoad() {
			this.createSheet();
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
						console.log("cellMousedown");
						const value = cell == null ? "" : cell.v;
						that.setRightForm(cell, postion, sheetFile, ctx, value); //rightForm默认值
					},
					rangeSelect: function (sheet, range) {
						that.selectRange = { rows: range[0].row, columns: range[0].column };
						console.log("选区操作", range[0].row, range[0].column);
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
						column: 21, //列数
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
			// options.data = this.sheetData;
			this.$nextTick(() => {
				$(function () {
					luckysheet.create(options);
				});
			});
		},

		//设定RightForm
		setRightForm(cell, postion, sheetFile, ctx) {
			console.log(cell, postion, sheetFile, ctx);
			const { r, c } = postion;
			window.luckysheet.setCellValue(r, c, { ...cell });
			this.rightForm = { ...cell };
		},
		//更新单元格信息，扩展、排序...
		autoChangeFunc(type, right) {
			console.log("更新单元格信息，扩展、排序", right);
			const { rows, columns } = this.selectRange;
			const temp = {};
			temp[type] = right instanceof Array ? [...right] : { ...right };
			for (let i = rows[0]; i <= rows[1]; i++) {
				for (let j = columns[0]; j <= columns[1]; j++) {
					const getCellValue = luckysheet.getCellValue(i, j);
					luckysheet.setCellValue(i, j, { getCellValue, ...temp });
				}
			}
			console.log(luckysheet.getAllSheets());
		},

		//保存
		async save() {
			let jsonData = luckysheet.getAllSheets();
			console.log("jsonData", jsonData);
		},
	},
	created() {},
};
</script>
<style src="../../../../public/luckysheet/assets/iconfont/iconfont.css" />
<style>
#luckysheet_info_detail_title,
#luckysheet_info_detail_update,
#luckysheet_info_detail_save,
#luckysheet_info_detail_input,
.ivu-icon-ios-arrow-back {
	display: none;
}
</style>
<style lang="less" scoped>
.sider {
	width: calc(300px - 30px) !important;
	min-width: calc(300px - 30px) !important;
	max-width: calc(300px - 30px) !important;
	flex: 0 0 300px !important;
	height: 100%;
	margin: 0 0px;
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
	width: calc(100% - 300px);
	height: 100%;
	background-color: #fff;
	position: absolute;
	overflow-x: visible !important;
	margin-right: 300px;
	margin-left: 30px;
	overflow-x: visible !important;
	.push_btn {
		position: absolute;
		top: 15px;
		right: 4%;
		z-index: 99;
		i {
			color: #6c6666;
			font-size: 1.4rem;
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

.transition-box {
	position: fixed;
	left: 10px;
	bottom: -2px;
	z-index: 99999;
}
/deep/.ivu-card {
	padding: 0px 30px 10px;
}
/deep/.ivu-card-head {
	border-bottom: 1px solid #e8eaec;
	padding: 14px 16px;
	line-height: 1;
	background: #ed8b29;
	color: #fff;
	border-radius: 9px;
	font-size: 16px;
	font-weight: bold;
	> i {
		font-size: 18px;
	}
}
/deep/.ivu-modal-wrap {
	z-index: 1 !important;
}
</style>
