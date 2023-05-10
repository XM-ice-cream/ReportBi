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
						<!-- 最大数据量 -->
						<FormItem label="最大数据量" prop="maxNumber">
							<Input v-model.trim="submitData.maxNumber" :placeholder="$t('pleaseEnter') + '最大数据量【推荐2000笔】'" cleabler />
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
								<div @click="item.isShow = !item.isShow" class="textOverhidden">
									<Icon type="ios-arrow-forward" :style="{ transform: item.isShow ? 'rotate(90deg)' : 'rotate(0deg)' }" />
									<Icon type="md-apps" /> {{ item.labelName }}
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

											<div :class="subitem.dataType === 'Number' ? 'number-value' : 'value'" @click.stop>
												{{ subitem.columnName }}
												<!-- 下拉框 -->
												<Dropdown style="float: right" @on-click="(name) => dropDownClick(name, subitem, 0, 0, 'create-fileds')">
													<Icon type="ios-arrow-down"></Icon>
													<template #list>
														<DropdownMenu>
															<!-- 编辑 -->
															<DropdownItem name="edit" v-if="subitem.columnType == '2'">编辑</DropdownItem>
															<!-- 维度转指标 传0【自定义字段不可转】 -->
															<DropdownItem name="indicators" v-if="subitem.columnType != '2' && subitem.dataType !== 'Number'"
																>转换为指标</DropdownItem
															>
															<!-- 指标转维度 传1【自定义字段不可转】 -->
															<DropdownItem name="dimension" v-if="subitem.columnType != '2' && subitem.dataType == 'Number'"
																>转换为维度</DropdownItem
															>
															<!-- 创建计算字段 -->
															<DropdownItem name="create">创建计算字段</DropdownItem>
															<!-- 删除 -->
															<DropdownItem name="delete" v-if="subitem.columnType == '2'">删除</DropdownItem>
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
					<!-- 筛选器 -->
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
							<span v-for="(item, index) in filterData" :key="index" :class="isNumberCell(item)">
								<div class="textOverhidden" style="width: 80%" @dblclick="item.isEdit = true" v-if="!item.isEdit">
									{{ calculatorObj(item.calculatorFunction, item.columnRename) }}
								</div>
								<Input type="text" v-model="item.columnRename" v-if="item.isEdit" @on-blur="item.isEdit = false" class="rename-input" />
								<!-- 下拉框 -->
								<Dropdown style="float: right" @on-click="(name) => dropDownClick(name, item, index, 0, 'filter')">
									<Icon type="ios-arrow-down"></Icon>
									<template #list>
										<DropdownMenu>
											<!-- 编辑 -->
											<DropdownItem name="edit">编辑筛选器</DropdownItem>
											<!-- 删除 -->
											<DropdownItem name="delete">删除筛选器</DropdownItem>
										</DropdownMenu>
									</template>
								</Dropdown>
							</span>
						</draggable>
					</div>
					<!-- 标记 -->
					<div class="mark">
						<div class="title">标记</div>
						<!-- 手风琴 -->
						<Collapse accordion v-model="collapse" style="max-height: calc(100% - 30px); overflow: hidden">
							<Panel
								v-for="(item, markIndex) in markData"
								:key="markIndex"
								:name="markIndex.toString()"
								class="markPanel"
								:title="item.name"
								@dblclick.stop
							>
								{{ item.name }}

								<template #content>
									<Select v-model="markData[markIndex].chartType" clearable placeholder="请选择图表" @on-change="changeMarks(markIndex)">
										<Option v-for="item in chartList" :value="item.value" :key="item.value">{{ item.label }}</Option>
									</Select>
									<div class="mark-box">
										<draggable
											group="site"
											v-model="markData[markIndex].data"
											:id="`color,${markIndex}`"
											ghost-class="ghost"
											class="box-cell"
											:name="markIndex"
										>
											<div class="color"><Icon custom="iconfont icon-yansefangan" />颜色</div>
										</draggable>
										<!-- 文本宽度只能在 全部 中设定 -->
										<draggable
											group="site"
											v-model="markData[markIndex].data"
											:id="`labelWidth,${markIndex}`"
											ghost-class="ghost"
											class="box-cell"
											v-if="markIndex == 0"
										>
											<div class="labelWidth"><Icon custom="iconfont icon-kuandu" />文本宽度</div>
										</draggable>

										<draggable group="site" v-model="markData[markIndex].data" :id="`mark,${markIndex}`" ghost-class="ghost" class="box-cell">
											<div class="tag"><Icon custom="iconfont icon-biaojibiaoqian" />标签</div>
										</draggable>
										<draggable group="site" v-model="markData[markIndex].data" :id="`info,${markIndex}`" ghost-class="ghost" class="box-cell">
											<div class="detail-info"><Icon type="ios-more" />详细信息</div>
										</draggable>
										<!-- 角度只能在 全部且饼图 中设定-->
										<draggable
											group="site"
											v-model="markData[markIndex].data"
											:id="`angle,${markIndex}`"
											ghost-class="ghost"
											class="box-cell"
											v-if="markIndex == 0 && markData[markIndex].chartType == 'componentPie'"
										>
											<div class="angle"><Icon custom="iconfont icon-jiaodu" />角度</div>
										</draggable>
										<draggable
											group="site"
											v-model="markData[markIndex].data"
											:id="`mark-box,${markIndex}`"
											ghost-class="ghost"
											@end="(e) => dragEnd(e, 'mark-box', markIndex)"
											style="width: 100%; max-height: 200px; overflow: auto"
										>
											<div v-for="(item, index) in markData[markIndex].data" :key="index" style="display: flex; align-items: center">
												<!-- 图标 -->
												<Icon custom="iconfont icon-yansefangan" v-if="item.innerText === 'color'" />
												<Icon custom="iconfont icon-biaojibiaoqian" v-if="item.innerText === 'mark'" />
												<Icon type="ios-more" v-if="item.innerText === 'info'" />
												<Icon custom="iconfont icon-kuandu" v-if="item.innerText === 'labelWidth'" />
												<Icon custom="iconfont icon-jiaodu" v-if="item.innerText === 'angle'" />
												<!-- 字段显示 -->
												<div :class="isNumberCell(item)">
													<div
														class="textOverhidden"
														style="width: 80%"
														:title="calculatorObj(item.calculatorFunction, item.columnRename)"
														@dblclick="changeMarkIsEdit(markIndex, index)"
														v-if="!markData[markIndex].data[index].isEdit"
													>
														<icon custom="iconfont icon-paixu" :class="item.sortBy" v-if="item.sortBy && item.sortBy !== '0'" />
														{{ calculatorObj(item.calculatorFunction, item.columnRename) }}
													</div>
													<Input
														type="text"
														v-model="markData[markIndex].data[index].columnRename"
														v-if="markData[markIndex].data[index].isEdit"
														@on-blur="markData[markIndex].data[index].isEdit = false"
														class="rename-input"
													/>
													<!-- 下拉选 -->
													<DropdownFields type="mark" :data="item" :index="index" :markIndex="markIndex" @dropDownClick="dropDownClick" />
												</div>
											</div>
										</draggable>
									</div>
								</template>
							</Panel>
						</Collapse>
					</div>
				</div>
				<!-- 行列 、工作区-->
				<div class="right-box">
					<!-- 行列拖拽 -->
					<div class="row-column">
						<!-- 行 -->
						<div class="row" :class="isDisabledCell()">
							<span class="title">列</span>
							<draggable group="site" v-model="columnData" class="drag-right" ghost-class="ghost" id="column" @end="(e) => dragEnd(e, 'column')">
								<span v-for="(item, index) in columnData" :key="index" :class="isNumberCell(item)" style="width: fit-content">
									<span @dblclick="item.isEdit = true" v-if="!item.isEdit">
										<icon custom="iconfont icon-paixu" :class="item.sortBy" v-if="item.sortBy && item.sortBy !== '0'" />{{
											calculatorObj(item.calculatorFunction, item.columnRename)
										}}
									</span>
									<Input type="text" v-model="item.columnRename" v-if="item.isEdit" @on-blur="item.isEdit = false" class="rename-input" />
									<!-- 下拉选 -->
									<DropdownFields type="column" :data="item" :index="index" markIndex="" @dropDownClick="dropDownClick" />
								</span>
							</draggable>
						</div>
						<!-- 列 -->
						<div class="column" :class="isDisabledCell()">
							<span class="title">行</span>
							<draggable group="site" v-model="rowData" class="drag-right" ghost-class="ghost" id="row" @end="(e) => dragEnd(e, 'row')">
								<span v-for="(item, index) in rowData" :key="index" :class="isNumberCell(item)" style="width: fit-content">
									<span @dblclick="item.isEdit = true" v-if="!item.isEdit">
										<icon custom="iconfont icon-paixu" :class="item.sortBy" v-if="item.sortBy && item.sortBy !== '0'" />{{
											calculatorObj(item.calculatorFunction, item.columnRename)
										}}
									</span>
									<Input type="text" v-model="item.columnRename" v-if="item.isEdit" @on-blur="item.isEdit = false" class="rename-input" />
									<!-- 下拉选 -->
									<DropdownFields type="row" :data="item" :index="index" markIndex="" @dropDownClick="dropDownClick" />
								</span>
							</draggable>
						</div>
						<!-- 查询按钮 -->
						<Button type="primary" @click="searchClick" class="search-btn">{{ $t("search") }}</Button>
					</div>
					<!-- 工作区 -->
					<div class="right-content">
						<componentsTemp
							v-if="modelFlag"
							ref="tempRef"
							:title="submitData.workBookName"
							:type="markData[0]?.chartType || 'bar'"
							:visib="true"
							:value="chartsData"
							:row="rowData"
							:column="columnData"
							:mark="markData"
						/>
					</div>
				</div>
			</div>

			<!-- 创建自定义字段 -->
			<CreateFields ref="createField" :selectObj="selectObj" :isAdd="isAdd" @getColumnList="getColumnList" />
			<!-- 过滤字段属性设定 -->
			<FilterFields ref="filterField" :selectObj="selectObj" :isAdd="isAdd" @updateFilter="updateFilter" />
			<!-- 标记属性设定 -->
			<MarkFields ref="markField" :selectObj="selectObj" :filterData="filterData" :isAdd="isAdd" @updateMark="updateMark" />
			<!-- 排序属性设定 -->
			<SortbyFields ref="sortbyField" :selectObj="selectObj" :filterData="filterData" @updateSort="updateSort" />
		</div>
		<div slot="footer" style="text-align: center">
			<Button @click="cancelClick">{{ $t("cancel") }}</Button>
			<Button @click="previewClick" class="preview-btn" :disabled="!btnDistabled">预览</Button>
			<Button @click="submitClick(true)" class="preview-btn" :disabled="!btnDistabled">提交并预览</Button>
			<Button type="primary" @click="submitClick(false)" :disabled="!btnDistabled">{{ $t("submit") }}</Button>
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
	getChartsInfoReq,
} from "@/api/bill-design-manage/workbook-manage.js";
import { getEchoReq } from "@/api/bill-design-manage/workbook-design";
import CreateFields from "./create-fields.vue";
import FilterFields from "./filter-fields.vue";
import MarkFields from "./mark-fields.vue";
import { getDataSetListReq } from "@/api/bill-design-manage/data-set-config.js";
import SortbyFields from "./sortby-fields.vue";
import DropdownFields from "./dropdown-fields.vue";

