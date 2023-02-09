<template>
	<Card :bordered="false" dis-hover class="card-style">
		<div slot="title">
			<Row>
				<i-col span="24">
					<Button @click="exportClick" type="primary" style="float: right">{{ $t("export") }}</Button>
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
		</Table>
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
</template>

<script>
import { getSummaryReq, exportReq } from "@/api/bill-manage/maverick-info";
import { renderDate } from "@/libs/tools";
import { exportFile, formatDate } from "@/libs/tools";
export default {
	name: "tabTable",
	data() {
		return {
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			queryObj: {},
			req: {
				...this.$config.pageConfig,
			}, //查询数据
			// 模态框表格数据
			columns: [
				{
					type: "index",
					fixed: "left",
					minWidth: 100,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{
					title: "DateCode",
					key: "datecode",
					minWidth: 120,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Model",
					key: "model",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
				},
				{
					title: "Stage",
					key: "stage",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
				},
				{
					title: "StationType Customer",
					key: "stationtypE_CUSTOMER",
					ellipsis: true,
					tooltip: true,
					minWidth: 150,
					align: "center",
				},
				{
					title: "Line",
					key: "line",
					ellipsis: true,
					tooltip: true,
					minWidth: 150,
					align: "center",
				},
				{
					title: "Yield Type",
					key: "yielD_TYPE",
					ellipsis: true,
					tooltip: true,
					width: 100,
					align: "center",
				},
				{
					title: "Yield Target",
					key: "yielD_TARGET",
					ellipsis: true,
					tooltip: true,
					width: 100,
					align: "center",
				},
				{
					title: "Operate type",
					key: "operatE_TYPE",
					ellipsis: true,
					tooltip: true,
					width: 100,
					align: "center",
				},
				{
					title: "yield Goal",
					key: "yielD_GOAL",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "Yield",
					key: "yield",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "Total Sum",
					key: "totaL_SUM",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
				},

				{
					title: "Yield Sum",
					key: "yielD_SUM",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Fail Qty",
					key: "failqty",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "Serial Number",
					key: "seriaL_NUMBER",
					ellipsis: true,
					tooltip: true,
					minWidth: 150,
					align: "center",
				},

				{
					title: "Update Time",
					key: "updatE_TIME",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
					render: renderDate,
				},
				{
					title: "Status",
					key: "status",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Result Date",
					key: "resultdate",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Test Station Code",
					key: "teststationcode",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Failure Symptom",
					key: "failuresymptom",
					minWidth: 250,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Category",
					key: "category",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Location",
					key: "location",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Root Cause",
					key: "rootcause",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Nextdri",
					key: "nextdri",
					minWidth: 100,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Fa Msg",
					key: "fA_MSG",
					minWidth: 100,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Fa Time",
					key: "fA_TIME",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
					render: renderDate,
				},
				{
					title: "Fa Empno",
					key: "fA_EMPNO",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Ca Msg",
					key: "cA_MSG",
					minWidth: 100,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Ca time",
					key: "cA_TIME",
					minWidth: 100,
					ellipsis: true,
					tooltip: true,
					align: "center",
					render: renderDate,
				},
				{
					title: "Ca EmpNo",
					key: "cA_EMPNO",
					minWidth: 100,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Q Mag",
					key: "q_MSG",
					minWidth: 100,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Q Time",
					key: "q_TIME",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
					render: renderDate,
				},
				{
					title: "Q Empno",
					key: "q_EMPNO",
					minWidth: 100,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
			], // 表格数据
		};
	},
	mounted() {
		this.autoSize();
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = true;
			let obj = {
				orderField: "model", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: this.queryObj,
			};
			getSummaryReq(obj)
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
		// 导出
		exportClick() {
			exportReq({ ...this.queryObj }).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("maverick-info")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},

		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 210;
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
