/* 报废入库 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="350" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="60" :label-colon="true" @submit.native.prevent>
										<!-- 工单 -->
										<FormItem :label="$t('workOrder')" prop="workOrder">
											<v-selectpage
												class="select-page-style"
												v-if="searchPoptipModal"
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
										<!-- 线体 -->
										<FormItem :label="$t('line')" prop="lineName">
											<Select v-model="req.lineName" clearable filterable transfer :placeholder="`${$t('pleaseSelect')}${$t('line')}`">
												<Option v-for="(item, i) in lineList" :value="item.name" :key="i">{{ item.name }}</Option>
											</Select>
										</FormItem>
										<!-- 报废时间 -->
										<FormItem :label="$t('scrapDate')" prop="createDate">
											<DatePicker
												transfer
												type="date"
												:placeholder="$t('pleaseSelect') + $t('scrapDate')"
												format="yyyy-MM-dd"
												:options="$config.datetimeOptions"
												v-model="req.createDate"
											></DatePicker>
										</FormItem>
										<!-- 报废时间 -->
										<FormItem :label="$t('freezeDate')" prop="stockDate">
											<DatePicker
												transfer
												type="date"
												:placeholder="$t('pleaseSelect') + $t('freezeDate')"
												format="yyyy-MM-dd"
												:options="$config.datetimeOptions"
												v-model="req.stockDate"
											></DatePicker>
										</FormItem>
										<!-- unitId -->
										<FormItem label="unitId" prop="unitId">
											<Input v-model="req.unitId" :placeholder="$t('pleaseEnter') + 'unitId'" @keyup.enter.native="searchClick" />
										</FormItem>
										<!-- 大半码号 -->
										<FormItem :label="$t('panelNo')" prop="panelNo">
											<Input v-model="req.panelNo" :placeholder="$t('pleaseEnter') + $t('panelNo')" @keyup.enter.native="searchClick" />
										</FormItem>
										<!-- unitId56 -->
										<FormItem label="unitId56" prop="unitId56">
											<Input v-model="req.unitId56" :placeholder="$t('pleaseEnter') + 'unitId56'" @keyup.enter.native="searchClick" />
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/scrap-warehouse";
import { getButtonBoolean, formatDate, exportFile, initTreeList, renderDate, renderState } from "@/libs/tools";
import { getlisttreeauthReq } from "@/api/basis-info/area-floor";
import { workerPageListUrl } from "@/api/material-manager/order-info";

export default {
	name: "scrap-warehouse",
	data() {
		return {
			workerPageListUrl: workerPageListUrl(),
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				workOrder: "", // 工单
				lineName: "", // 线体名称
				unitId: "", // unitId
				unitId56: "", // unitId56
				panelNo: "", // panelNo
				createDate: "", // 报废时间
				stockDate: "", // 入库时间
				...this.$config.pageConfig,
			}, //查询数据
			columns: [
				{
					title: this.$t("sort"),
					type: "index",
					width: 50,
					align: "center",
					fixed: "left",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{
					title: this.$t("workOrder"),
					key: "workOrder",
					width: 140,
					align: "center",
					tooltip: true,
					fixed: "left",
				},
				{ title: this.$t("line"), key: "lineName", width: 200, align: "center" },
				{ title: "unitId", key: "unitId", width: 150, align: "center" },
				{ title: "unitId56", key: "unitId56", minWidth: 150, align: "center", tooltip: true },
				{
					title: this.$t("panelNo"),
					key: "panelNo",
					minWidth: 150,
					align: "center",
					tooltip: true,
				},
				{ title: this.$t("scrapUserName"), key: "createUserName", width: 80, align: "center" },
				{ title: this.$t("scrapDate"), key: "createDate", width: 125, render: renderDate },
				{
					title: this.$t("scrapCause"),
					key: "remark",
					minWidth: 140,
					tooltip: true,
					align: "center",
				},
				{ title: this.$t("freezeDate"), key: "stockDate", width: 125, render: renderDate },
				{
					title: this.$t("currentStatus"),
					key: "isStock",
					width: 120,
					align: "center",
					render: (h, params) => {
						const color = params.row.isStock ? "#ff9900" : "#ccc";
						const name = params.row.isStock ? "入库" : "未入库";
						return renderState(h, color, name);
					},
				},
				{ title: this.$t("daffDay"), key: "daffDay", width: 120, align: "center" },
			], // 表格数据
			lineList: [], // 线体列表
		};
	},
	mounted() {
		this.pageLoad();
	},
	async activated() {
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		await this.getLineList();
		this.req.orderField = "id";
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = true;
			const { workOrder, lineName, createDate, stockDate, unitId, unitId56, panelNo } = this.req;
			let obj = {
				orderField: this.req.orderField, // 排序字段
				ascending: this.req.ascending, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					workOrder, // 工单
					lineName, // 线体名称
					unitId, // unitId
					unitId56,
					panelNo,
					createDate: formatDate(createDate, "yyyy-MM-dd"), // 报废时间
					stockDate: formatDate(stockDate, "yyyy-MM-dd"), // 报废时间
				},
			};
			getpagelistReq(obj)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						this.data = data || [];
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
						this.searchPoptipModal = false;
					}
				})
				.catch(() => (this.tableConfig.loading = false));
		},
		// 获取合计数
		getTotal(item) {
			let total = 0;
			for (let key of Object.keys(item)) {
				if (key.includes("time") && !isNaN(Number(item[key]))) total += Number(item[key]);
			}
			return total;
		},
		// 获取线体数据
		async getLineList() {
			const obj = {
				userId: this.$store.state.id,
				systemFlag: this.$store.state.systemFlag,
			};
			await getlisttreeauthReq(obj).then(async (res) => {
				if (res.code === 200) {
					let data = res.result || [];
					let arr = [];
					await initTreeList(arr, data);
					this.lineList = arr.filter((item) => item.category === 4); //线体
				}
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 导出
		exportClick() {
			const { workOrder, lineName, createDate, stockDate, unitId, unitId56, panelNo } = this.req;
			let obj = {
				workOrder, // 工单
				lineName, // 线体名称
				unitId, // unitId
				unitId56,
				panelNo,
				createDate: formatDate(createDate, "yyyy-MM-dd"), // 报废时间
				stockDate: formatDate(stockDate, "yyyy-MM-dd"), // 报废时间
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("line-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
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
