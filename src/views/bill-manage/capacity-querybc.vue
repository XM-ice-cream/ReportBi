/*巴城 产能良率查询 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="12">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">{{ $t("selectQuery") }}</Button>
								<div class="poptip-style-content" slot="content">
									<Form :label-width="70" :label-colon="true" @submit.native.prevent ref="searchReq" :model="req" @keyup.native.enter="searchClick">
										<!-- 起始时间 -->
										<FormItem :label="$t('startTime')" prop="startTime">
											<DatePicker style="width: 50%" transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
											<TimePicker transfer type="time" confirm placeholder="Select time" style="width: 50%" v-model="req.startTime1"></TimePicker>
										</FormItem>
										<!-- 结束时间 -->
										<FormItem :label="$t('endTime')" prop="endTime">
											<DatePicker transfer style="width: 50%" type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
											<TimePicker transfer type="time" confirm placeholder="Select time" style="width: 50%" v-model="req.endTime1"></TimePicker>
										</FormItem>
										<!-- 工单 -->
										<FormItem :label="$t('workOrder')" prop="workOrder">
											<v-selectpage
												ref="workOrder"
												class="select-page-style"
												key-field="workOrder"
												show-field="workOrder"
												v-if="searchPoptipModal"
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
											<Input type="text" v-model="req.pn" @on-keyup.enter="searchClick" />
										</FormItem>
										<!-- 线体 -->
										<FormItem :label="$t('line')" prop="name">
											<Input type="text" v-model="req.name" @on-keyup.enter="searchClick" />
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
				<Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
				<page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />

				<Modal draggable v-model="modalFlag" width="1500" title="工单明细" :styles="{ top: '20px' }">
					<Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loadingModal" :columns="columnsModal" :data="dataModal"></Table>
					<page-custom :total="modalReq.total" :totalPage="modalReq.totalPage" :pageIndex="modalReq.pageIndex" :page-size="modalReq.pageSize" @on-change="pageChangeModal" @on-page-size-change="pageSizeChangeModal" />
				</Modal>
			</Card>
		</div>
	</div>
</template>

<script>
import { getlistReq, getlistReqByType, exportReq } from "@/api/bill-manage/capacity-querybc";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { exportFile, formatDate, getButtonBoolean, renderDate } from "@/libs/tools";

export default {
	name: "capacity-querybc",
	data() {
		return {
			workerPageListUrl: workerPageListUrl(),
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			dataModal: [], // 模态框表格数据
			currentRow: {}, // 当前点击表格行数据
			currentType: "", // 当前点击表格行数据类型
			searchPoptipModal: false,
			btnData: [],
			modalFlag: false,
			req: {
				totalPage: 5,
				pageIndex: 1,
				pageSize: 30,
				total: 50,
				startTime: "",
				startTime1: "",
				endTime: "",
				endTime1: "",
				workOrder: "", //工单
				pn: "", // 料号,
				name: "", // 线体
				...this.$config.pageConfig,
			}, //查询数据
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
					title: this.$t("workOrder"),
					key: "workOrder",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: this.$t("modelName"),
					key: "modelname",
					minWidth: 100,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: this.$t("stationId"),
					key: "processName",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
				},
				{
					title: this.$t("pn"),
					key: "pn",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: this.$t("line"),
					key: "name",
					minWidth: 140,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: this.$t("input_PassQty"),
					key: "inputQty",
					width: 80,
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
										title: params.row.inputQty, //添加title属性
									},
									on: {
										click: () => {
											this.show(params.row, "TRACKIN"); //点击事件
										},
									},
								},
								params.row.inputQty
							),
						]);
					},
				},
				{
					title: this.$t("output_PassQty"),
					key: "outPutQty",
					width: 80,
					align: "center",
					ellipsis: true,
					tooltip: true,
				},
				{
					title: this.$t("HoldQty"),
					key: "holdQty",
					width: 80,
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
										title: params.row.holdQty, //添加title属性
									},
									on: {
										click: () => {
											this.show(params.row, "HOLD"); //点击事件
										},
									},
								},
								params.row.holdQty
							),
						]);
					},
				},
				{
					title: this.$t("DefectQty"),
					key: "defectQty",
					width: 80,
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
										title: params.row.defectQty, //添加title属性
									},
									on: {
										click: () => {
											this.show(params.row, "DEFECT"); //点击事件
										},
									},
								},
								params.row.defectQty
							),
						]);
					},
				},
				{
					title: this.$t("dryBoxQty"),
					key: "dryboxQty",
					width: 80,
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
										title: params.row.dryboxQty, //添加title属性
									},
									on: {
										click: () => {
											this.show(params.row, "DRYBOX"); //点击事件
										},
									},
								},
								params.row.dryboxQty
							),
						]);
					},
				},
				{
					title: this.$t("wip"),
					key: "wip",
					width: 80,
					align: "center",
					ellipsis: true,
					tooltip: true,
				},
				{
					title: this.$t("buildConfig"),
					key: "buildconfig",
					minWidth: 80,
					align: "center",
					ellipsis: true,
					tooltip: true,
				},
				{
					title: "维修前良率",
					key: "firstyielD_RATE",
					width: 80,
					align: "center",
					ellipsis: true,
					tooltip: true,
				},
				{
					title: "维修后良率",
					key: "yield_Rate",
					width: 80,
					align: "center",
					ellipsis: true,
					tooltip: true,
				},
				{
					title: "报废数",
					key: "scrapQty",
					width: 80,
					align: "center",
					ellipsis: true,
					tooltip: true,
				},
				{
					title: this.$t("startTime"),
					key: "startTime",
					width: 150,
					align: "center",
					ellipsis: true,
					tooltip: true,
				},
				{
					title: this.$t("endTime"),
					key: "endTime",
					width: 150,
					align: "center",
					ellipsis: true,
					tooltip: true,
				},
			],
			// 模态框表格数据
			columnsModal: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{
					title: this.$t("workOrder"),
					key: "workorder",
					width: 100,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: this.$t("panel"),
					key: "panel",
					ellipsis: true,
					tooltip: true,
					minWidth: 200,
					align: "center",
				},
				{
					title: this.$t("defectCode"),
					key: "defectcode",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: this.$t("description"),
					key: "description",
					ellipsis: true,
					tooltip: true,
					minWidth: 150,
					align: "center",
				},
				{
					title: this.$t("unitId"),
					key: "unitid",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
				},
				{
					title: this.$t("partId"),
					key: "partid",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
				},
				{
					title: this.$t("lineName"),
					key: "linename",
					ellipsis: true,
					tooltip: true,
					width: 130,
					align: "center",
				},
				{
					title: this.$t("stepName"),
					key: "stepname",
					ellipsis: true,
					tooltip: true,
					width: 90,
					align: "center",
				},
				{
					title: this.$t("eqpId"),
					key: "eqpid",
					ellipsis: true,
					tooltip: true,
					width: 120,
					align: "center",
				},
				{
					title: this.$t("status"),
					key: "status",
					width: 50,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: this.$t("trackTime"),
					key: "tracktime",
					ellipsis: true,
					tooltip: true,
					align: "center",
					width: 150,
					render: renderDate,
				},
				{
					title: this.$t("createUserId"),
					key: "createuserid",
					ellipsis: true,
					tooltip: true,
					align: "center",
					width: 100,
				},
				{
					title: this.$t("config"),
					key: "config",
					width: 80,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
			], // 表格数据
			// 验证实体
			ruleValidate: {
				startTime: [
					{
						required: true,
						type: "date",
						trigger: "change",
						message: this.$t("pleaseSelect") + this.$t("startTime"),
					},
				],
				endTime: [
					{
						required: true,
						type: "date",
						trigger: "change",
						message: this.$t("pleaseSelect") + this.$t("endTime"),
					},
				],
			},
		};
	},
	activated() {
		// this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		this.tableConfig.loading = false; //打开页面后不会有加载动画
	},
	deactivated() {
		this.searchPoptipModal = false;
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					const { workOrder, pn, name, startTime, startTime1, endTime, endTime1 } = this.req;

					const obj = {
						orderField: "WorkOrder",
						ascending: true,
						pageSize: this.req.pageSize,
						pageIndex: this.req.pageIndex,
						data: {
							startTime: formatDate(startTime, "yyyy-MM-dd ") + (startTime1 || "00:00:00"),
							endTime: formatDate(endTime, "yyyy-MM-dd ") + (endTime1 || "23:59:59"),
							workOrder,
							pn,
							name,
						},
					};
					getlistReq(obj)
						.then((res) => {
							this.tableConfig.loading = false;
							if (res.code === 200) {
								//   this.data = res.result || [];
								let { data, pageSize, pageIndex, total, totalPage } = res.result;
								this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
								this.data = data || [];
							}
						})
						.catch(() => (this.tableConfig.loading = false));
				}
			});
		},

		// 表格单元格点击事件
		show(row, type) {
			this.modalFlag = true;
			(this.currentRow = row), // 当前点击表格行数据
				(this.currentType = type), //
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						this.tableConfig.loadingModal = true;
						const { startTime, endTime, workOrder, processName, pn, name } = row;
						const obj = {
							orderField: "unitid", // 排序字段
							ascending: true, // 是否升序
							pageSize: this.modalReq.pageSize, // 分页大小
							pageIndex: this.modalReq.pageIndex, // 当前页码
							data: {
								startTime,
								endTime,
								workOrder,
								stepName: processName,
								trackType: type,
								pn,
								name,
							},
						};
						getlistReqByType(obj)
							.then((res) => {
								this.tableConfig.loadingModal = false;
								if (res.code === 200) {
									this.dataModal = [];
									let data = res.result;
									this.dataModal = data.data ? data.data : [];
									this.modalReq.pageSize = data.pageSize;
									this.modalReq.pageIndex = data.pageIndex;
									this.modalReq.total = data.total;
									this.modalReq.totalPage = data.totalPage;
								}
							})
							.catch(() => (this.tableConfig.loadingModal = false));
					}
				});
		},
		// SN导出
		exportClick() {
			const { workOrder, startTime, startTime1, endTime, endTime1, pn, name } = this.req;
			const obj = {
				workOrder,
				startTime: formatDate(startTime, "yyyy-MM-dd ") + (startTime1 || "00:00:00"),
				endTime: formatDate(endTime, "yyyy-MM-dd ") + (endTime1 || "23:59:59"),
				pn,
				name,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("capacity-queryvr")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
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
		// 选择第几页
		pageChangeModal(index) {
			this.modalReq.pageIndex = index;
			this.show(this.currentRow, this.currentType, false);
		},
		// 选择一页有条数据
		pageSizeChangeModal(index) {
			this.modalReq.pageIndex = 1;
			this.modalReq.pageSize = index;
			this.show(this.currentRow, this.currentType, false);
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.$refs.workOrder.remove();
		},
		// 点击搜索按钮触发
		searchClick() {
			if (this.req.startTime && this.req.endTime) {
				this.searchPoptipModal = false;
			}
			this.req.pageIndex = 1;
			this.pageLoad();
		},
	},
	mounted() {
		//this.pageLoad();
	},
};
</script>
