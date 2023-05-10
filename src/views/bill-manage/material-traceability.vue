/* 物料追溯 */
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
									<Form ref="searchReq" :model="req" :label-width="50" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 工单 -->
										<FormItem :label="$t('workOrder')" prop="workOrder">
											<v-selectpage
												v-if="searchPoptipModal"
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
										<!-- 大条码 -->
										<FormItem :label="$t('bigBarcode')" prop="panel">
											<Input v-model.trim="req.panel" :placeholder="$t('pleaseEnter') + $t('bigBarcode') + $t('multiple,separated')" />
										</FormItem>
										<!-- 小条码 -->
										<FormItem :label="$t('sn')" prop="unitId">
											<Input v-model.trim="req.unitId" :placeholder="$t('pleaseEnter') + $t('sn') + $t('multiple,separated')" />
										</FormItem>
										<!-- REELID -->
										<FormItem :label="$t('REELId')" prop="ReelId">
											<Input v-model.trim="req.ReelId" :placeholder="$t('pleaseEnter') + $t('REELId') + $t('multiple,separated')" />
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
				></Table>
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
	</div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/material-traceability";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { formatDate, getButtonBoolean, exportFile, commaSplitString, renderDate, limitStrLength } from "@/libs/tools";
export default {
	name: "material-traceability",
	data() {
		return {
			workerPageListUrl: workerPageListUrl(),
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				panel: "",
				unitId: "",
				workOrder: "",
				ReelId: "",
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
				{ title: this.$t("boardSerialNumber"), key: "pcbId", width: 110 },
				{ title: this.$t("smallBoardSerialNumber"), key: "unitId", width: 120 },
				{ title: this.$t("plateLocationNo"), key: "boardNo", width: 50 },
				{ title: "ReelId", key: "rid" },
				{ title: "LotCode", key: "lotCode", width: 120 },
				{ title: "DataCode", key: "dateCode", width: 80 },
				{ title: this.$t("pn"), key: "pn", width: 120 },
				{ title: this.$t("footPosition"), key: "refdes", width: 60 },
				{ title: this.$t("time"), key: "timeStamp", width: 125, render: renderDate },
			], // 表格数据
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		//点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
			this.searchPoptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			let { panel, unitId, workOrder, ReelId } = this.req;
			if (panel || unitId || workOrder || ReelId) {
				if (limitStrLength(panel) || limitStrLength(unitId)) {
					this.$Msg.error("查询条件超出最大长度2000!");
					this.searchPoptipModal = true;
					return;
				}
				if (limitStrLength(ReelId, 3)) {
					this.$Msg.error("ReelId查询条件超出最大长度3!");
					this.searchPoptipModal = true;
					return;
				}
				this.tableConfig.loading = true;
				let obj = {
					orderField: "PCBID", // 排序字段
					ascending: true, // 是否升序
					pageSize: this.req.pageSize, // 分页大小
					pageIndex: this.req.pageIndex, // 当前页码
					data: {
						panel: commaSplitString(panel).join(),
						unitId: commaSplitString(unitId).join(),
						workOrder,
						ReelId: commaSplitString(ReelId).join(),
					},
				};
				getpagelistReq(obj)
					.then((res) => {
						this.tableConfig.loading = false;
						if (res.code === 200) {
							let { data, pageSize, pageIndex, total, totalPage } = res.result;
							this.data = data || [];
							this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
						}
					})
					.catch(() => (this.tableConfig.loading = false));
				this.searchPoptipModal = false;
			} else {
				this.$Msg.warning(this.$t("pleaseEnter") + this.$t("selectQuery"));
			}
		},
		// 导出
		exportClick() {
			let { panel, unitId, workOrder, ReelId } = this.req;
			if (panel || unitId || workOrder || ReelId) {
				if (limitStrLength(panel) || limitStrLength(unitId)) {
					this.$Msg.error("查询条件超出最大长度2000!");
					return;
				}
				if (limitStrLength(ReelId, 3)) {
					this.$Msg.error("ReelId查询条件超出最大长度3!");
					return;
				}
				const obj = {
					panel: commaSplitString(this.req.panel).join(),
					unitId: commaSplitString(this.req.unitId).join(),
					workOrder: this.req.workOrder,
					ReelId: commaSplitString(this.req.ReelId).join(),
				};

				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("material-traceability")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning(this.$t("pleaseEnter") + this.$t("selectQuery"));
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
			this.tableConfig.height = document.body.clientHeight - 120 - 60;
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
