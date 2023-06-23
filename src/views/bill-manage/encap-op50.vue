/* EnCapOP50报表 */
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
									<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
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
											<Input v-model="req.workOrder" :placeholder="$t('pleaseEnter') + $t('workOrder')" @on-search="searchClick" />
										</FormItem>
										<!-- 大条码 -->
										<FormItem :label="$t('panelNo')" prop="panelNo">
											<Input v-model.trim="req.panelNo" placeholder="请输入大板码号,多个以英文逗号或空格分隔" @on-search="searchClick" />
										</FormItem>
										<!-- 小条码 -->
										<FormItem :label="$t('smallBoardCode')" prop="unitId">
											<Input v-model.trim="req.unitId" :placeholder="$t('pleaseEnter') + $t('smallBoardCode')" @on-search="searchClick" />
										</FormItem>
										<!-- 类别 -->
										<FormItem :label="$t('status')" prop="status">
											<Select v-model="req.status" clearable :placeholder="$t('pleaseSelect') + $t('status')" transfer>
												<Option v-for="(item, i) in categoryList" :value="item.detailName" :key="i">
													{{ item.detailName }}
												</Option>
											</Select>
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/encap-op50";
import { getButtonBoolean, formatDate, exportFile, renderDate } from "@/libs/tools";
import { getlistReq as getDataItemReq } from "@/api/system-manager/data-item";

export default {
	name: "encap-op50",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			categoryList: [], // 类别下拉框
			req: {
				startTime: "",
				endTime: "",
				workOrder: "", //工单
				panelNo: "",
				unitId: "",
				status: "",
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
				{ title: this.$t("workOrder"), key: "workorder", align: "center", width: 140, tooltip: true, fixed: "left" },
				{ title: this.$t("panelNo"), key: "panelno", align: "center", width: 140, tooltip: true },
				{ title: this.$t("smallBoardCode"), key: "unitid", align: "center", width: 140, tooltip: true },
				{ title: this.$t("status"), key: "status", align: "center", width: 90, tooltip: true },
				{ title: this.$t("pn"), key: "pn", align: "center", width: 90, tooltip: true },
				{ title: "BUILDCONFIG", key: "buildconfig", align: "center", width: 120, tooltip: true },
				{ title: this.$t("lineName"), key: "linename", align: "center", width: 120, tooltip: true },
				{ title: this.$t("stepName"), key: "stepname", align: "center", width: 120, tooltip: true },
				{ title: this.$t("defectCode"), key: "defectcode", align: "center", width: 120, tooltip: true },
				{ title: this.$t("defectDate"), key: "defectdate", align: "center", width: 120, tooltip: true },
				{ title: this.$t("badDescription"), key: "description", align: "center", width: 120, tooltip: true },
				{ title: "FailZone", key: "failZone", align: "center", width: 120, tooltip: true },
				{ title: "FailLocation", key: "failLocation", align: "center", width: 120, tooltip: true },
				{ title: "FailValue", key: "failValue", align: "center", width: 120, tooltip: true },
				{ title: this.$t("dispensingEqpCode"), key: "eqp", align: "center", width: 120, tooltip: true },
				{ title: this.$t("dispensingTime"), key: "dispensingTime", align: "center", width: 125, render: renderDate },
				{ title: this.$t("OP50_AOI_ID"), key: "oP50_AOI_ID", align: "center", width: 120, tooltip: true },
				{ title: this.$t("OP45_AOI_ID"), key: "oP45_AOI_ID", align: "center", width: 120, tooltip: true },
				{ title: "OP45_FailValue", key: "oP45_FailValue", align: "center", width: 120, tooltip: true },
				{ title: "MagazineID", key: "magazineID", align: "center", width: 120, tooltip: true },
				{ title: this.$t("carrierID"), key: "carrierID", align: "center", width: 120, tooltip: true },
				{ title: "LayerNo", key: "layerNo", align: "center", width: 120, tooltip: true },
				{ title: "DamChamberID", key: "damChamberID", align: "center", width: 120, tooltip: true },
				{ title: "CuringInTime", key: "curingInTime", align: "center", width: 125, render: renderDate },
				{ title: "CuringOutTime", key: "curingOutTime", align: "center", width: 125, render: renderDate },
			], // 表格数据
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		this.getDataItemData();
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
			let { startTime, endTime, workOrder, panelNo, unitId, status } = this.req;
			if ((startTime && endTime) || workOrder || panelNo || unitId || status) {
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						this.tableConfig.loading = true;
						let obj = {
							orderField: "PN", // 排序字段
							ascending: true, // 是否升序
							pageSize: this.req.pageSize, // 分页大小
							pageIndex: this.req.pageIndex, // 当前页码
							data: {
								startTime: formatDate(startTime),
								endTime: formatDate(endTime),
								workOrder,
								panelNo,
								unitId,
								status,
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
			let { startTime, endTime, workOrder, panelNo, unitId, status } = this.req;
			if ((startTime && endTime) || workOrder || panelNo || unitId || status) {
				let obj = {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					workOrder,
					panelNo,
					unitId,
					status,
				};
				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("encap-op50")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
		},
		// 获取数据字典数据
		getDataItemData() {
			const obj = { itemCode: "EncapReport", enabled: 1 };
			getDataItemReq(obj).then((res) => {
				if (res.code === 200) {
					this.categoryList = res.result || [];
				}
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
