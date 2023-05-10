/* PreBack报表 */
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
									<Form
										ref="searchReq"
										:model="req"
										:label-width="80"
										:label-colon="true"
										@submit.native.prevent
										@keyup.native.enter="searchClick"
										:rules="ruleValidate"
									>
										<!-- 进制程时间 -->
										<FormItem :label="$t('inProcessTime')" prop="inProcessTime">
											<DatePicker
												transfer
												type="datetime"
												:placeholder="$t('pleaseSelect') + $t('inProcessTime')"
												format="yyyy-MM-dd HH:mm:ss"
												:options="$config.datetimeOptions"
												v-model="req.inProcessTime"
											></DatePicker>
										</FormItem>
										<!-- 离开制程时间 -->
										<FormItem :label="$t('outProcessTime')" prop="outProcessTime">
											<DatePicker
												transfer
												type="datetime"
												:placeholder="$t('pleaseSelect') + $t('outProcessTime')"
												format="yyyy-MM-dd HH:mm:ss"
												:options="$config.datetimeOptions"
												v-model="req.outProcessTime"
											></DatePicker>
										</FormItem>
										<!-- 线体名称 -->
										<FormItem :label="$t('line')" prop="lineName">
											<v-selectpage
												class="select-page-style"
												v-if="searchPoptipModal"
												key-field="name"
												show-field="name"
												:data="linePageListUrl"
												v-model="req.lineName"
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/preback-report";
import { getButtonBoolean, formatDate, exportFile, renderDate } from "@/libs/tools";
import { linePageListUrl } from "@/api/bill-manage/quality-yield-query-report";
export default {
	name: "preback-report",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			linePageListUrl: linePageListUrl(),
			data: [], // 表格数据
			btnData: [],
			req: {
				inProcessTime: "",
				outProcessTime: "",
				lineName: "",
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
				{ title: this.$t("curProcessName"), key: "curprocessName", align: "center", width: "250" },
				{ title: this.$t("inProcessTime"), key: "inProcessTime", align: "center", render: renderDate },
				{ title: this.$t("lineName"), key: "lineName", align: "center" },
				{ title: this.$t("outProcessTime"), key: "outProcessTime", align: "center", render: renderDate },
				{ title: this.$t("panelNo"), key: "panelNo", align: "center" },
				{ title: this.$t("unitId"), key: "unitId", align: "center" },
				{ title: this.$t("workOrder"), key: "workOrder", align: "center" },
			], // 表格数据
			// 验证实体
			ruleValidate: {
				inProcessTime: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}${this.$t("inProcessTime")}`,
					},
				],
				outProcessTime: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}${this.$t("outProcessTime")}`,
					},
				],
				lineName: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}${this.$t("line")}`,
						trigger: "change",
					},
				],
			},
		};
	},
	mounted() {
		this.tableConfig.loading = false;
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
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			let { inProcessTime, outProcessTime, lineName } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					let obj = {
						orderField: "inProcessTime", // 排序字段
						ascending: true, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							inProcessTime: formatDate(inProcessTime),
							outProcessTime: formatDate(outProcessTime),
							lineName,
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
				}
			});
		},
		// 导出
		exportClick() {
			let { inProcessTime, outProcessTime, lineName } = this.req;
			let obj = {
				inProcessTime: formatDate(inProcessTime),
				outProcessTime: formatDate(outProcessTime),
				lineName,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("PreBack")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},

		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
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
