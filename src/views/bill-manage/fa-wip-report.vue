/* FA WIP报表 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Tabs type="card" closable @on-tab-remove="handleTabRemove" v-model="tabName">
				<TabPane label="FA WIP报表" name="tab1" :index="1" v-if="tab1" :closable="false">
					<Card :bordered="false" dis-hover class="card-style">
						<div slot="title">
							<Row>
								<i-col span="6">
									<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="500" trigger="manual" transfer>
										<Button @click.stop="poptipModal = !poptipModal">
											<Icon type="ios-funnel" />
										</Button>
										<div class="poptip-style-content" slot="content">
											<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true">
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
														v-if="poptipModal"
														ref="workOrder"
														class="select-page-style"
														multiple
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
												<!-- 制程 -->
												<FormItem :label="$t('process')" prop="stepName">
													<v-selectpage
														class="select-page-style"
														ref="stepName"
														multiple
														v-if="poptipModal"
														key-field="name"
														show-field="name"
														:data="processPageListUrl"
														v-model="req.stepName"
														:placeholder="$t('pleaseSelect') + $t('process')"
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
												<!-- 线体 -->
												<FormItem :label="$t('line')" prop="lineName">
													<Select
														v-model="req.lineName"
														clearable
														transfer
														filterable
														label-in-value
														multiple
														@on-select="lineSelect"
														:placeholder="`${$t('pleaseSelect')}${$t('line')}`"
													>
														<Option v-for="(item, i) in lineList" :value="item.name" :key="i">{{ item.name }}</Option>
													</Select>
												</FormItem>
												<!-- 机种 -->
												<FormItem :label="$t('model')" prop="modelName">
													<v-selectpage
														class="select-page-style"
														ref="modelName"
														v-if="poptipModal"
														key-field="modelName"
														show-field="modelName"
														:data="modelPageListUrl"
														v-model="req.modelName"
														:placeholder="$t('pleaseSelect') + $t('model')"
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
													<v-selectpage
														class="select-page-style"
														ref="pn"
														v-if="poptipModal"
														key-field="pn"
														show-field="pn"
														:data="pnPageListUrl"
														v-model="req.pn"
														:placeholder="$t('pleaseSelect') + $t('pn')"
														@values="pnSelectChange"
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
											</Form>
											<div class="poptip-style-button">
												<Button @click="resetClick()">{{ $t("reset") }}</Button>
												<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
											</div>
										</div>
									</Poptip>
								</i-col>
								<i-col span="18">
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
							<!-- Fail Quatity -->
							<template slot-scope="{ row }" slot="failsNum">
								<div @click="show(row, 1)" style="color: blue; cursor: pointer">
									{{ row.failsNum }}
								</div>
							</template>
							<!-- WIP -->
							<template slot-scope="{ row }" slot="wipNum">
								<div @click="show(row, 2)" style="color: blue; cursor: pointer">
									{{ row.wipNum }}
								</div>
							</template>
							<!-- 已Check-in数量 -->
							<template slot-scope="{ row }" slot="isCheckIn">
								<div @click="show(row, 3)" style="color: blue; cursor: pointer">
									{{ row.isCheckIn }}
								</div>
							</template>
							<!-- 未Check-in数量 -->
							<template slot-scope="{ row }" slot="notCheckIn">
								<div @click="show(row, 4)" style="color: blue; cursor: pointer">
									{{ row.notCheckIn }}
								</div>
							</template>
							<!-- 已Check-out数量 -->
							<template slot-scope="{ row }" slot="checkOut">
								<div @click="show(row, 5)" style="color: blue; cursor: pointer">
									{{ row.checkOut }}
								</div>
							</template>
						</Table>
					</Card>
				</TabPane>
				<TabPane label="Fail Quality" name="tab2" :index="2" v-if="tab2">
					<FaWipTabTable ref="tab2" />
				</TabPane>
				<TabPane label="WIP" name="tab3" :index="3" v-if="tab3">
					<FaWipTabTable ref="tab3" />
				</TabPane>
				<TabPane label="已Check-in数量" name="tab4" :index="4" v-if="tab4">
					<FaWipTabTable ref="tab4" />
				</TabPane>
				<TabPane label="未Check-in数量" name="tab5" :index="5" v-if="tab5">
					<FaWipTabTable ref="tab5" />
				</TabPane>
				<TabPane label="已Check-out数量" name="tab6" :index="6" v-if="tab6">
					<FaWipTabTable ref="tab6" />
				</TabPane>
			</Tabs>
		</div>
	</div>
</template>

<script>
import { getfawipdistributionReq, exportfawipdistributionReq } from "@/api/bill-manage/fa-wip-report";
import { getButtonBoolean, formatDate, exportFile } from "@/libs/tools";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { pnPageListUrl } from "@/api/basis-info/part-master";
import { modelPageListUrl } from "@/api/basis-info/model-manager";
import { processPageListUrl } from "@/api/basis-info/zone-manage";
import { getAreaFloorLineListReq } from "@/api/basis-info/area-floor";
import FaWipTabTable from "./fa-wip-report/faWipTabTable.vue";
export default {
	name: "fa-wip-report",
	components: { FaWipTabTable },
	data() {
		return {
			tabName: "tab1",
			tab1: true,
			tab2: false,
			tab3: false,
			tab4: false,
			tab5: false,
			tab6: false,
			poptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			workerPageListUrl: workerPageListUrl(),
			pnPageListUrl: pnPageListUrl(),
			modelPageListUrl: modelPageListUrl(),
			processPageListUrl: processPageListUrl(),
			req: {
				startTime: "",
				endTime: "",
				lineName: [],
				modelName: "",
				pn: "",
				workOrder: "",
				stepName: "",
				trackType: "",
				...this.$config.pageConfig,
			}, //查询数据
			columns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "站点", key: "stepName", align: "center", minWidth: 120, tooltip: true },
				{ title: "Fail Quantity", key: "failsNum", align: "center", minWidth: 120, tooltip: true, slot: "failsNum" },
				{ title: "WIP", key: "wipNum", align: "center", minWidth: 140, tooltip: true, slot: "wipNum" },
				{ title: "已Check-in数量", key: "isCheckIn", align: "center", minWidth: 150, tooltip: true, slot: "isCheckIn" },
				{ title: "未Check-in数量", key: "notCheckIn", align: "center", minWidth: 150, tooltip: true, slot: "notCheckIn" },
				{ title: "已Chekc-out数量", key: "checkOut", align: "center", minWidth: 150, tooltip: true, slot: "checkOut" },
			], // 表格数据
			lineList: [],
			searchObj: {},
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		this.getLineList();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.poptipModal = false;
		next();
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			let { startTime, endTime, lineName, modelName, stepName, pn, workOrder } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					this.searchObj = {
						startTime: formatDate(startTime),
						endTime: formatDate(endTime),
						lineName: lineName?.join(","),
						workOrder,
						stepName,
						modelName,
						pn,
					};
					getfawipdistributionReq(this.searchObj)
						.then((res) => {
							this.tableConfig.loading = false;
							if (res.code === 200) {
								this.data = res.result;
								this.poptipModal = false;
							}
						})
						.catch(() => (this.tableConfig.loading = false));
				}
			});
		},
		// 导出
		exportClick() {
			let { startTime, endTime, lineName, modelName, stepName, pn, workOrder } = this.req;
			let obj = {
				startTime: formatDate(startTime),
				endTime: formatDate(endTime),
				workOrder,
				stepName,
				lineName: lineName?.join(","),
				modelName,
				pn,
				trackType: "",
			};
			exportfawipdistributionReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("fa-wip-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		handleTabRemove(name) {
			this[name] = false;
		},
		// 表格单元格点击事件
		show(row, type) {
			let obj = { ...this.searchObj, tracktype: String(type), stepName: row.stepName };
			let index = type + 1;
			this.tabName = "tab" + index;
			this["tab" + index] = true;
			this.$nextTick(() => {
				this.$refs["tab" + index].req.pageIndex = 1;
				this.$refs["tab" + index].queryObj = obj;
				this.$refs["tab" + index].pageLoad(obj);
			});
		},
		// 料号改变触发
		pnSelectChange(data) {
			this.req.pn = data.length ? data[0].pn : "";
		},
		// 获取线体数据
		async getLineList() {
			const obj = {
				category: 4,
				systemFlag: this.$store.state.systemFlag,
				enabled: 1,
			};
			await getAreaFloorLineListReq(obj).then(async (res) => {
				if (res.code === 200) {
					this.lineList = res.result || [];
				}
			});
		},
		// 获取线体数据
		lineSelect(data) {
			this.req.lineName = data.label;
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.searchClick();
			this.$nextTick(() => {
				this.poptipModal = true;
			});
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
			this.poptipModal = false;
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 170 - 60;
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
	},
};
</script>
<style lang="less" scoped>
.img_item {
	width: 30px;
	height: 30px;
	margin-left: 3px;
	cursor: pointer;
}
/deep/.ivu-tabs-bar {
	margin-bottom: 0px;
}
</style>
