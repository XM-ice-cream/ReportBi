/**Inventory 报表 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
									{{ $t("selectQuery") }}
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 工单 -->
										<FormItem label="工单" prop="workOrder">
											<Input v-model.trim="req.workOrder" clearabled :placeholder="$t('pleaseEnter') + '工单'" />
										</FormItem>
										<!-- Config -->
										<FormItem label="Config" prop="buildconfig">
											<Input v-model.trim="req.buildconfig" clearabled :placeholder="$t('pleaseEnter') + 'Config'" />
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
					:border="true"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
				>
					<template slot-scope="{ row }" slot="smT1_Inventory">
						<div @click="show(row, 'smT1_Inventory')" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="smT1_Borrow">
						<div @click="show(row, 'smT1_Borrow')" style="color: blue; cursor: pointer">
							{{ row.smT1_Borrow }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="smT1_FailQty">
						<div @click="show(row, 'smT1_FailQty')" style="color: blue; cursor: pointer">
							{{ row.smT1_FailQty }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="bE_Inventory">
						<div @click="show(row, 'bE_Inventory')" style="color: blue; cursor: pointer">
							{{ row.bE_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="bE_Borrow">
						<div @click="show(row, 'bE_Borrow')" style="color: blue; cursor: pointer">
							{{ row.bE_Borrow }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="bE_FailQty">
						<div @click="show(row, 'bE_FailQty')" style="color: blue; cursor: pointer">
							{{ row.bE_FailQty }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="smT2_Inventory">
						<div @click="show(row, 'smT2_Inventory')" style="color: blue; cursor: pointer">
							{{ row.smT2_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="smT2_Borrow">
						<div @click="show(row, 'smT2_Borrow')" style="color: blue; cursor: pointer">
							{{ row.smT2_Borrow }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="smT2_FailQty">
						<div @click="show(row, 'smT2_FailQty')" style="color: blue; cursor: pointer">
							{{ row.smT2_FailQty }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="test_Inventory">
						<div @click="show(row, 'test_Inventory')" style="color: blue; cursor: pointer">
							{{ row.test_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="test_Borrow">
						<div @click="show(row, 'test_Borrow')" style="color: blue; cursor: pointer">
							{{ row.test_Borrow }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="test_FailQty">
						<div @click="show(row, 'test_FailQty')" style="color: blue; cursor: pointer">
							{{ row.test_FailQty }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="fvI_Inventory">
						<div @click="show(row, 'fvI_Inventory')" style="color: blue; cursor: pointer">
							{{ row.fvI_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="fvI_Borrow">
						<div @click="show(row, 'fvI_Borrow')" style="color: blue; cursor: pointer">
							{{ row.fvI_Borrow }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="fvI_FailQty">
						<div @click="show(row, 'fvI_FailQty')" style="color: blue; cursor: pointer">
							{{ row.fvI_FailQty }}
						</div>
					</template>
				</Table>
			</Card>

			<InventoryTable ref="Inventory" />
			<BorrowTable ref="Borrow" />
			<FailqtyTable ref="FailQty" />
		</div>
	</div>
</template>

<script>
import { getListReq, downloadReq } from "@/api/bill-manage/inventory-report";
import { formatDate, getButtonBoolean, renderDate, exportFile } from "@/libs/tools";
import InventoryTable from "./inventory-report/inventoryTable.vue";
import BorrowTable from "./inventory-report/borrowTable.vue";
import FailqtyTable from "./inventory-report/failqtyTable.vue";

export default {
	name: "inventory-report",
	components: { InventoryTable, BorrowTable, FailqtyTable },
	data() {
		return {
			searchPoptipModal: false,
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],

			req: {
				workOrder: "",
				buildconfig: "",
				...this.$config.pageConfig,
			}, //查询数据
			// 模态框表格数据
			columns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
				},
				{
					title: "Maintain Function",
					align: "center",
					children: [
						{
							title: "机种",
							key: "modelname",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "工单",
							key: "workorder",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Config",
							key: "buildconfig",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
					],
				},
				{
					title: "EPM",
					align: "center",
					children: [
						{
							title: "投产总数",
							key: "inputqty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "每笔投产数量",
							key: "qty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
					],
				},
				{
					title: "SMT1",
					align: "center",
					children: [
						{
							title: "工程领板",
							slot: "smT1_Inventory",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "工程借板",
							slot: "smT1_Borrow",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Fail Qty",
							slot: "smT1_FailQty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Good Qty",
							key: "smT1_GoodQty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
					],
				},
				{
					title: "BE",
					align: "center",
					children: [
						{
							title: "工程领板",
							slot: "bE_Inventory",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "工程借板",
							slot: "bE_Borrow",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Fail Qty",
							slot: "bE_FailQty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Good Qty",
							key: "bE_GoodQty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
					],
				},
				{
					title: "SMT2",
					align: "center",
					children: [
						{
							title: "工程领板",
							slot: "smT2_Inventory",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "工程借板",
							slot: "smT2_Borrow",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Fail Qty",
							slot: "smT2_FailQty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Good Qty",
							key: "smT2_GoodQty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
					],
				},
				{
					title: "SMT2 -> 2F",
					align: "center",
					children: [
						{
							title: "1楼转2楼时间",
							key: "f1_TO_F2TIME",
							ellipsis: true,
							tooltip: true,
							minWidth: 150,
							align: "center",
							render: renderDate,
						},
						{
							title: "1楼转2楼 Qty",
							key: "f1_TO_F2QTY",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
					],
				},
				{
					title: "Testing",
					align: "center",
					children: [
						{
							title: "Input Qty",
							key: "testInputQTY",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "工程领板",
							slot: "test_Inventory",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "工程借板",
							slot: "test_Borrow",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Fail Qty",
							slot: "test_FailQty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Good Qty",
							key: "test_GoodQty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
					],
				},
				{
					title: "FVI",
					align: "center",
					children: [
						{
							title: "工程领板",
							slot: "fvI_Inventory",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "工程借板",
							slot: "fvI_Borrow",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Fail Qty",
							slot: "fvI_FailQty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
						{
							title: "Good Qty",
							key: "fvI_GoodQty",
							ellipsis: true,
							tooltip: true,
							minWidth: 100,
							align: "center",
						},
					],
				},
			], // 表格数据
		};
	},
	mounted() {
		this.tableConfig.loading = false;
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
			this.pageLoad();
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					const { workOrder, buildconfig } = this.req;
					if (workOrder || buildconfig) {
						this.tableConfig.loading = true;
						let obj = { workOrder, buildconfig };
						getListReq(obj)
							.then((res) => {
								this.tableConfig.loading = false;
								if (res.code === 200) {
									this.data = res.result || [];
								}
							})
							.catch(() => (this.tableConfig.loading = false))
							.finally(() => {
								this.searchPoptipModal = false;
							});
					} else {
						this.$Msg.warning("至少要有一个查询条件！");
					}
				}
			});
		},
		// 表格单元格点击事件
		show(row, type) {
			const { workorder } = row;
			const refsName = type.split("_")[1];
			let obj = {
				workorder,
				type: type.toUpperCase(),
			};
			this.$nextTick(() => {
				this.$refs[refsName].modalFlag = true;
				this.$refs[refsName].pageLoad(obj);
			});
		},
		// 导出
		exportClick() {
			downloadReq({ ...this.req }).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("inventory-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
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
	},
};
</script>
