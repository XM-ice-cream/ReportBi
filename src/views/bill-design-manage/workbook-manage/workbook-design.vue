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
									<draggable
										v-model="item.children"
										:group="{ name: 'site', pull: 'clone', put: 'false' }"
										:sort="false"
										:forceFallback="true"
										style="height: 99%"
										dragClass="dragClass"
										@end="(e) => dragEnd(e, 'tree')"
									>
										<li class="subtree-li" v-for="(subitem, subIndex) in item.children" :key="subIndex">
											<!-- 自定义字段 0 代表维度转换为指标 1 代表指标转维度 2 代表自定义字段-->
											<template v-if="['2'].includes(subitem.columnType)">
												<span style="color: #47a67f; margin-right: -5px; margin-top: -2px">=</span>
											</template>
											<!-- 表 对应字段 -->
											<!-- 字符串 -->
											<icon custom="iconfont icon-string" v-if="subitem.dataType === 'String'" />
											<!-- 数字 -->
											<icon custom="iconfont icon-huatifuhao" v-else-if="subitem.dataType === 'Number'" style="color: #47a67f" />
											<!-- 时间 -->
											<icon custom="iconfont icon-riqishijian" v-else-if="subitem.dataType === 'DateTime'" />
											<!-- 任意类型 -->
											<icon custom="iconfont icon-huatifuhao" v-else />

											<div :class="subitem.dataType === 'Number' ? 'number-value' : 'value'">
												{{ subitem.columnName }}
												<!-- 下拉框 -->
												<Dropdown style="float: right" @on-click="(name) => dropDownClick(name, subitem)">
													<Icon type="ios-arrow-down"></Icon>
													<template #list>
														<DropdownMenu>
															<!-- 编辑 -->
															<DropdownItem name="createField-edit" v-if="subitem.columnType == '2'">编辑</DropdownItem>
															<!-- 维度转指标 传0【自定义字段不可转】 -->
															<DropdownItem name="indicators" v-if="subitem.columnType != '2' && subitem.dataType !== 'Number'"
																>转换为指标</DropdownItem
															>
															<!-- 指标转维度 传1【自定义字段不可转】 -->
															<DropdownItem name="dimension" v-if="subitem.columnType != '2' && subitem.dataType == 'Number'"
																>转换为维度</DropdownItem
															>
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
				<!-- 筛选器、标记 -->
				<div class="center-box">
					<div class="filter">
						<div class="title">筛选器</div>
						<draggable
							group="site"
							v-model="filterData"
							id="filter"
							ghost-class="ghost"
							style="height: calc(100% - 50px); overflow: auto"
							@end="(e) => dragEnd(e, 'filter')"
						>
							<span v-for="(item, index) in filterData" :key="index" :class="item.dataType === 'Number' ? 'drag-number' : 'drag-cell'">
								{{ item.columnName }}
								<!-- 下拉框 -->
								<Dropdown style="float: right" @on-click="(name) => dropDownClick(name, item, index)">
									<Icon type="ios-arrow-down"></Icon>
									<template #list>
										<DropdownMenu>
											<!-- 编辑 -->
											<DropdownItem name="filterField-edit">编辑筛选器</DropdownItem>
											<!-- 删除 -->
											<DropdownItem name="filterField-delete">删除筛选器</DropdownItem>
										</DropdownMenu>
									</template>
								</Dropdown>
							</span>
						</draggable>
					</div>
					<div class="mark">
						<div class="title">标记</div>
						<Select v-model="submitData.chartType" clearable placeholder="请选择图表">
							<Option v-for="item in chartList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
						<div class="mark-box">
							<draggable group="site" v-model="markData" id="color" ghost-class="ghost" class="box-cell">
								<div class="color"><Icon custom="iconfont icon-yansefangan" />颜色</div>
							</draggable>
							<draggable group="site" v-model="markData" id="size" ghost-class="ghost" class="box-cell">
								<div class="size"><Icon custom="iconfont icon-daxiao" />大小</div>
							</draggable>
							<draggable group="site" v-model="markData" id="mark" ghost-class="ghost" class="box-cell">
								<div class="tag"><Icon custom="iconfont icon-biaojibiaoqian" />标签</div>
							</draggable>
							<draggable group="site" v-model="markData" id="info" ghost-class="ghost" class="box-cell">
								<div class="detail-info"><Icon type="ios-more" />详细信息</div>
							</draggable>
							<draggable
								group="site"
								v-model="markData"
								id="mark-box"
								ghost-class="ghost"
								@end="(e) => dragEnd(e, 'mark-box')"
								style="width: 100%; height: 100%; overflow: auto"
							>
								<div v-for="(item, index) in markData" :key="index">
									<Icon custom="iconfont icon-yansefangan" v-if="item.innerText === 'color'" />
									<Icon custom="iconfont icon-daxiao" v-if="item.innerText === 'size'" />
									<Icon custom="iconfont icon-biaojibiaoqian" v-if="item.innerText === 'mark'" />
									<Icon type="ios-more" v-if="item.innerText === 'info'" />
									<div :class="item.dataType === 'Number' ? 'drag-number' : 'drag-cell'">{{ item.columnName }}</div>
								</div>
							</draggable>
						</div>
					</div>
				</div>
				<!-- 行列 -->
				<div class="right-box">
					<div class="row-column">
						<div class="row">
							<span class="title">列</span>
							<draggable group="site" v-model="columnData" class="drag-right" ghost-class="ghost" id="column" @end="(e) => dragEnd(e, 'column')">
								<span
									v-for="(item, index) in columnData"
									:key="index"
									:class="item.dataType === 'Number' || item.calculatorFunction ? 'drag-number' : 'drag-cell'"
									style="width: fit-content"
								>
									{{ calculatorObj(item.calculatorFunction) }} {{ item.columnName }}
									<!-- 下拉框 -->
									<Dropdown @on-click="(name) => rowColumnDropDownClick(name, index, 'column')">
										<Icon type="ios-arrow-down"></Icon>
										<template #list>
											<DropdownItem name="">维度</DropdownItem>
											<DropdownMenu>
												<Dropdown placement="right-start">
													<DropdownItem>
														指标
														<Icon type="ios-arrow-forward"></Icon>
													</DropdownItem>
													<template #list>
														<DropdownMenu>
															<DropdownItem name="sum">总和</DropdownItem>
															<DropdownItem name="avg">平均值</DropdownItem>
															<DropdownItem name="count">计数</DropdownItem>
															<DropdownItem name="countDistinct">计数(不同)</DropdownItem>
															<DropdownItem name="max">最大值</DropdownItem>
															<DropdownItem name="min">最小值</DropdownItem>
															<DropdownItem name="stdev">标准差</DropdownItem>
														</DropdownMenu>
													</template>
												</Dropdown>
											</DropdownMenu>
										</template>
									</Dropdown>
								</span>
							</draggable>
						</div>
						<div class="column">
							<span class="title">行</span>
							<draggable group="site" v-model="rowData" class="drag-right" ghost-class="ghost" id="row" @end="(e) => dragEnd(e, 'row')">
								<span
									v-for="(item, index) in rowData"
									:key="index"
									:class="item.dataType === 'Number' || item.calculatorFunction ? 'drag-number' : 'drag-cell'"
									style="width: fit-content"
								>
									{{ calculatorObj(item.calculatorFunction) }} {{ item.columnName }}
									<!-- 下拉框 -->
									<Dropdown @on-click="(name) => rowColumnDropDownClick(name, index, 'row')">
										<Icon type="ios-arrow-down"></Icon>
										<template #list>
											<DropdownItem name="">维度</DropdownItem>
											<DropdownMenu>
												<Dropdown placement="right-start">
													<DropdownItem>
														指标
														<Icon type="ios-arrow-forward"></Icon>
													</DropdownItem>
													<template #list>
														<DropdownMenu>
															<DropdownItem name="sum">总和</DropdownItem>
															<DropdownItem name="avg">平均值</DropdownItem>
															<DropdownItem name="count">计数</DropdownItem>
															<DropdownItem name="countDistinct">计数(不同)</DropdownItem>
															<DropdownItem name="max">最大值</DropdownItem>
															<DropdownItem name="min">最小值</DropdownItem>
															<DropdownItem name="stdev">标准差</DropdownItem>
														</DropdownMenu>
													</template>
												</Dropdown>
											</DropdownMenu>
										</template>
									</Dropdown>
								</span>
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
			<FilterFields ref="filterField" :selectObj="selectObj" :isAdd="isAdd" @updateFilter="updateFilter" @deleteFilter="deleteFilter" />
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
import {
	getTabelColumnReq,
	deleteCustomerFieldReq,
	addReq,
	modifyReq,
	addCustomerFieldReq,
	modifyCustomerFieldReq,
} from "@/api/bill-design-manage/workbook-manage.js";
import CreateFields from "./create-fields.vue";
import FilterFields from "./filter-fields.vue";

