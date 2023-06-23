/* 包装查询 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="12">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="500" trigger="manual" transfer>
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
											<Input v-model="req.workOrder" :placeholder="$t('pleaseEnter') + $t('workOrder')" @on-search="pageLoad" />
										</FormItem>
										<!-- 产品序号 -->
										<FormItem :label="$t('product') + $t('sort')" prop="unitId">
											<Input
												v-model="req.unitId"
												:placeholder="$t('pleaseEnter') + $t('product') + $t('sort') + $t('multiple,separated')"
												@on-search="pageLoad"
											/>
										</FormItem>
										<!-- 大板码 -->
										<FormItem :label="$t('panelNo')" prop="panelNo">
											<Input
												v-model="req.panelNo"
												:placeholder="$t('pleaseEnter') + $t('panelNo') + $t('multiple,separated')"
												@on-search="pageLoad"
											/>
										</FormItem>
										<!-- BoxNo -->
										<FormItem label="BoxNo" prop="boxNo">
											<Input v-model="req.boxNo" :placeholder="$t('pleaseEnter') + 'BoxNo' + $t('multiple,separated')" @on-search="pageLoad" />
										</FormItem>
										<!-- CartonNO -->
										<FormItem label="CartonNO" prop="cartonNo">
											<Input v-model="req.cartonNo" :placeholder="$t('pleaseEnter') + 'CartonNO' + $t('multiple,separated')" @on-search="pageLoad" />
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
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
import { getlistReq } from "@/api/bill-manage/packagewight-report";
import { getButtonBoolean, formatDate, exportFile, renderDate, commaSplitString } from "@/libs/tools";
export default {
	name: "packagewight-query",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				startTime: "",
				endTime: "",
				workOrder: "", //工单
				unitId: "", //产品序号
				panelNo: "", //	大板码
				boxNo: "", //	BoxNo
				cartonNo: "", //	CartonNO
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
				{
					title: this.$t("workOrder"),
					key: "workOrder",
					align: "center",
					width: 110,
					tooltip: true,
				},
				{ title: "BoxNo", key: "boxno", align: "center", width: 160, tooltip: true },
				{ title: "CartonNo", key: "cartonNo", align: "center", width: 160, tooltip: true },
				{ title: "PanelNo", key: "panelNo", align: "center", tooltip: true, width: 160 },
				{ title: "SN", key: "unitId", align: "center", width: 140, tooltip: true },
				{ title: "unitId56", key: "unitId56", align: "center", minWidth: 200, tooltip: true },
				{ title: "Line", key: "lineName", align: "center", width: 110, tooltip: true },
				{ title: this.$t("stepName"), key: "curprocessName", align: "center", width: 100, tooltip: true },
				{ title: "DataKey", key: "dataKey", align: "center", width: 100, tooltip: true },
				{ title: "DataType", key: "dataType", align: "center", width: 100, tooltip: true },
				{ title: "重量", key: "value", align: "center", width: 60, tooltip: true },
				{ title: "称重时间", key: "createDate", align: "center", width: 130, tooltip: true, render: renderDate },
				{ title: this.$t("createUser"), key: "createUserName", align: "center", width: 70, tooltip: true },
			], // 表格数据
		};
	},
	mounted() {
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
			let { startTime, endTime, workOrder, unitId, panelNo, boxNo, cartonNo } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					let obj = {
						orderField: "unitId", // 排序字段
						ascending: true, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							startTime: formatDate(startTime),
							endTime: formatDate(endTime),
							workOrder, //工单
							unitId: commaSplitString(unitId).join(), //产品序号
							panelNo: commaSplitString(panelNo).join(), //	大板码
							boxNo: commaSplitString(boxNo).join(), //	BoxNo
							cartonNo: commaSplitString(cartonNo).join(), //	CartonNO
						},
					};
					getlistReq(obj)
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
