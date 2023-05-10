/* OQCShipping报表 */
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
												ref="workOrder"
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
										<!-- 大条码 -->
										<FormItem :label="$t('panelNo')" prop="panelNo">
											<Input v-model.trim="req.panelNo" :placeholder="$t('pleaseEnter') + $t('panelNo')" @on-search="searchClick" />
										</FormItem>
										<!-- 小条码 -->
										<FormItem :label="$t('smallBoardCode')" prop="unitId">
											<Input v-model.trim="req.unitId" :placeholder="$t('pleaseEnter') + $t('smallBoardCode')" @on-search="searchClick" />
										</FormItem>
										<!-- 56位小条码 -->
										<FormItem :label="$t('smallBoardCode56')" prop="unitId56">
											<Input v-model.trim="req.unitId56" :placeholder="$t('pleaseEnter') + $t('smallBoardCode56')" @on-search="searchClick" />
										</FormItem>
										<!-- config -->
										<FormItem :label="$t('config')" prop="config">
											<Input v-model.trim="req.config" placeholder="请输入config" @on-search="searchClick" />
										</FormItem>
										<!-- 彩盒数 -->
										<FormItem :label="$t('cartonCode')" prop="cartonno">
											<Input v-model.trim="req.cartonno" :placeholder="$t('pleaseEnter') + $t('cartonCode')" @on-search="searchClick" />
										</FormItem>
										<!-- 出货单号 -->
										<FormItem :label="$t('shipmentNo')" prop="shipmentNO">
											<Input v-model.trim="req.shipmentNO" :placeholder="$t('pleaseEnter') + $t('shipmentNo')" @on-search="searchClick" />
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/oqc-shipping";
import { getButtonBoolean, formatDate, exportFile, renderDate } from "@/libs/tools";
import { workerPageListUrl } from "@/api/material-manager/order-info";

export default {
	name: "oqc-shipping",
	data() {
		return {
			workerPageListUrl: workerPageListUrl(),
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				startTime: "",
				endTime: "",
				workOrder: "", //工单
				panelNo: "",
				unitId: "",
				unitId56: "",
				config: "",
				cartonno: "",
				shipmentNO: "",
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
				{ title: this.$t("shipDate"), key: "shipdate", align: "center", render: renderDate, width: 140, tooltip: true },
				{ title: this.$t("shipmentNo"), key: "shipmentno", align: "center", width: 120, tooltip: true },
				{ title: this.$t("shipAddress"), key: "shipaddress", align: "center", width: 140, tooltip: true },
				{ title: this.$t("apn"), key: "apn", align: "center", width: 120, tooltip: true },
				{ title: this.$t("config"), key: "config", align: "center", width: 90, tooltip: true },
				{ title: this.$t("boxNo"), key: "boxno", align: "center", width: 160, tooltip: true },
				{ title: this.$t("cartonCode"), key: "cartonno", align: "center", width: 160, tooltip: true },
				{ title: this.$t("panelNo"), key: "panelno", align: "center", width: 120, tooltip: true },
				{ title: this.$t("smallBoardCode56"), key: "unitiD56", align: "center", width: 150, tooltip: true },
				{ title: this.$t("shippingGrade"), key: "shippinggrade", align: "center", width: 100, tooltip: true },
				{ title: "OP60", key: "oP60", align: "center", width: 100, tooltip: true },
				{ title: "ON/OFF", key: "onoff", align: "center", width: 100, tooltip: true },
				{ title: "OP60", key: "fos", align: "center", width: 100, tooltip: true },
				{ title: "MURA", key: "mura", align: "center", width: 100, tooltip: true },
				{ title: "I16", key: "i16", align: "center", width: 100, tooltip: true },
				{ title: "FVI", key: "fvi", align: "center", width: 100, tooltip: true },
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
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			let { startTime, endTime, workOrder, panelNo, unitId, unitId56, config, cartonno, shipmentNO } = this.req;
			if (startTime && endTime) {
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						this.tableConfig.loading = true;
						let obj = {
							orderField: "panelno", // 排序字段
							ascending: true, // 是否升序
							pageSize: this.req.pageSize, // 分页大小
							pageIndex: this.req.pageIndex, // 当前页码
							data: {
								startTime: formatDate(startTime),
								endTime: formatDate(endTime),
								workOrder,
								panelNo,
								unitId,
								unitId56,
								config,
								cartonno,
								shipmentNO,
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
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
		},
		// 导出
		exportClick() {
			let { startTime, endTime, workOrder, panelNo, unitId, unitId56, config, cartonno, shipmentNO } = this.req;
			if (startTime && endTime) {
				let obj = {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					workOrder,
					panelNo,
					unitId,
					unitId56,
					config,
					cartonno,
					shipmentNO,
				};
				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("oqc-shipping")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
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
