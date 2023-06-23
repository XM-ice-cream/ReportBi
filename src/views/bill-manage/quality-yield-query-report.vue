/* 产能良率查询 */
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
													<Input
														v-model.trim="req.workOrder"
														:placeholder="$t('pleaseEnter') + $t('workOrder') + $t('multiple,separated')"
														@on-keyup.enter="searchClick"
													/>
												</FormItem>
												<!-- unitId -->
												<FormItem :label="$t('unitId')" prop="unitid">
													<Input
														v-model.trim="req.unitid"
														:placeholder="$t('pleaseEnter') + $t('unitId') + $t('multiple,separated')"
														@on-keyup.enter="searchClick"
													/>
												</FormItem>
												<!-- BuildType -->
												<FormItem label="BuildType" prop="buildtype">
													<Input v-model.trim="req.buildtype" @on-keyup.enter="searchClick" :placeholder="$t('pleaseEnter') + 'BuildType'" />
												</FormItem>
												<!-- config -->
												<FormItem :label="$t('config')" prop="config">
													<v-selectpage
														class="select-page-style"
														ref="config"
														v-if="searchPoptipModal"
														key-field="name"
														show-field="name"
														:data="configPageListUrl"
														v-model="req.config"
														:placeholder="$t('pleaseEnter') + $t('config')"
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
												<!-- 料号 -->
												<FormItem :label="$t('pn')" prop="pn">
													<Input type="text" v-model="req.pn" @on-keyup.enter="searchClick" :placeholder="$t('pleaseEnter') + $t('pn')" />
												</FormItem>
												<!-- 线体 -->
												<FormItem :label="$t('line')" prop="linename">
													<v-selectpage
														class="select-page-style"
														multiple
														v-if="searchPoptipModal"
														key-field="name"
														show-field="name"
														:data="linePageListUrl"
														v-model="req.linename"
														:placeholder="$t('pleaseEnter') + $t('line')"
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
												<!-- 小线体 -->
												<FormItem label="小线体" prop="subline">
													<Input type="text" v-model="req.subline" @on-keyup.enter="searchClick" :placeholder="$t('pleaseEnter') + '小线体'" />
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
									<button-custom
										:btnData="btnData"
										@on-removeCirc-click="removeCircClick"
										@on-retainCirc-click="retainCircClick"
										@on-export-click="exportClick"
									></button-custom>
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
							<template slot-scope="{ row }" slot="inputQty">
								<div @click="show(row, 1)" style="color: blue; cursor: pointer">
									{{ row.inputs }}
								</div>
							</template>
							<!-- 一次检查pass -->
							<template slot-scope="{ row }" slot="firstpass">
								<div @click="show(row, 2)" style="color: blue; cursor: pointer">
									{{ row.firstpass }}
								</div>
							</template>
							<!-- 重测通过 -->
							<template slot-scope="{ row }" slot="retest">
								<div @click="show(row, 3)" style="color: blue; cursor: pointer">
									{{ row.retest }}
								</div>
							</template>
							<!-- 所有不良 -->
							<template slot-scope="{ row }" slot="defect">
								<div @click="show(row, 4)" style="color: blue; cursor: pointer">
									{{ row.defect }}
								</div>
							</template>
							<!--  最终不良 -->
							<template slot-scope="{ row }" slot="defectnow">
								<div @click="show(row, 5)" style="color: blue; cursor: pointer">
									{{ row.defectnow }}
								</div>
							</template>
							<!-- 产出 -->
							<template slot-scope="{ row }" slot="outputs">
								<div @click="show(row, 6)" style="color: blue; cursor: pointer">
									{{ row.outputs }}
								</div>
							</template>
							<!-- 一次通过率 -->
							<template slot-scope="{ row }" slot="firstrate">
								<div>{{ (row.firstrate * 100).toFixed(2) }}%</div>
							</template>
							<!-- 重测通过率 -->
							<template slot-scope="{ row }" slot="rerate">
								<div>{{ (row.rerate * 100).toFixed(2) }}%</div>
							</template>
							<!-- 良率 -->
							<template slot-scope="{ row }" slot="yieldrate">
								<div>{{ (row.yieldrate * 100).toFixed(2) }}%</div>
							</template>
							<!-- 良率 -->
							<template slot-scope="{ row }" slot="ngrate">
								<div>{{ (row.ngrate * 100).toFixed(2) }}%</div>
							</template>
						</Table>
					</Card>
				</TabPane>
				<TabPane label="投入数" name="tab2" :index="2" v-if="tab2">
					<TabTable ref="tab2" />
				</TabPane>
				<TabPane label="一次检测通过" name="tab3" :index="3" v-if="tab3">
					<TabTable ref="tab3" />
				</TabPane>
				<TabPane label="重测pass" name="tab4" :index="4" v-if="tab4">
					<TabTable ref="tab4" />
				</TabPane>
				<TabPane label="所有不良" name="tab5" :index="5" v-if="tab5">
					<TabTable ref="tab5" />
				</TabPane>
				<TabPane label="最终不良" name="tab6" :index="6" v-if="tab6">
					<TabTable ref="tab6" />
				</TabPane>
				<TabPane label="产出" name="tab7" :index="7" v-if="tab7">
					<TabTable ref="tab7" />
				</TabPane>
				<!-- <TabKanban /> -->
			</Tabs>
		</div>
	</div>
