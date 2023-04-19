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
import { getSummaryReq } from "@/api/bill-manage/maverick-trigger";
import { utils, writeFile } from "xlsx"; // 注意处理方法引入方式
import { renderDate, formatDate } from "@/libs/tools";

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
					title: "TriggerId",
					key: "triggerid",
					minWidth: 120,
					ellipsis: true,
					tooltip: true,
					align: "center",
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
					title: "机种",
					key: "model",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
				},
				{
					title: "区段",
					key: "stage",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
				},
				{
					title: "制程",
					key: "stationtype",
					ellipsis: true,
					tooltip: true,
					minWidth: 150,
					align: "center",
				},
				{
					title: "线体",
					key: "line",
					ellipsis: true,
					tooltip: true,
					minWidth: 150,
					align: "center",
				},
				{
					title: "良率类型",
					key: "yieldtype",
					ellipsis: true,
					tooltip: true,
					width: 100,
					align: "center",
				},
				{
					title: "良率目标",
					key: "yieldtarget",
					ellipsis: true,
					tooltip: true,
					width: 100,
					align: "center",
				},
				{
					title: "操作区间",
					key: "operatetype",
					ellipsis: true,
					tooltip: true,
					width: 100,
					align: "center",
				},
				{
					title: "良率 Goal",
					key: "yieldgoal",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "良率",
					key: "yield",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},

				{
					title: "投入数",
					key: "inputqty",
					minWidth: 150,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Pass数",
					key: "passqty",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "Fail数",
					key: "failqty",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "SN",
					key: "sn",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "状态",
					key: "status",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "更新时间",
					key: "updatE_TIME",
					ellipsis: true,
					tooltip: true,
					minWidth: 150,
					align: "center",
					render: renderDate,
				},
				{
					title: "不良时间",
					key: "resultdate",
					ellipsis: true,
					tooltip: true,
					minWidth: 150,
					align: "center",
					render: renderDate,
				},
				{
					title: "不良站点",
					key: "teststationcode",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "FailureSymptom",
					key: "failuresymptom",
					ellipsis: true,
					tooltip: true,
					minWidth: 170,
					align: "center",
				},
				{
					title: "Category",
					key: "category",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "Location",
					key: "location",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "RootCause",
					key: "rootcause",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "NextDRI",
					key: "nextdri",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "FA MSG",
					key: "fA_MSG",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "FA TIME",
					key: "fA_TIME",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
					render: renderDate,
				},
				{
					title: "FA EMPNO",
					key: "fA_EMPNO",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "CA MSG",
					key: "cA_MSG",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "CA TIME",
					key: "cA_TIME",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
					render: renderDate,
				},
				{
					title: "CA EMPNO",
					key: "cA_EMPNO",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "Q MSG",
					key: "q_MSG",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "Q TIME",
					key: "q_TIME",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
					render: renderDate,
				},
				{
					title: "Q EMPNO",
					key: "q_EMPNO",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
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
				orderField: "triggerid", // 排序字段
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
			let obj = {
				orderField: "triggerid", // 排序字段
				ascending: true, // 是否升序
				pageSize: 10000, // 分页大小
				pageIndex: 1, // 当前页码
				data: this.queryObj,
			};
			const excelName = `MaverickTrigger-${this.queryObj.triggerstatus}`;
			getSummaryReq(obj).then((res) => {
				if (res.code === 200) {
					let data = res.result.data;
					let titleList = [
						"序号",
						"TriggerId",
						"DateCode",
						"机种",
						"区段",
						"制程",
						"线体",
						"良率类型",
						"良率目标",
						"操作区间",
						"良率Goal",
						"良率",
						"投入数",
						"Pass数",
						"Fail数",
						"SN",
						"状态",
						"更新时间",
						"不良时间",
						"不良站点",
						"FailureSymptom",
						"Category",
						"Location",
						"RootCause",
						"NextDRI",
						"FA MSG",
						"FA TIME",
						"FA EMPNO",
						"CA MSG",
						"CA TIME",
						"CA EMPNO",
						"Q MSG",
						"Q TIME",
						"Q EMPNO",
					]; // 表格表头
					let tableData = [titleList];
					tableData[0][0] = "序号";
					data.map((item, index) => {
						let rowData = [];
						//导出内容的字段
						rowData = [
							index + 1,
							item.triggerid,
							item.datecode,
							item.model,
							item.stage,
							item.stationtype,
							item.line,
							item.yieldtype,
							item.yieldtarget,
							item.operatetype,
							item.yieldgoal,
							item.yield,
							item.inputqty,
							item.passqty,
							item.failqty,
							item.sn,
							item.status,
							formatDate(item.updatE_TIME),
							formatDate(item.resultdate),
							item.teststationcode,
							item.failuresymptom,
							item.category,
							item.location,
							item.rootcause,
							item.nextdri,
							item.fA_MSG,
							formatDate(item.fA_TIME),
							item.fA_EMPNO,
							item.cA_MSG,
							formatDate(item.cA_TIME),
							item.cA_EMPNO,
							item.q_MSG,
							formatDate(item.q_TIME),
							item.q_EMPNO,
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
			this.tableConfig.height = document.body.clientHeight - 210 - 20;
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
