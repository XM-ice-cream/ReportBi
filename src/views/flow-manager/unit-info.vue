<template>
	<!-- 流程卡 -->
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="400">
						<Button @click.stop="poptipModal = !poptipModal">
							<Icon type="ios-funnel" />
						</Button>
						<div class="poptip-style-content" slot="content">
							<Form :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
								<FormItem :label="$t('workOrder')" prop="workOrder">
									<Input v-model="req.workOrder" :placeholder="$t('pleaseEnter') + $t('workOrder')" />
								</FormItem>
								<FormItem :label="$t('palletNo')" prop="palletNo">
									<Input v-model="req.palletNo" :placeholder="$t('pleaseEnter') + $t('palletNo')" />
								</FormItem>
								<FormItem :label="$t('cartonNo')" prop="cartonNo">
									<Input v-model="req.cartonNo" :placeholder="$t('pleaseEnter') + $t('cartonNo')" />
								</FormItem>
								<FormItem :label="$t('boxNo')" prop="boxNo">
									<Input v-model="req.boxNo" :placeholder="$t('pleaseEnter') + $t('boxNo')" />
								</FormItem>
								<FormItem :label="$t('panel')" prop="panel">
									<Input v-model="req.panelNo" :placeholder="$t('pleaseEnter') + $t('panel')" />
								</FormItem>
								<FormItem :label="$t('sn')" prop="sn">
									<Input v-model="req.unitId" :placeholder="$t('pleaseEnter') + $t('sn')" />
								</FormItem>
								<div class="poptip-style-button">
									<Button @click="resetClick">{{ $t("reset") }}</Button>
									<Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
								</div>
							</Form>
						</div>
					</Poptip>
				</div>
				<Table
					:border="tableConfig.border"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
					@on-current-change="currentClick"
					@on-sort-change="sortChange"
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
import { getpagelistReq } from "@/api/flow-manager/bind-real-barCode";
import { renderDate, renderState } from "@/libs/tools";

export default {
	name: "unit-info",
	data() {
		return {
			poptipModal: false,
			tableConfig: { ...this.$config.tableConfig }, // table配置
			selectObj: null, // 表格选中数据
			data: [], // 表格数据
			btnData: [],
			columns: [
				{
					type: "index",
					width: 50,
					align: "center",
					fixed: "left",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: this.$t("workOrder"), key: "workOrder", sortable: "custom", fixed: "left", width: 120, tooltip: true },
				{ title: this.$t("sortNumber"), key: "unitId", width: 160, resizable: true },
				{ title: this.$t("partId"), key: "partName", width: 140, resizable: true },
				{ title: this.$t("flow"), key: "routeName", width: 120, resizable: true },
				{
					title: this.$t("currentStatus"),
					key: "currentStatus",
					width: 100,
					resizable: true,
					render: (h, params) => {
						let color = params.row.currentStatus === "Pass" ? "#19be6b" : "#ff9900";
						return renderState(h, color, params.row.currentStatus);
					},
				},
				{ title: this.$t("pdlineId"), key: "lineName", width: 140, tooltip: true, resizable: true },
				{ title: "PanelNo", key: "panelNo", width: 160, resizable: true },
				{ title: this.$t("ruleName"), key: "ruleName", width: 80, resizable: true },
				{ title: this.$t("curProcessName"), key: "curProcessName", width: 200, resizable: true },
				{ title: this.$t("nextProcessName"), key: "nextProcessName", width: 200, resizable: true },
				{ title: this.$t("inPdLineTime"), key: "inPdLineTime", width: 125, render: renderDate },
				{ title: this.$t("inProcessTime"), key: "inProcessTime", width: 125, render: renderDate },
				{ title: this.$t("createUser"), key: "createUserName", width: 80 },
				{ title: this.$t("createDate"), key: "createDate", width: 125, render: renderDate },
				{ title: this.$t("palletNo"), key: "palletNo", width: 70 },
				{ title: this.$t("cartonNo"), key: "cartonNo", width: 70 },
				{ title: this.$t("boxNo"), key: "boxNo", width: 70 },
			], // 表格数据
			req: {
				workOrder: "", //工单
				palletNo: "", //栈板号
				cartonNo: "", //箱号
				boxNo: "", //彩盒号
				unitId: "", //序号
				panelNo: "", //大板序号
				enabled: -1, //是否有效
				...this.$config.pageConfig,
			}, //查询数据
		};
	},
	mounted() {
		this.req.orderField = "id";
		this.pageLoad();
	},
	activated() {
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = true;
			const { workOrder, palletNo, cartonNo, boxNo, unitId, panelNo, enabled } = this.req;
			const obj = {
				orderField: this.req.orderField, // 排序字段
				ascending: this.req.ascending, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: { workOrder, palletNo, cartonNo, boxNo, unitId, panelNo, enabled },
				isFuzzyKey: ["workOrder", "palletNo", "cartonNo", "boxNo", "unitId", "panelNo"],
			};
			getpagelistReq(obj)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
						this.data = data || [];
					}
				})
				.catch(() => (this.tableConfig.loading = false));
		},
		// 点击重置按钮触发
		resetClick() {
			this.req.palletNo = "";
			this.req.cartonNo = "";
			this.req.boxNo = "";
			this.req.unitId = "";
			this.req.panelNo = "";
		},
		// 点击搜索按钮触发
		searchClick() {
			this.selectObj = null;
			this.req.pageIndex = 1;
			this.pageLoad();
			this.poptipModal = false;
		},
		// 自动改变表格高度
		autoSize() {
			let height = document.body.clientHeight - 120;
			this.tableConfig.height = height - 60;
		},
		// 某一行高亮时触发
		currentClick(currentRow) {
			this.selectObj = currentRow;
		},
		// 排序时有效，当点击排序时触发
		sortChange(data) {
			this.req.orderField = data.key.toUpperCase();
			this.req.ascending = data.order === "asc";
			this.pageLoad();
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