import { getlistReq } from "@/api/system-manager/data-item";
import { getDataSetListReq } from "@/api/bill-design-manage/data-set-config.js";

export default {
	name: "workbook-design",
	components: { draggable, componentsTemp, CreateFields, FilterFields },
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
			console.log("modelFlag", this.modelFlag);
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
					//获取所有tableName
					const tableNameList = Array.from(new Set(data.map((item) => item.tableName)));
					//tableName 分组
					const groupTableName = this.$XEUtiles.groupBy(data, "tableName");
					// 指标、维度分类
					this.data = tableNameList.map((item, index) => {
						const children = groupTableName[item].map((item) => {
							let index = 0;
							switch (item.dataType) {
								case "Number":
									item.columnType == "2" ? (index = 2) : (index = 1);
									break;
							}
							return { ...item, index };
						});
						console.log(children);
						return { tableName: item, children: this.$XEUtiles.orderBy(children, "index"), isShow: this.data[index]?.isShow || true };
					});
				}
			});
		},
		//下拉
		dropDownClick(name, row, index) {
			const { datasetId } = this.submitData;
			this.selectObj = { ...row, type: "all", datasetId, labelName: row.tableName, fieldCode: row.columnName, id: row.nodeId };
			console.log("下拉", name, row);

			switch (name) {
				// 删除自定义字段
				case "deleteFields":
					this.deleteFields(row);
					break;
				// 创建自定义字段
				case "createField-create":
					this.isAdd = true;
					this.$refs.createField.modelFlag = true;
					break;
				//编辑自定义字段
				case "createField-edit":
					this.isAdd = false;
					this.$refs.createField.modelFlag = true;
					break;
				//转换为指标
				case "indicators":
					this.changeToProperty(this.selectObj, 0);
					break;
				//转换为维度
				case "dimension":
					this.changeToProperty(this.selectObj, 1);
					break;
				//编辑筛选器
				case "filterField-edit":
					this.$refs.filterField.modelFlag = true;
					break;
				//删除筛选器
				case "filterField-delete":
					this.deleteFilter(index);
					break;
			}
		},
		//行列下拉框
		rowColumnDropDownClick(name, index, type) {
			switch (type) {
				case "row":
					this.rowData[index].calculatorFunction = name;
					this.rowData = JSON.parse(JSON.stringify(this.rowData));
					break;
				case "column":
					this.columnData[index].calculatorFunction = name;
					this.columnData = JSON.parse(JSON.stringify(this.columnData));
					break;
			}
			console.log("row", this.rowData, "column", this.columnData);
		},
		//转换为指标 0 或 维度 1
		changeToProperty(row, type) {
			let requestApi = addCustomerFieldReq;
			let obj = { ...row, typeConvert: type, remark: 1 };
			console.log("指标转换", obj);
			switch (row.columnType) {
				case "1":
					//删除
					requestApi = deleteCustomerFieldReq;
					break;
				case "2":
					//编辑
					obj = { ...row, typeConvert: type, remark: 2 };
					requestApi = modifyCustomerFieldReq;
					break;
				default:
					//新增
					obj = { ...row, typeConvert: type, remark: 1 };
					requestApi = addCustomerFieldReq;
					break;
			}
			requestApi(obj).then((res) => {
				if (res.code === 200) {
					this.getColumnList(); //重新刷新左侧数据
				} else {
					this.$Message.error(`操作失败！${res.message}`);
				}
			});
		},
		//拖拽结束
		dragEnd(e, type) {
			console.log(e, type);
			const { oldIndex, newIndex, to } = e;
			const { id } = to;
			switch (type) {
				case "filter":
					id === "filter" && oldIndex === newIndex ? this.filterData.splice(oldIndex, 1) : "";
					break;
				case "column":
					id === "column" && oldIndex === newIndex ? this.columnData.splice(oldIndex, 1) : "";
					break;
				case "row":
					id === "row" && oldIndex === newIndex ? this.rowData.splice(oldIndex, 1) : "";
					break;
				case "mark-box":
					id === "mark-box" && oldIndex === newIndex ? this.markData.splice(oldIndex, 1) : "";
					break;
				case "tree":
					if (["color", "size", "mark", "info"].includes(id)) {
						this.markData[newIndex].innerText = id;
						this.markData = JSON.parse(JSON.stringify(this.markData));
					}
					break;
			}
			//数据拖拽至筛选器
			//过滤器
			if (id === "filter" && type !== "filter") {
				this.selectObj = { ...this.filterData[newIndex], newIndex };
				this.$refs.filterField.modelFlag = true;
			}
			console.log(this.markData);
		},
		//删除自定义字段
		deleteFields(row) {
			const { nodeId } = row;
			deleteCustomerFieldReq({ id: nodeId }).then((res) => {
				if (res.code === 200) {
					this.getColumnList(); //重新获取左侧数据
					this.$Message.success("删除成功！");
				} else {
					this.$Message.error(`删除失败, ${res.message}`);
				}
			});
		},
		//更新过滤器数据
		updateFilter(newIndex, obj) {
			this.filterData[newIndex] = { ...obj };
			this.filterData = JSON.parse(JSON.stringify(this.filterData));
			console.log("更新过滤器数据", this.filterData[newIndex]);
		},
		// 删除过滤数据
		deleteFilter(newIndex) {
			this.filterData.splice(newIndex, 1);
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
		//取消
		cancelClick() {
			this.data = [];
			this.filterData = []; //过滤值
			this.columnData = []; //列值
			this.rowData = []; //行值
			this.markData = [];
			this.$emit("update:modelFlag", false);
			this.$refs.submitReq.resetFields(); //清除表单红色提示
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
			};
			return obj[name];
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
									background: #4996b2;
									color: #fff;
								}
							}
							.number-value {
								width: calc(100% - 20px);
								height: 20px;
								line-height: 20px;
								padding: 0px 8px;
								&:hover {
									background: #00b180;
									color: #fff;
								}
							}

							& > i {
								color: #367e9c;
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
					width: 100%;
					height: calc(100% - 200px);
					display: flex;
					flex-wrap: wrap;
					align-content: flex-start;
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
				/deep/.ivu-dropdown {
					margin-left: 5px;
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
		width: calc(100% - 25px);
		padding: 2px 20px;
		text-align: center;
		background: #4996b2;
		color: #fff;
		border-radius: 10px;
		margin: 4px;
		display: inline-block;
	}
	.drag-number {
		width: calc(100% - 25px);
		padding: 2px 20px;
		text-align: center;
		background: #00b180;
		color: #fff;
		border-radius: 10px;
		margin: 4px;
		display: inline-block;
	}
	.ghost {
		background: #4996b2 !important;
		list-style: none;
		color: #fff;
		z-index: 9999999999999999;
		width: fit-content;
		padding: 2px 20px;
		height: 20px;
		display: none;
		font-size: 10px !important;
		& > i {
			display: none;
		}
	}
	.dragClass {
		background: #4996b2 !important;
		list-style: none;
		color: #fff;
		z-index: 9999999999999999;
		width: fit-content;
		padding: 2px 20px;
		height: 20px;
		display: inline-block;
		font-size: 10px !important;
		border-radius: 10px !important;
		& > i {
			display: none;
		}
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
:deep(.ivu-modal-header p, .ivu-modal-header-inner) {
	color: #17233d;
}
</style>