export default {
	name: "workbook-design",
	components: { draggable, componentsTemp, CreateFields, FilterFields, MarkFields, SortbyFields, DropdownFields },
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
					//编辑 或 复制
					if (this.workbookIsAdd !== true) {
						this.submitData = { ...this.submitData, ...this.workbookSelectObj };
						//对 工作簿名称、编码 重命名
						if (this.workbookIsAdd === "copy") {
							this.submitData.workBookCode = `${this.submitData.workBookCode}_copy`;
							this.submitData.workBookName = `${this.submitData.workBookName}_copy`;
						}
						this.pageLoad(); //查询信息
					}
					this.getDataSetList();
					this.getColumnList(); //获取左侧列
				});
			}
		},
		changeRowColumn() {
			this.$nextTick(() => {
				this.changeRowColumnbyMark();
			});
		},
	},
	computed: {
		changeRowColumn() {
			return this.rowData.concat(this.columnData);
		},
	},

	data() {
		return {
			btnDistabled: true,
			isAdd: true,
			tabValue: "data",
			drawerTitle: this.$t("add"),
			collapse: "0",
			dragstartNode: "",
			dragstartData: "",
			contextData: "", //菜单
			chartsData: [], //查询获取的图表信息
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
				chartType: "bar",
				maxNumber: 2000,
			},
			columnList: [],
			columnTypeList: [],
			data: [],
			datasetList: [],
			filterData: [], //过滤值
			columnData: [], //列值
			rowData: [], //行值
			markData: [{ name: "全部", chartType: "bar", data: [] }],
			defaultMarkValue: { startRange: "red", endRange: "green" },
			chartList: [
				{ label: "文本", value: "componentText" },
				{ label: "柱状图", value: "bar" },
				{ label: "折线图", value: "line" },
				{ label: "散点图", value: "scatter" },
				{ label: "盒须图", value: "componentBoxplot" },
				{ label: "饼图", value: "componentPie" },
				{ label: "热力图", value: "componentHeatMap" },
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
	methods: {
		//加载信息
		pageLoad() {
			getEchoReq({ id: this.submitData.id }).then((res) => {
				if (res.code == 200) {
					let { calcItems, filterItems, markStyle, maxNumber } = res.result;
					this.submitData = { ...this.submitData, maxNumber };
					//相关可重命名的模块，均加isEdit参数
					calcItems = calcItems.map((item) => {
						return { ...item, isEdit: false };
					});
					filterItems = filterItems.map((item) => {
						return { ...item, isEdit: false };
					});

					this.filterData = filterItems; //过滤器
					this.rowData = calcItems.filter((item) => item.axis == "x"); //行
					this.columnData = calcItems.filter((item) => item.axis == "y"); //列

					this.markData = markStyle && markStyle !== "{}" ? JSON.parse(markStyle) : [{ name: "全部", chartType: "bar", data: [] }]; //标记
					this.$nextTick(() => {
						//加载图表数据
						this.searchClick();
					});
				}
			});
		},
		//查询
		searchClick() {
			//数据集
			const { datasetId, maxNumber } = this.submitData;
			const angelData = this.markData[0].data.filter((item) => item.innerText == "angle");

			if (!this.filterData.length) {
				this.$Msg.error("请拖拽字段至筛选器");
				return;
			}
			//饼图 并不需要拖拽行、列
			if (!this.rowData.length && !(this.markData[0].chartType === "componentPie")) {
				this.$Msg.error("请拖拽字段至行");
				return;
			}
			if (!this.columnData.length && !(this.markData[0].chartType === "componentPie")) {
				this.$Msg.error("请拖拽字段至列");
				return;
			}
			//判断角度是否为指标类型
			if (angelData.length && !this.numberType(angelData[0])) {
				this.$Msg.error("角度为指标类型，请修改相关属性配置");
				return;
			}
			this.updateDragData(); //更新row,column数据

			let markData = [];
			this.markData.forEach((item) => {
				item.data.markValue = "";
				markData.push(item.data);
			});
			this.$Spin.show();
			const obj = {
				maxNumber: parseInt(maxNumber),
				datasetId,
				filterItems: this.filterData,
				calcItems: this.rowData.concat(this.columnData),
				markItems: markData.flat().map((item) => {
					return { ...item, markValue: "" };
				}),
			};

			getChartsInfoReq(obj)
				.then((res) => {
					//存在有数据返回 但code=-1(数据超过最大范围)
					if (res.code == 200 || res.result.length > 0) {
						if (res.code == -1) this.$Msg.warning(`${res.message}`);

						this.chartsData = res?.result || [];
						this.$nextTick(() => {
							this.$refs.tempRef.pageLoad();
						});
					} else {
						this.$Msg.error(`查询失败，${res.message}`);
					}
				})
				.finally(() => {
					this.$Spin.hide();
				});
		},

		//获取左侧数据集对应表及字段
		getColumnList() {
			const { datasetId, columnName } = this.submitData;
			const obj = { datasetId, enabled: 1, columnName };
			getTabelColumnReq(obj).then((res) => {
				if (res.code === 200) {
					const data = res?.result || [];
					//获取所有labelName
					const labelNameList = Array.from(new Set(data.map((item) => item.labelName)));
					//labelName 分组
					const groupTableName = this.$XEUtils.groupBy(data, "labelName");
					// 指标、维度分类
					this.data = labelNameList.map((item, index) => {
						const children = groupTableName[item].map((item) => {
							let index = 0;
							switch (item.dataType) {
								case "Number":
									item.columnType == "2" ? (index = 2) : (index = 1);
									break;
							}
							return { ...item, index, columnRename: item.columnName, isEdit: false };
						});
						return { labelName: item, children: this.$XEUtils.orderBy(children, "index"), isShow: this.data[index]?.isShow || true };
					});
				}
			});
		},

		//标记 下拉
		dropDownClick(name, row, index, markIndex, type) {
			const { datasetId } = this.submitData;
			this.selectObj = {
				...row,
				type: "all",
				datasetId,
				labelName: row.labelName,
				fieldCode: row.columnName,
				id: row.nodeId,
				newIndex: index,
				markIndex,
			};

			switch (name) {
				case "create":
					if (type == "create-fileds") {
						this.isAdd = true;
						//新增 默认值为字段名
						const { columnName, labelName } = this.selectObj;
						this.selectObj.fieldFunction = `[${columnName}(${labelName})]`;
						this.$refs.createField.modelFlag = true;
					}
					break;
				case "delete":
					if (type == "row") this.rowData.splice(index, 1);
					if (type == "column") this.columnData.splice(index, 1);
					if (type == "filter") this.filterData.splice(index, 1);
					if (type == "create-fileds") this.deleteFields(row);
					if (type == "mark") {
						const data = this.markData[markIndex].data[index];
						this.markData[markIndex].data.splice(index, 1);
						this.changeMarks(markIndex, "delete", data);
					}
					break;
				case "sortby":
					if (type == "row") this.selectObj.sortType = "row";
					if (type == "column") this.selectObj.sortType = "column";
					if (type == "mark") this.selectObj.sortType = "mark";
					this.$refs.sortbyField.modelFlag = true;
					break;
				case "edit":
					if (type == "filter") this.$refs.filterField.modelFlag = true;
					if (type == "create-fileds") {
						this.isAdd = false;
						this.$refs.createField.modelFlag = true;
					}
					if (type == "mark") {
						this.isAdd = false;
						this.$refs.markField.modelFlag = true;
					}
					break;

				//转换为指标
				case "indicators":
					this.changeToProperty(this.selectObj, 0);
					break;
				//转换为维度
				case "dimension":
					this.changeToProperty(this.selectObj, 1);
					break;

				// 函数执行
				default:
					if (type == "row") {
						this.rowData[index] = {
							...this.rowData[index],
							calculatorFunction: name,
							sortValue: [],
						};
					}

					if (type === "column") {
						this.columnData[index] = { ...this.columnData[index], calculatorFunction: name, sortValue: [], markValue: this.defaultMarkValue };
					}
					if (type === "mark") {
						this.markData[markIndex].data[index] = {
							...this.markData[markIndex].data[index],
							calculatorFunction: name,
							sortValue: [],
						};
						this.markData[markIndex].data[index].markValue = this.numberType(this.markData[markIndex].data[index]) ? this.defaultMarkValue : [];
						const data = this.markData[markIndex].data[index];
						this.changeMarks(markIndex, "update", data);
					}
					break;
			}
			this.updateDragData(); //更新row,column数据
		},
		//转换为指标 0 或 维度 1
		changeToProperty(row, type) {
			let requestApi = addCustomerFieldReq;
			let obj = { ...row, typeConvert: type, remark: 1 };
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
					this.$Msg.error(`操作失败！${res.message}`);
				}
			});
		},
		//拖拽结束
		dragEnd(e, type) {
			const { datasetId } = this.submitData;
			let { oldIndex, newIndex, to } = e;
			const id = to.id.split(",")[0];
			const markIndex = to.id.split(",")[1];
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
					if (id === "mark-box" && oldIndex === newIndex) {
						const data = this.markData[markIndex].data[newIndex];
						this.markData[markIndex].data.splice(oldIndex, 1);
						this.changeMarks(markIndex, "delete", data); //联动删除标记字段
					}
					break;
				case "tree":
					if (["color", "mark", "info", "labelWidth", "angle"].includes(id)) {
						//会有newIndex 为1 但其实应该是0 的情况
						if (!this.markData[markIndex].data[newIndex]) newIndex = 0;

						this.markData[markIndex].data[newIndex]["innerText"] = id;

						//保证标记的数据中角度设定只有一个
						if (id === "angle") return this.deleteColorAngle(id, markIndex, newIndex);

						this.changeMarks(markIndex, "add", this.markData[markIndex].data[newIndex]); //联动添加标记字段

						this.markData = JSON.parse(JSON.stringify(this.markData));
					}
					break;
			}

			//更新row,column数据
			this.updateDragData();

			//数据拖拽至筛选器
			//过滤器
			if (id === "filter" && type !== "filter") {
				const { nodeId, columnName } = this.filterData[newIndex];
				const filterIndex = this.filterData.findIndex((item) => item.nodeId == nodeId && item.columnName == columnName);
				if (filterIndex !== newIndex) {
					this.$Msg.warning("禁止拖拽重复字段");
					this.filterData.splice(newIndex, 1);
					return;
				}
				this.selectObj = { ...this.filterData[newIndex], newIndex, datasetId, showData: 0 };
				this.$refs.filterField.modelFlag = true;
			}
			//标记(颜色、文本宽度开启弹框)
			if (["labelWidth"].includes(id) && type !== "mark-box") {
				this.selectObj = { ...this.markData[markIndex].data[newIndex], newIndex, datasetId, markIndex };
				this.isAdd = true; //新增
				this.$refs.markField.modelFlag = true;
			}
			//数据拖拽至行
			if (id === "row" && type !== "row") {
				const { columnType, dataType } = this.rowData[newIndex];
				//如果标记为饼图 无法拖拽至行列中
				if (this.markData[0].chartType == "componentPie") {
					this.rowData.splice(newIndex, 1);
					this.$Msg.warning("饼图无需拖拽字段到行中");
					return;
				}
				//转换为维度
				if (columnType === "1" && dataType === "String") this.rowData[newIndex].calculatorFunction = "toChar";
				//转换为指标
				if (columnType === "1" && dataType === "Number") this.rowData[newIndex].calculatorFunction = "countDistinct";
				this.rowData = JSON.parse(JSON.stringify(this.rowData));
			}
			//数据拖拽至列
			if (id === "column" && type !== "column") {
				const { columnType, dataType } = this.columnData[newIndex];

				//如果标记为饼图 无法拖拽至行列中
				if (this.markData[0].chartType == "componentPie") {
					this.columnData.splice(newIndex, 1);
					this.$Msg.warning("饼图无需拖拽字段到列中");
					return;
				}
				//转换为维度
				if (columnType === "1" && dataType === "String") this.columnData[newIndex].calculatorFunction = "toChar";
				//转换为指标
				if (columnType === "1" && dataType === "Number") this.columnData[newIndex].calculatorFunction = "countDistinct";
				this.columnData = JSON.parse(JSON.stringify(this.columnData));
			}
		},
		//修改拖拽的数据
		updateDragData() {
			//拖拽的行
			this.rowData = this.rowData.map((item, index) => {
				return { ...item, axis: "x", orderBy: index };
			});
			//拖拽的列
			this.columnData = this.columnData.map((item, index) => {
				return { ...item, axis: "y", orderBy: index };
			});

			//标记
			this.markData.forEach((item, index) => {
				item.data.forEach((itemData, dataIndex) => {
					this.markData[index].data[dataIndex] = { ...itemData, axis: "z", orderBy: `${index}${dataIndex}` };
				});
			});
		},

		//更新过滤器数据
		updateFilter(newIndex, obj) {
			this.filterData[newIndex] = { ...obj };
			this.filterData = JSON.parse(JSON.stringify(this.filterData));
		},
		//更新排序数据
		updateSort(newIndex, data, markIndex) {
			if (data.sortType === "mark") {
				this.markData[markIndex].data[newIndex] = { ...data };
				this.changeMarks(markIndex, "update", data);
				this.markData = JSON.parse(JSON.stringify(this.markData));
			}
			if (data.sortType === "row") {
				this.rowData[newIndex] = { ...data };
				this.rowData = JSON.parse(JSON.stringify(this.rowData));
			}
			if (data.sortType === "column") {
				this.columnData[newIndex] = { ...data };
				this.columnData = JSON.parse(JSON.stringify(this.columnData));
			}
		},
		//修改第0个标记，联动其余标记；其余标记均修改后，自动修改第0标记
		changeMarks(markIndex, type, data) {
			console.log(markIndex, type, data);
			const chartType = this.markData[markIndex].chartType;
			//饼图 不需要行列信息
			if (!type && chartType == "componentPie" && (this.rowData.length || this.columnData.length)) {
				this.$Modal.confirm({
					title: "确认要选择饼图图表吗?",
					content: "如果确认,我将删除已拖拽的行列字段信息",
					onOk: () => {
						this.rowData = [];
						this.columnData = [];
						this.markData[0].chartType = "componentPie";
						this.collapse = "0";
					},
				});
			}
			//饼图 切换为其他图表时 删除角度数据
			if (!type && chartType !== "componentPie") {
				const angleIndex = this.markData[0].data.findIndex((item) => item.innerText === "angle");
				if (angleIndex > -1) this.markData[0].data.splice(angleIndex, 1);
			}

			let chartFlag = true;
			let deleteFlag = true;
			let addFlag = true;
			//除全部标记 以外的所有图表类型为相同时，修改全部的图表类型

			for (let i = 1; i < this.markData.length; i++) {
				//修改图表类别
				if (this.markData[i].chartType !== chartType) chartFlag = false;
				//判断是否已存在
				const markIndexOthers = this.markIndexOf(i, data);
				//不可删除0标记
				if (markIndexOthers > -1 && type == "delete") deleteFlag = false;
				//不可添加0标记
				if (markIndexOthers === -1 && type == "add") addFlag = false;

				//标记 联动 删除、新增、编辑
				if (markIndex == 0 && type) {
					if (markIndexOthers > -1 && type == "delete") this.markData[i].data.splice(markIndexOthers, 1);
					if (markIndexOthers == -1 && type == "add" && data.innerText !== "labelWidth") {
						this.markData[i].data.push(data);
						if (data.innerText == "color") this.deleteColorAngle("color", i, this.markData[i].data.length - 1);
					}
					if (markIndexOthers > -1 && type == "update") this.markData[i].data[markIndexOthers] = { ...data };
				}
			}
			//修改0标记图表类型 同步修改其余标记图表类型；其余图表类型改为相同，同步修改0标记图表类型
			if (markIndex == 0 || chartFlag) {
				this.markData.map((item) => (item.chartType = chartType));
			}
			//删除0标记
			if (deleteFlag && type == "delete") {
				const markIndexOthers = this.markIndexOf(0, data);
				if (markIndexOthers > -1) this.markData[0].data.splice(markIndexOthers, 1);
			}
			//添加0标记
			if (addFlag && type == "add") {
				const markIndexOthers = this.markIndexOf(0, data);
				if (markIndexOthers == -1) {
					this.markData[0].data.push(data);
					if (data.innerText == "color") this.deleteColorAngle("color", 0, this.markData[0].data.length - 1);
				}
			}
		},
		//更新标记数据
		updateMark(newIndex, obj, markIndex) {
			const data = { ...obj };
			if (data.innerText == "color") newIndex = this.deleteColorAngle("color", markIndex, newIndex);
			this.markData[markIndex].data[newIndex] = { ...data };
			this.changeMarks(markIndex, "update", data);
			this.markData = JSON.parse(JSON.stringify(this.markData));
		},
		//标记  重命名
		changeMarkIsEdit(markIndex, index) {
			this.markData[markIndex].data[index].isEdit = true;
			this.markData = JSON.parse(JSON.stringify(this.markData));
		},
		//判断数据是否存在
		markIndexOf(index, data) {
			if (!data) return -1;
			const { nodeId, innerText, columnName } = data;
			// && item.calculatorFunction === calculatorFunction
			return this.markData[index].data.findIndex((item) => item.nodeId == nodeId && item.innerText == innerText && item.columnName == columnName);
		},
		//保证颜色、角度属性的唯一性
		deleteColorAngle(type, markIndex, newIndex) {
			const dataIndex = this.markData[markIndex].data.findIndex((item, index) => item.innerText === type && index !== newIndex);
			if (dataIndex > -1) {
				this.markData[markIndex].data[dataIndex] = { ...this.markData[markIndex].data[newIndex] }; //新颜色赋值给旧颜色
				this.markData[markIndex].data.splice(newIndex, 1); //删除
				newIndex = this.markData[markIndex].data.findIndex((item, index) => item.innerText === type); //索引重新赋值
			}
			return newIndex;
		},

		//删除自定义字段
		deleteFields(row) {
			const { nodeId } = row;
			deleteCustomerFieldReq({ id: nodeId }).then((res) => {
				if (res.code === 200) {
					this.getColumnList(); //重新获取左侧数据
					this.$Msg.success("删除成功！");
				} else {
					this.$Msg.error(`删除失败, ${res.message}`);
				}
			});
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
		submitClick(flag = false) {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					this.btnDistabled = false; //提交按钮不可编辑
					let obj = {
						...this.submitData,
						maxNumber: parseInt(this.submitData.maxNumber),
						markStyle: JSON.stringify(this.markData), //标记
						filterItems: this.filterData, //过滤器
						calcItems: this.rowData.concat(this.columnData), //行、列
					};
					let request = [true, "copy"].includes(this.workbookIsAdd) ? addReq(obj) : modifyReq(obj);
					request.then((res) => {
						if (res.code === 200) {
							this.$Msg.success(`${this.drawerTitle}${this.$t("success")}`);
							this.$parent.pageLoad(); //刷新表格
							//提交按钮10s后才允许点击
							setTimeout(() => {
								this.btnDistabled = true;
							}, 1000 * 10);
							if (flag) this.previewClick(); //跳转至预览界面
							this.cancelClick(); //关闭弹框
						} else {
							this.$Msg.error(`${this.drawerTitle}${this.$t("fail")}${res.message}`);
							this.btnDistabled = true;
						}
					});
				}
			});
		},
		//预览界面跳转
		previewClick() {
			const { id } = this.submitData;
			const href = this.skipUrl("workbookPreview", id);
			window.open(href, "_blank");
		},
		skipUrl(key, id) {
			const obj = {
				workbookPreview: "/bill-design-manage/workbook-preview",
				workbookDesign: "/bill-design-manage/workbook-design",
			};
			const { href } = this.$router.resolve({
				path: obj[key],
				query: { id },
			});
			return href;
		},
		//取消
		cancelClick() {
			this.data = [];
			this.filterData = []; //过滤值
			this.columnData = []; //列值
			this.rowData = []; //行值
			this.markData = [{ name: "全部", chartType: "bar", data: [] }];
			this.selectObj = {};
			this.chartsData = [];
			this.btnDistabled = true;
			this.$emit("update:modelFlag", false);
			this.$refs.submitReq.resetFields(); //清除表单红色提示
		},
		//改变列、行信息的时候 修改标记
		changeRowColumnbyMark() {
			//判断列中是否有指标
			const isColumnNumber = this.columnData.filter((item) => this.numberType(item));
			const columnNumberId = isColumnNumber.map((item) => item.nodeId + this.calculatorObj(item.calculatorFunction, item.columnName));

			//判断行中是否有指标
			const isRowNumber = this.rowData.filter((item) => this.numberType(item));
			const rowNumberId = isRowNumber.map((item) => item.nodeId + this.calculatorObj(item.calculatorFunction, item.columnName));

			const data = isColumnNumber.length ? isColumnNumber : isRowNumber;
			const dataId = isColumnNumber.length ? columnNumberId : rowNumberId;

			//如果标记中有指标数据多余，需要删除。判断依据：当前标记的markId是否存在于列的指标,不存在则删除
			this.markData = this.markData.filter((item) => item.name == "全部" || dataId.includes(item.markId));

			data.forEach((item) => {
				const { calculatorFunction, columnName, nodeId, axis, orderBy } = item;

				const markIds = this.markData.map((item) => item.markId); //标记名称集合
				const name = this.calculatorObj(calculatorFunction, columnName); //当前名称
				const itemId = nodeId + name; //标记唯一id:nodeid+name

				if (!markIds.includes(itemId)) {
					this.markData.push({ ...this.markData[0], name, markId: itemId, stack: `${axis}${orderBy}` });
				} else {
					const index = markIds.findIndex((item) => item === itemId);
					this.markData[index].stack = `${axis}${orderBy}`;
				}
			});
			// this.updateDragData(); //修改拖拽的行列标记
		},
		//当饼图时，行、列不可拖拽样式
		isDisabledCell() {
			return this.markData[0].chartType == "componentPie" ? "disabled-cell" : "";
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
		//cell 样式 数字/字符串
		isNumberCell(item) {
			const numberFunction = ["count", "countDistinct"];
			return item.dataType === "Number" || numberFunction.includes(item.calculatorFunction) ? "drag-number" : "drag-cell";
		},
		//数字类型
		numberType(item) {
			const numberFunction = ["count", "countDistinct"];
			return item.dataType === "Number" || numberFunction.includes(item.calculatorFunction);
		},
		//字符串类型
		stringType(item) {
			const numberFunction = ["count", "countDistinct"];
			return item.dataType !== "Number" || !item.calculatorFunction || !numberFunction.includes(item.calculatorFunction);
		},
	},
};
</script>
<style>
.mark .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
	height: 25px;
	line-height: 25px;
}
.mark .ivu-collapse-header {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: inline-block;
	text-align: left;
}
.rename-input {
	width: calc(100% - 18px) !important;
}
</style>
<style scoped lang="less">
.disabled-cell {
	background: #eaeaea70;
	cursor: no-drop;
}
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
				height: calc(100% - 250px);
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
					height: calc(100% - 250px);
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
			width: calc(100% - 500px);
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
		width: calc(100% - 23px);
		padding: 2px 20px 2px 10px;
		text-align: center;
		background: #4996b2;
		color: #fff;
		border-radius: 10px;
		margin: 4px;
		display: inline-block;
	}
	.drag-number {
		width: calc(100% - 23px);
		padding: 2px 20px 2px 10px;
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
.search-btn {
	border-radius: 0px;
	float: right;
	padding: 0 15px;
	margin-right: 40px;
}

:deep(.ivu-modal-fullscreen .ivu-modal-body) {
	bottom: 35px;
	overflow-y: overlay;
}
:deep(.ivu-modal-header p, .ivu-modal-header-inner) {
	color: #17233d;
}
.desc {
	transform: rotateZ(90deg);
}
.asc {
	transform: rotateZ(270deg);
}
.manual {
	transform: rotateZ(360deg);
}
.preview-btn {
	padding: 5px 16px;
	color: #27ce88;
	border: 1px solid #27ce88;
	border-radius: 0;
}
</style>
