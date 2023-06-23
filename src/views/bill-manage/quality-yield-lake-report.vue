/*淀山湖质量 查询 报表 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Tabs type="card" closable @on-tab-remove="handleTabRemove" v-model="tabName">
				<TabPane label="质量良率" name="tab1" :index="1" v-if="tab1" :closable="false">
					<Card :bordered="false" dis-hover class="card-style">
						<div slot="title">
							<Row>
								<i-col span="12">
									<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
										<Button @click.stop="searchPoptipModal = !searchPoptipModal">
											<Icon type="ios-funnel" />
										</Button>
										<div class="poptip-style-content" slot="content">
											<Form :label-width="70" @submit.native.prevent ref="searchReq" :model="req" @keyup.native.enter="searchClick">
												<!-- 流程名称 -->
												<FormItem label="流程名称" prop="routeName">
													<Select v-model="req.routeName">
														<Option v-for="(item, i) in kRouteNameList" :value="item.detailName" :key="i">
															{{ item.detailName }}
														</Option>
													</Select>
												</FormItem>
												<!-- 起始时间 -->
												<FormItem :label="$t('startTime')" prop="startTime">
													<DatePicker
														transfer
														type="datetime"
														:placeholder="$t('pleaseSelect') + $t('startTime')"
														format="yyyy-MM-dd HH:mm:ss"
														:options="$config.datetimeOptions"
														v-model="req.startTime"
													></DatePicker>
												</FormItem>
												<!-- 结束时间 -->
												<FormItem :label="$t('endTime')" prop="endTime">
													<DatePicker
														transfer
														type="datetime"
														:placeholder="$t('pleaseSelect') + $t('endTime')"
														format="yyyy-MM-dd HH:mm:ss"
														:options="$config.datetimeOptions"
														v-model="req.endTime"
													></DatePicker>
												</FormItem>
												<!-- 工单 -->
												<FormItem :label="$t('workOrder')" prop="workOrder">
													<v-selectpage
														v-if="searchPoptipModal"
														ref="workOrder"
														class="select-page-style"
														key-field="workOrder"
														show-field="workOrder"
														:data="workerPageListUrl"
														v-model="req.workOrder"
														:placeholder="$t('pleaseSelect') + $t('workOrder')"
														:result-format="
															(res) => {
																return {
																	totalRow: res.total,
																	list: res.data || [],
																};
															}
														"
													>
													</v-selectpage>
												</FormItem>
												<!-- 站点 -->
												<FormItem :label="$t('stepName')">
													<Input type="text" v-model="req.stepName" placeholder="请输入站点"></Input>
												</FormItem>
											</Form>
											<div class="poptip-style-button">
												<Button @click="resetClick">{{ $t("reset") }}</Button>
												<Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
											</div>
										</div>
									</Poptip>
								</i-col>
								<i-col span="12">
									<button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
								</i-col>
							</Row>
						</div>
						<Table
							:border="tableConfig.border"
							:highlight-row="tableConfig.highlightRow"
							:height="tableConfig.height"
							:loading="tableConfig.loading"
							:columns="columns"
							:data="data"
						>
							<!-- 投入 -->
							<template slot-scope="{ row }" slot="inputs">
								<div @click="show(row, 1, 'input')" style="color: blue; cursor: pointer">
									{{ row.inputs }}
								</div>
							</template>
							<!-- 产出 -->
							<template slot-scope="{ row }" slot="outputs">
								<div @click="show(row, 2, 'output')" style="color: blue; cursor: pointer">
									{{ row.outputs }}
								</div>
							</template>
							<!-- 首次Pass -->
							<template slot-scope="{ row }" slot="firstpass">
								<div @click="show(row, 3, 'firstoutput')" style="color: blue; cursor: pointer">
									{{ row.firstpass }}
								</div>
							</template>
							<!--所有不良-->
							<template slot-scope="{ row }" slot="defect">
								<div @click="show(row, 4, 'alldefect')" style="color: blue; cursor: pointer">
									{{ row.defect }}
								</div>
							</template>
							<!-- 最终不良 -->
							<template slot-scope="{ row }" slot="defectnow">
								<div @click="show(row, 5, 'lastdefect')" style="color: blue; cursor: pointer">
									{{ row.defectnow }}
								</div>
							</template>
							<!-- 一次良率 -->
							<template slot-scope="{ row }" slot="firstrate">
								<div>{{ (row.firstrate * 100).toFixed(2) }}%</div>
							</template>
							<!-- 重测良率 -->
							<template slot-scope="{ row }" slot="rerate">
								<div>{{ (row.rerate * 100).toFixed(2) }}%</div>
							</template>
							<!-- 最终良率 -->
							<template slot-scope="{ row }" slot="yieldrate">
								<div>{{ (row.yieldrate * 100).toFixed(2) }}%</div>
							</template>
						</Table>
					</Card>
				</TabPane>
				<TabPane label="投入" name="tab2" :index="2" v-if="tab2">
					<TabTable ref="tab2" />
				</TabPane>
				<TabPane label="产出" name="tab3" :index="3" v-if="tab3">
					<TabTable ref="tab3" />
				</TabPane>
				<TabPane label="首次Pass" name="tab4" :index="4" v-if="tab4">
					<TabTable ref="tab4" />
				</TabPane>
				<TabPane label="所有不良" name="tab5" :index="5" v-if="tab5">
					<TabTable ref="tab5" />
				</TabPane>
				<TabPane label="最终不良" name="tab6" :index="6" v-if="tab6">
					<TabTable ref="tab6" />
				</TabPane>
			</Tabs>
		</div>
	</div>
</template>

<script>
import { getlistReq, trackOutExportReq } from "@/api/bill-manage/quality-yield-lake-report";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { formatDate, getButtonBoolean } from "@/libs/tools"; //commaSplitString
import TabTable from "./quality-yield-lake-report/tabTable.vue";
import { exportFile } from "@/libs/tools";
import { getlistReq as dataItemList } from "@/api/system-manager/data-item";

export default {
	components: { TabTable },
	name: "quality-yield-lake-report",
	data() {
		return {
			tabName: "tab1",
			tab1: true,
			tab2: false,
			tab3: false,
			tab4: false,
			tab5: false,
			tab6: false,
			workerPageListUrl: workerPageListUrl(),
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			dataModal: [], // 模态框表格数据
			currentRow: {}, // 当前点击表格行数据
			currentType: "", // 当前点击表格行数据类型
			searchPoptipModal: false,
			btnData: [],
			req: {
				startTime: "",
				endTime: "",
				workOrder: "", //工单
				routeName: "", //流程名称
				stepName: "", //站点
				type: "", //类型
				...this.$config.pageConfig,
			}, //查询数据
			searchObj: {},
			modalReq: {
				...this.$config.pageConfig,
			},
			columns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return row._index + 1;
					},
				},
				{
					title: "流程名称",
					key: "routeName",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "站点名称",
					key: "stepname",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "投入",
					minWidth: 80,
					align: "center",
					slot: "inputs",
				},
				{
					title: "产出",
					minWidth: 80,
					align: "center",
					slot: "outputs",
				},
				{
					title: "WIP",
					key: "wip",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "首次Pass",
					minWidth: 80,
					align: "center",
					slot: "firstpass",
				},
				{
					title: "重测pass",
					key: "retest",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "所有不良",
					minWidth: 80,
					align: "center",
					slot: "defect",
				},
				{
					title: "最终不良",
					minWidth: 80,
					align: "center",
					slot: "defectnow",
				},
				{
					title: "一次良率",
					slot: "firstrate",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "重测良率",
					slot: "rerate",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "最终良率",
					slot: "yieldrate",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
			],
			kRouteNameList: [], //流程名称下拉
		};
	},
	activated() {
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		//获取数据字典数据
		this.getDataItemData();
	},
	deactivated() {
		this.searchPoptipModal = false;
	},
	methods: {
		handleTabRemove(name) {
			this[name] = false;
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			const { workOrder, stepName, startTime, endTime, type, routeName } = this.req;
			this.tableConfig.loading = true;
			this.searchObj = {
				startDate: formatDate(startTime),
				endDate: formatDate(endTime),
				workorder: workOrder, //commaSplitString(workOrder).join()
				stepName,
				type,
				routeName,
			};
			getlistReq(this.searchObj)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						this.data = res.result || [];
						this.searchPoptipModal = false;
					}
				})
				.catch(() => (this.tableConfig.loading = false));
		},
		// 导出
		exportClick() {
			const { workOrder, stepName, startTime, endTime, type, routeName } = this.req;
			const obj = {
				startDate: formatDate(startTime),
				endDate: formatDate(endTime),
				workorder: workOrder, //commaSplitString(workOrder).join(),
				stepName,
				type,
				routeName,
			};
			trackOutExportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("quality-yield-lake-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		// 表格单元格点击事件
		show(row, index, type) {
			let obj = { ...this.searchObj, type: type, routeName: row.routeName, stepName: row.stepname };
			let tabindex = index + 1;
			this.tabName = "tab" + tabindex;
			this["tab" + tabindex] = true;
			this.$nextTick(() => {
				this.$refs["tab" + tabindex].req.pageIndex = 1;
				this.$refs["tab" + tabindex].queryObj = obj;
				this.$refs["tab" + tabindex].pageLoad(obj);
			});
		},
		// 获取数据字典数据
		async getDataItemData() {
			this.kRouteNameList = await this.getDataItemDetailList("K_RouteName");
		},
		async getDataItemDetailList(itemCode) {
			let arr = [];
			await dataItemList({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 180;
		},
		// 选择第几页
		pageChange(index) {
			this.req.pageIndex = index;
			this.pageLoad();
		},
		// 选择一页有条数据
		pageSizeChange(index) {
			this.req.pageIndex = 1;
			this.req.pageSize = index;
			this.pageLoad();
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.$refs.workOrder.remove();
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
	},
	mounted() {
		this.pageLoad();
	},
};
</script>
<style lang="less" scoped>
/deep/ .ivu-tabs-nav-container {
	line-height: 2;
}
/deep/ .ivu-tabs-bar {
	margin-bottom: 0;
}
</style>
