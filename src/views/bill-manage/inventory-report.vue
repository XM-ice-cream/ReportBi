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
					:border="tableConfig.border"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
				>
					<template slot-scope="{ row }" slot="smT1_Inventory">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="smT1_Borrow">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="smT1_FailQty">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="bE_Inventory">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="bE_Borrow">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="bE_FailQty">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="smT2_Inventory">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="smT2_Borrow">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="smT2_FailQty">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="test_Inventory">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="test_Borrow">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="test_FailQty">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="fvI_Inventory">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="fvI_Borrow">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
					<template slot-scope="{ row }" slot="fvI_FailQty">
						<div @click="show(row, item)" style="color: blue; cursor: pointer">
							{{ row.smT1_Inventory }}
						</div>
					</template>
				</Table>
			</Card>
		</div>
	</div>
</template>

<script>
import { getListReq } from "@/api/bill-manage/inventory-report";
import { formatDate, getButtonBoolean } from "@/libs/tools";

export default {
	name: "inventory-report",
	components: {},
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
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
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
							minWidth: 100,
							align: "center",
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
		handleTabRemove(name) {
			this[name] = false;
		},
		// 表格单元格点击事件
		show(row, cellIndex, type) {
			const { startTime, endTime, station, yielD_TYPE } = this.req;
			const count = type == "OPEN" ? row.open : type == "ONGOING" ? row.ongoing : row.closed;
			let obj = {
				...row,
				triggerstatus: type,
				triggerstatuscount: count,
				startTime: formatDate(startTime),
				endTime: formatDate(endTime),
				station,
				yielD_TYPE,
			};
			let index = cellIndex + 1;
			this.tabName = "tab" + index;
			this["tab" + index] = true;
			this.$nextTick(() => {
				this.$refs["tab" + index].req.pageIndex = 1;
				this.$refs["tab" + index].queryObj = obj;
				this.$refs["tab" + index].pageLoad(obj);
			});
		},
		// 导出
		exportClick() {
			const { triggerid, model, station, line, yielD_TYPE, type, startTime, endTime } = this.req;
			let obj = { triggerid, model, station, line, yielD_TYPE, type, startTime: formatDate(startTime), endTime: formatDate(endTime) };

			const excelName = `MaverickTrigger`;
			getPageListReq(obj).then((res) => {
				if (res.code === 200) {
					let data = res.result || [];
					let titleList = ["序号", "机种", "区段", "制程", "线体", "Yield Type", "Open", "Ongoing", "Close", "Total"]; // 表格表头
					let tableData = [titleList];
					tableData[0][0] = "序号";
					data.map((item, index) => {
						let rowData = [];
						//导出内容的字段
						rowData = [
							index + 1,
							item.model,
							item.stage,
							item.stationtype,
							item.line,
							item.yieldtype,
							item.open,
							item.ongoing,
							item.closed,
							item.total,
						];
						tableData.push(rowData);
					});
					let ws = utils.aoa_to_sheet(tableData);
					let wb = utils.book_new();
					utils.book_append_sheet(wb, ws, excelName); // 工作簿名称
					writeFile(wb, `${excelName}.xlsx`); // 保存的文件名
				}
			});
		},

		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 230;
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