</template>

<script>
import { getlistReq, trackOutExportReq, configPageListUrl, linePageListUrl } from "@/api/bill-manage/quality-yield-query-report";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { formatDate, getButtonBoolean, commaSplitString } from "@/libs/tools";
import TabTable from "./quality-yield-query-report/tabTable.vue";
import { exportFile } from "@/libs/tools";

export default {
	components: { TabTable },
	name: "quality-yield-query-report",
	data() {
		return {
			configPageListUrl: configPageListUrl(),
			linePageListUrl: linePageListUrl(),
			tabName: "tab1",
			tab1: true,
			tab2: false,
			tab3: false,
			tab4: false,
			tab5: false,
			tab6: false,
			tab7: false,
			tab8: true,
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
				pn: "", // 料号,
				linename: "", // 线体
				subline: "",
				buildtype: "", //段别
				unitid: "", //unidId
				config: "",
				removeCirc: "N", //去除/保留维修回流产品
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
					title: this.$t("stepName"),
					key: "stepname",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
				},
				{
					title: this.$t("input_PassQty"),
					minWidth: 80,
					align: "center",
					slot: "inputQty",
				},
				{
					title: "一次检测通过",
					minWidth: 80,
					align: "center",
					slot: "firstpass",
				},
				{
					title: "重测pass",
					minWidth: 80,
					align: "center",
					slot: "retest",
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
					title: "产出",
					minWidth: 80,
					align: "center",
					slot: "outputs",
				},
				{
					title: "一次良率",
					slot: "firstrate",
					minWidth: 80,
					align: "center",
				},
				{
					title: "重测通过率",
					slot: "rerate",
					minWidth: 80,
					align: "center",
				},
				{
					title: "最终良率",
					slot: "yieldrate",
					minWidth: 80,
					align: "center",
					ellipsis: true,
					tooltip: true,
				},
			],
		};
	},
	activated() {
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
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
			const { workOrder, pn, linename, subline, buildtype, config, startTime, endTime, unitid, removeCirc } = this.req;
			if (workOrder || pn || linename || subline || buildtype || config || startTime || endTime || unitid) {
				this.tableConfig.loading = true;
				this.searchObj = {
					starttime: formatDate(startTime),
					endtime: formatDate(endTime),
					workorder: commaSplitString(workOrder).join(),
					pn,
					linename: linename ? linename.split(",") : [],
					subline,
					buildtype,
					config,
					unitid,
					removeCirc,
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
			} else {
				this.$Msg.warning("请完善查询条件");
			}
		},
		// 导出
		exportClick() {
			const { workOrder, pn, linename, subline, buildtype, config, startTime, endTime, unitid, removeCirc } = this.req;
			if (workOrder || pn || linename || subline || buildtype || config || startTime || endTime || unitid) {
				const obj = {
					starttime: formatDate(startTime),
					endtime: formatDate(endTime),
					workorder: commaSplitString(workOrder).join(),
					pn,
					linename: linename ? linename.split(",") : [],
					subline,
					buildtype,
					config,
					unitid,
					removeCirc,
				};
				trackOutExportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("quality-yield-query-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning("请完善查询条件");
			}
		},
		// 表格单元格点击事件
		show(row, type) {
			let obj = { ...this.searchObj, tracktype: String(type), stepname: row.stepname };
			let index = type + 1;
			this.tabName = "tab" + index;
			this["tab" + index] = true;
			this.$nextTick(() => {
				this.$refs["tab" + index].req.pageIndex = 1;
				this.$refs["tab" + index].queryObj = obj;
				this.$refs["tab" + index].pageLoad(obj);
			});
		},
		// 点击切换:去除维修回流产品
		removeCircClick() {
			// if(this.req.removeCirc == "N" || this.req.removeCirc == "")
			// {
			//   this.req.removeCirc = "Y";
			// }
			// else
			// {
			//   this.req.removeCirc = "N";
			// }
			this.req.removeCirc = "Y";
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 点击切换:保留维修回流产品
		retainCircClick() {
			this.req.removeCirc = "N";
			this.req.pageIndex = 1;
			this.pageLoad();
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
