<template>
	<Modal
		v-model="modelFlag"
		:title="workbookIsAdd ? '新增工作簿' : `编辑工作簿【${submitData.workBookName}】`"
		fullscreen
		:mask-closable="false"
		:closable="true"
		:before-close="cancelClick"
	>
		<div class="workbook-container">
			<div class="top-container">
				<!-- 左侧数据集 -->
				<div class="left-box">
					<Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="100" :label-colon="true">
						<!-- 工作簿名称 -->
						<FormItem :label="$t('workBookName')" prop="workBookName">
							<Input v-model.trim="submitData.workBookName" :placeholder="$t('pleaseEnter') + $t('workBookName')" cleabler />
						</FormItem>
						<!-- 工作簿编码 -->
						<FormItem :label="$t('workBookCode')" prop="workBookCode">
							<Input v-model.trim="submitData.workBookCode" :placeholder="$t('pleaseEnter') + $t('workBookCode')" cleabler />
						</FormItem>
						<!-- 数据集 -->
						<FormItem :label="$t('setName')" prop="datasetId">
							<Select
								v-model="submitData.datasetId"
								filterable
								clearable
								:placeholder="$t('pleaseSelect') + $t('setName')"
								@on-change="getColumnList"
							>
								<Option v-for="(item, index) in datasetList" :value="item.id" :key="index">{{ item.datasetName }}</Option>
							</Select>
						</FormItem>
						<!-- 是否有效 -->
						<FormItem :label="$t('enabled')" prop="enabled">
							<i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
								<span slot="open">{{ $t("open") }}</span>
								<span slot="close">{{ $t("close") }}</span>
							</i-switch>
						</FormItem>
					</Form>
					<Input v-model="submitData.columnName" placeholder="请筛选信息" clearable suffix="ios-search" @on-change="getColumnList" />
					<div class="left-tree">
						<ul class="tree">
							<li v-for="(item, index) in data" :key="index" class="tree-father">
								<div @click="item.isShow = !item.isShow">
									<Icon type="ios-arrow-forward" :style="{ transform: item.isShow ? 'rotate(90deg)' : 'rotate(0deg)' }" />
									<Icon type="md-apps" /> {{ item.tableName }}
								</div>

								<ul class="subtree" v-if="item.isShow">
									<draggable v-model="item.children" :group="{ name: 'site', pull: 'clone', put: 'false' }" style="height: 99%" @end="treeDragEnd">
										<li class="subtree-li" v-for="(subitem, subIndex) in item.children" :key="subIndex">
											<!-- 自定义字段 0 代表维度转换为指标 1 代表指标转维度 2 代表自定义字段-->
											<template v-if="['0', '1', '2'].includes(subitem.columnType)">
												<icon custom="iconfont icon-huatifuhao" style="color: #13d613" />
											</template>
											<!-- 表 对应字段 -->
											<template v-else>
												<!-- 字符串 -->
												<icon custom="iconfont icon-string" v-if="subitem.dataType === 'String'" />
												<!-- 数字 -->
												<icon custom="iconfont icon-shuzishurukuang" v-else-if="subitem.dataType === 'Number'" />
												<!-- 时间 -->
												<icon custom="iconfont icon-riqishijian" v-else-if="subitem.dataType === 'DateTime'" />
												<!-- 任意类型 -->
												<icon custom="iconfont icon-huatifuhao" v-else />
											</template>

											<div class="value">
												{{ subitem.columnName }}
												<!-- 下拉框 -->
												<Dropdown style="float: right" @on-click="(name) => dropDownClick(name, subitem)">
													<Icon type="ios-arrow-down"></Icon>
													<template #list>
														<DropdownMenu>
															<!-- 编辑 -->
															<DropdownItem name="createField-edit" v-if="subitem.columnType == '2'">编辑</DropdownItem>
															<!-- 创建 -->
															<Dropdown placement="right-start">
																<DropdownItem>
																	创建
																	<Icon type="ios-arrow-forward" style="float: right"></Icon>
																</DropdownItem>
																<template #list>
																	<DropdownMenu>
																		<DropdownItem name="createField-create">计算字段</DropdownItem>
																	</DropdownMenu>
																</template>
															</Dropdown>
															<!-- 删除 -->
															<DropdownItem name="deleteFields" v-if="subitem.columnType == '2'">删除</DropdownItem>
														</DropdownMenu>
													</template>
												</Dropdown>
											</div>
										</li>
									</draggable>
								</ul>
							</li>
						</ul>
					</div>
				</div>
				<div class="center-box">
					<div class="filter">
						<div class="title">筛选器</div>
						<draggable group="site" v-model="filterData" id="filter" style="height: 99%" @end="filterDragEnd">
							<span v-for="(item, index) in filterData" :key="index" class="drag-cell">{{ item.columnName }}</span>
						</draggable>
					</div>
					<div class="mark">
						<div class="title">标记</div>
						<Select v-model="submitData.chartType" clearable placeholder="请选择图表">
							<Option v-for="item in chartList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
						<div class="mark-box">
							<draggable group="site" v-model="markData" id="color" class="box-cell">
								<div class="color"><Icon custom="iconfont icon-yansefangan" />颜色</div>
							</draggable>
							<draggable group="site" v-model="markData" id="size" class="box-cell">
								<div class="size"><Icon custom="iconfont icon-daxiao" />大小</div>
							</draggable>
							<draggable group="site" v-model="markData" id="mark" class="box-cell">
								<div class="tag"><Icon custom="iconfont icon-biaojibiaoqian" />标签</div>
							</draggable>
							<draggable group="site" v-model="markData" id="info" class="box-cell">
								<div class="detail-info"><Icon type="ios-more" />详细信息</div>
							</draggable>
							<draggable group="site" v-model="markData" id="mark-box" @end="markDragEnd">
								<div v-for="(item, index) in markData" :key="index">
									<Icon custom="iconfont icon-yansefangan" v-if="item.innerText === 'color'" />
									<Icon custom="iconfont icon-daxiao" v-if="item.innerText === 'size'" />
									<Icon custom="iconfont icon-biaojibiaoqian" v-if="item.innerText === 'mark'" />
									<Icon type="ios-more" v-if="item.innerText === 'info'" />
									<div class="drag-cell">{{ item.columnName }}</div>
								</div>
							</draggable>
						</div>
					</div>
				</div>
				<div class="right-box">
					<div class="row-column">
						<div class="row">
							<span class="title">列</span>
							<draggable group="site" v-model="columnData" class="drag-right" id="column" @end="columnDragEnd">
								<span v-for="(item, index) in columnData" :key="index" class="drag-cell">{{ item.columnName }}</span>
							</draggable>
						</div>
						<div class="column">
							<span class="title">行</span>
							<draggable group="site" v-model="rowData" class="drag-right" id="row" @end="rowDragEnd">
								<span v-for="(item, index) in rowData" :key="index" class="drag-cell">{{ item.columnName }}</span>
							</draggable>
						</div>
					</div>
					<div class="right-content">
						<div class="title">{{ submitData.title }}</div>
						<componentsTemp :type="submitData.chartType" :visib="true" />
					</div>
				</div>
			</div>

			<CreateFields ref="createField" :selectObj="selectObj" :isAdd="isAdd" @getColumnList="getColumnList" />
		</div>
		<div slot="footer" style="text-align: center">
			<Button @click="cancelClick">{{ $t("cancel") }}</Button>
			<Button type="primary" @click="submitClick">{{ $t("submit") }}</Button>
		</div>
	</Modal>
