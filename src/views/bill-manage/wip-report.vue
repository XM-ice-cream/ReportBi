/* WIP报表 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 工单 -->
										<FormItem :label="$t('workOrder')" prop="workOrder">
											<v-selectpage
												ref="workOrder"
												class="select-page-style"
												v-if="searchPoptipModal"
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
										<!-- 料号 -->
										<FormItem :label="$t('pn')" prop="pn">
											<Input v-model.trim="req.pn" placeholder="请输入料号,多个以英文逗号分隔" @on-search="searchClick" />
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
				</Table>
				<page-custom
					:elapsedMilliseconds="req.elapsedMilliseconds"
					:total="req.total"
					:totalPage="req.totalPage"
					:pageIndex="req.pageIndex"
					:page-size="req.pageSize"
					@on-change="pageChange"
					@on-page-size-change="pageSizeChange"
				/>
			</Card>
		</div>
		<wip-report-modal :isShow.sync="isShow" :paramData="wipJson" />
	</div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/wip-report";
import { getButtonBoolean, formatDate, exportFile, renderDate } from "@/libs/tools";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import wipReportModal from "./wip-report/wip-report-modal.vue";

export default {
	components: { wipReportModal },
	name: "wip-report",
	data() {
		return {
			workerPageListUrl: workerPageListUrl(),
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				workOrder: "", //工单
				pn: "",
				...this.$config.pageConfig,
			}, //查询数据
			columns: [], // 表格数据
			isShow: false,
			wipJson: {},
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize);
		getButtonBoolean(this, this.btnData);
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			// 表格数据
			this.columns = [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: this.$t("workOrder"), key: "workorder", fixed: "left", align: "center", minWidth: 140, tooltip: true },
				{ title: this.$t("pn"), key: "pn", align: "center", minWidth: 120, tooltip: true },
				{ title: this.$t("modelName"), key: "modelname", align: "center", minWidth: 140, tooltip: true },
				{ title: this.$t("customerModel"), key: "customerno", align: "center", minWidth: 90, tooltip: true },
				{ title: this.$t("workOrderInfo"), key: "workordeR_INFO", align: "center", minWidth: 140, tooltip: true },
				{ title: this.$t("createDate"), key: "createdate", align: "center", render: renderDate, minWidth: 140, tooltip: true },
				{ title: this.$t("scheduleEndDate"), key: "scheduleenddate", align: "center", render: renderDate, minWidth: 140, tooltip: true },
				{ title: this.$t("moday"), key: "moday", align: "center", minWidth: 80, tooltip: true },
				{ title: this.$t("workOrderQTY"), key: "qty", align: "center", minWidth: 80, tooltip: true },
				{ title: this.$t("inputQTY"), key: "inputqty", align: "center", minWidth: 80, tooltip: true },
				{ title: this.$t("finishQTY"), key: "finishqty", align: "center", minWidth: 80, tooltip: true },
				{ title: this.$t("wipQTY"), key: "wipQTY", align: "center", minWidth: 80, tooltip: true },
				{
					title: "其他工站Wip数",
					key: "otherStation",
					minWidth: 120,
					align: "center",
					ellipsis: true,
					tooltip: true,
					render: (h, params) => {
						return h("div", [
							h(
								"a",
								{
									props: {
										type: "primary",
										size: "small",
									},
									style: {
										marginRight: "5px",
										color: "blue",
										fontSize: "13px",
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										display: "block", //设置样式，超过文字省略号显示
										cursor: "pointer", //设置鼠标样式
									},
									domProps: {
										title: params.row.otherStation, //添加title属性
									},
									on: {
										click: () => {
											this.show(params.row, "OtherStation"); //点击事件
										},
									},
								},
								params.row.otherStation
							),
						]);
					},
				},
			];
			this.tableConfig.loading = false;
			let { workOrder, pn } = this.req;
			if (workOrder || pn) {
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						this.tableConfig.loading = true;
						let obj = {
							orderField: "PN", // 排序字段
							ascending: true, // 是否升序
							pageSize: this.req.pageSize, // 分页大小
							pageIndex: this.req.pageIndex, // 当前页码
							data: {
								workOrder: workOrder.toString(), //工单
								pn,
							},
						};
						getpagelistReq(obj)
							.then((res) => {
								this.tableConfig.loading = false;
								if (res.code === 200) {
									let { data, pageSize, pageIndex, total, totalPage } = res.result;
									this.data =
										data.map((element, index) => {
											element.processWipList.forEach((item) => {
												if (index == 0)
													this.columns.push({
														title: item.processname,
														key: item.processname,
														align: "center",
														width: 100,
														tooltip: true,
														render: (h, params) => {
															return h("div", [
																h(
																	"a",
																	{
																		props: {
																			type: "primary",
																			size: "small",
																		},
																		style: {
																			marginRight: "5px",
																			color: "blue",
																			fontSize: "13px",
																			overflow: "hidden",
																			textOverflow: "ellipsis",
																			whiteSpace: "nowrap",
																			display: "block", //设置样式，超过文字省略号显示
																			cursor: "pointer", //设置鼠标样式
																		},
																		domProps: {
																			title: params.row[item.processname], //添加title属性
																		},
																		on: {
																			click: () => {
																				this.show(params.row, item.processname); //点击事件
																			},
																		},
																	},
																	params.row[item.processname]
																),
															]);
														},
													});
												element[item.processname] = item.productQTY;
											});
											return { ...element };
										}) || [];
									this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
								}
							})
							.catch(() => (this.tableConfig.loading = false));
						this.searchPoptipModal = false;
					}
				});
			} else {
				this.$Msg.warning("至少有一个查询条件!");
			}
		},
		show(row, processname) {
			this.isShow = true;
			this.wipJson = { workorder: row.workorder, processname: processname };
			//   this.$refs.wipmodal.pageLoad(row.workorder, processname);
		},
		// 导出
		exportClick() {
			let { workOrder, pn } = this.req;
			if (workOrder || pn) {
				let obj = {
					workOrder: workOrder.toString(), //工单
					pn,
				};
				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("wip-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning("至少有一个查询条件!");
			}
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.searchPoptipModal = false;
			this.$nextTick(() => {
				this.searchPoptipModal = true;
			});
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