</template>
<script>
import draggable from "vuedraggable";
import componentsTemp from "./components/temp.vue";
import { getTabelColumnReq, deleteCustomerFieldReq, addReq, modifyReq } from "@/api/bill-design-manage/workbook-manage.js";
import CreateFields from "./create-fields.vue";
import { getlistReq } from "@/api/system-manager/data-item";
import { getDataSetListReq } from "@/api/bill-design-manage/data-set-config.js";

export default {
	name: "workbook-design",
	components: { draggable, componentsTemp, CreateFields },
	props: {
		modelFlag: {
			type: Boolean,
			default: () => false,
		},
		workbookIsAdd: {
			type: Boolean,
			default: () => false,
		},
		workbookSelectObj: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		modelFlag(newVal) {
			if (newVal) {
				this.$nextTick(() => {
					if (!this.workbookIsAdd) this.submitData = { ...this.submitData, ...this.workbookSelectObj };
					this.getDataSetList();
					this.getDataItemData(); //数据字典 获取类型
					this.getColumnList(); //获取左侧列
				});
			}
		},
	},
	data() {
		return {
			isAdd: true,
			tabValue: "data",
			drawerTitle: this.$t("add"),
			dragstartNode: "",
			dragstartData: "",
			contextData: "", //菜单
			selectObj: {},
			submitData: {
				id: "",
				remark: "",
				workBookName: "",
				workBookCode: "",
				datasetId: "",
				desc: "", //描述
				enabled: 1, //是否有效
				columnName: "",
				chartType: "componentTable",
				title: "工作表",
			},
			columnList: [],
			columnTypeList: [],
			data: [],
			datasetList: [],
			filterData: [], //过滤值
			columnData: [], //列值
			rowData: [], //行值
			markData: [],
			chartList: [
				{ label: "表格", value: "componentTable" },
				{ label: "柱状图", value: "componentBar" },
				{ label: "折线图", value: "componentLine" },
				{ label: "饼图", value: "componentPie" },
				{ label: "散点图", value: "componentScatter" },
				{ label: "盒须图", value: "componentBoxplot" },
			],

			// 验证实体
			ruleValidate: {
				workBookName: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("workBookName"),
					},
				],
				workBookCode: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("workBookCode"),
					},
				],
			},
		};
	},
	activated() {},
	// mounted() {
	// 	//{
	// 	//     "reportCode": "8",
	// 	//     "reportName": "9",
	// 	//     "datasetId": "FDB363A6D5DA41C4A8F42FB743F19D53"
	// 	// }
	// },
	methods: {
		//获取左侧数据集对应表及字段
		getColumnList() {
			const { datasetId, columnName } = this.submitData;
			const obj = { datasetId, enabled: 1, columnName };
			getTabelColumnReq(obj).then((res) => {
				if (res.code === 200) {
					const data = res?.result || [];
					const tableNameList = Array.from(new Set(data.map((item) => item.tableName)));
					const groupTableName = this.$XEUtiles.groupBy(data, "tableName");
					this.data = tableNameList.map((item, index) => {
						return { tableName: item, children: groupTableName[item], isShow: this.data[index]?.isShow || true };
					});
					console.log(this.data);
				}
			});
		},
		//下拉
		dropDownClick(name, row) {
			console.log("下拉", name, row);
			//删除自定义字段
			if (name === "deleteFields") {
				this.deleteFields(row);
				return;
			}
			let dropDownItem = name?.split("-") || [name];
			if (dropDownItem[1]) {
				if (dropDownItem[1] === "create") this.isAdd = true;
				if (dropDownItem[1] === "edit") this.isAdd = false;
			} else {
				this.isAdd = true;
			}

			const { datasetId } = this.submitData;
			this.selectObj = { ...row, type: "all", datasetId };
			this.$refs[dropDownItem[0]].modelFlag = true;
		},
		//删除自定义字段
		deleteFields(row) {
			const { nodeId } = row;
			deleteCustomerFieldReq({ id: nodeId }).then((res) => {
				if (res.code === 200) {
					this.getColumnList(); //重新获取左侧数据
					this.$Message.success("删除成功！");
				} else {
					this.$Message.error("删除失败", res.message);
				}
			});
		},
		// 获取数据字典数据
		async getDataItemData() {
			this.columnTypeList = await this.getDataItemDetailList("columnType");
			console.log("数据字典", this.columnTypeList);
		},
		async getDataItemDetailList(itemCode) {
			let arr = [];
			await getlistReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
		},
		filterDragEnd(e) {
			console.log("拖拽结束--过滤器", e);
			// this.filterData.splice(this.moveId, 1);
			if (e.to.id === "filter" && e.oldIndex === e.newIndex) {
				this.filterData.splice(e.oldIndex, 1);
			}
		},
		columnDragEnd(e) {
			console.log("拖拽结束--列", e);
			if (e.to.id === "column" && e.oldIndex === e.newIndex) {
				this.columnData.splice(e.oldIndex, 1);
			}
		},
		rowDragEnd(e) {
			console.log("拖拽结束--行", e);
			if (e.to.id === "row" && e.oldIndex === e.newIndex) {
				this.rowData.splice(e.oldIndex, 1);
			}
		},
		markDragEnd(e) {
			console.log("拖拽结束--标记", e);
			if (e.to.id === "mark-box" && e.oldIndex === e.newIndex) {
				this.markData.splice(e.oldIndex, 1);
			}
		},
		treeDragEnd(e) {
			console.log("拖拽结束--树", e);
			if (e.to.id === "color") {
				this.markData[e.newIndex].innerText = "color";
			}
			if (e.to.id === "size") {
				this.markData[e.newIndex].innerText = "size";
			}
			if (e.to.id === "mark") {
				this.markData[e.newIndex].innerText = "mark";
			}
			if (e.to.id === "info") {
				this.markData[e.newIndex].innerText = "info";
			}
			this.markData = JSON.parse(JSON.stringify(this.markData));
			console.log(this.markData);
		},
		//获取所有数据集
		getDataSetList() {
			this.dataSetIdName = {};
			getDataSetListReq().then((res) => {
				if (res.code === 200) {
					this.datasetList = res?.result || [];
					this.datasetList.forEach((item) => {
						this.dataSetIdName[item.id] = item.datasetName;
					});
					this.dataSetIdName = JSON.parse(JSON.stringify(this.dataSetIdName));
				}
			});
		},
		//提交
		submitClick() {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					let obj = { ...this.submitData };
					let request = this.workbookIsAdd ? addReq(obj) : modifyReq(obj);
					request.then((res) => {
						if (res.code === 200) {
							this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
							this.$parent.pageLoad(); //刷新表格
							this.cancelClick(); //关闭弹框
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")}${res.message}`);
					});
				}
			});
		},
		cancelClick() {
			this.data = [];
			this.filterData = []; //过滤值
			this.columnData = []; //列值
			this.rowData = []; //行值
			this.markData = [];
			this.$emit("update:modelFlag", false);
			this.$refs.submitReq.resetFields(); //清除表单红色提示
		},
	},
};
</script>
<style scoped lang="less">
.workbook-container {
	height: calc(100% - 20px);
	.top-container {
		display: flex;
		height: 100%;
		.left-box {
			width: 300px;
			padding: 10px;
			// border: 1px solid #27ce88;
			// background: #f8fffc;
			border: 1px solid #ccc;
			.left-title {
				padding: 10px;
				font-weight: bold;
				border-bottom: 1px solid #e8eaec;
				margin-bottom: 10px;
			}
			.left-tree {
				height: calc(100% - 200px);
				margin-top: 5px;
				.tree {
					height: 100%;
					overflow: auto;
					li {
						list-style: none;
					}
					.tree-father {
						padding: 10px 5px 0 5px;
						font-weight: bold;
					}
					.subtree {
						padding: 10px;
						font-weight: normal;
						.subtree-li {
							padding: 4px 10px;
							cursor: pointer;
							display: flex;
							justify-content: center;
							align-items: center;
							.value {
								width: calc(100% - 20px);
								height: 20px;
								line-height: 20px;
								padding: 0px 8px;
								&:hover {
									background: #4795b3;
									color: #fff;
								}
							}

							& > i {
								color: #299aff;
								width: 20px;
								text-align: center;
								padding: 2px;
								margin-right: 5px;
							}
						}
					}
				}
			}
		}
		.center-box {
			width: 200px;
			height: 100%;
			margin-left: 10px;
			.filter {
				width: 100%;
				height: 200px;
				padding: 10px;
				border: 1px dashed #ccc;
				border-bottom: none;
			}
			.mark {
				width: 100%;
				height: calc(100% - 200px);
				padding: 10px;
				border: 1px dashed #ccc;
				.mark-box {
					display: flex;
					flex-wrap: wrap;
					margin-top: 10px;
					.box-cell {
						width: calc(50% - 10px);
						height: 50px;
						line-height: 1;
						text-align: center;
						border: 1px solid #d4d4d4;
						margin: 5px;
						padding: 4px;
						cursor: pointer;
						i {
							display: inline-block;
							font-size: 25px;
							width: 100%;
						}
						&:hover {
							border: 1px solid #000;
						}
					}
				}
			}
			.title {
				padding: 4px;
				// background: #82c43e;
				// color: #fff;
				background: #eaeaea;
				text-align: center;
				margin-bottom: 5px;
			}
		}
		.right-box {
			flex: 1;
			margin-left: 10px;
			.row-column {
				.row,
				.column {
					height: 40px;
					border: 1px solid #ccc;
					margin-bottom: 10px;
					.title {
						display: inline-block;
						width: 40px;
						line-height: 40px;
						font-weight: bold;
						text-align: center;
						border-right: 1px solid #ccc;
					}
					.drag-right {
						display: inline-block;
						width: calc(100% - 40px);
					}
				}
			}
			.right-content {
				height: calc(100% - 100px);
				.title {
					padding: 5px 10px;
					font-weight: bold;
					font-size: 18px;
				}
			}
		}
	}

	.drag-cell {
		padding: 4px 20px;
		background: #4996b2;
		color: #fff;
		border-radius: 10px;
		margin: 4px;
		display: inline-block;
	}
}
:deep(.ivu-tree ul) {
	list-style: none;
	margin: 0;
	font-size: 12px;
	font-weight: bold;
	color: #000;
}
:deep(.ivu-tree-title.ivu-tree-title-selected, .ivu-tree-title:hover) {
	color: #fff;
}
:deep(.ivu-tree-title) {
	border-radius: 0px;
	span {
		display: inline-block;
		width: 90%;
	}
}
:deep(.ivu-tree-children .ivu-tree-title) {
	width: 90%;
	height: 18px;
	line-height: 18px;
	border-radius: 10px;
	padding-left: 10px;
	&:hover {
		background: #4795b3;
		color: #fff;
		border-radius: 10px;
	}
}
:deep(.ivu-tree-title.ivu-tree-title-selected, .ivu-tree-title:hover) {
	background-color: #4795b3;
}
:deep(.ivu-modal-fullscreen .ivu-modal-body) {
	bottom: 35px;
}
</style>
