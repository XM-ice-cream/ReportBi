<template>
	<div>
		<Table
			size="large"
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
	</div>
</template>
<script>
export default {
	data() {
		return {
			tableConfig: { ...this.$config.tableConfig }, // table配置
			req: {
				...this.$config.pageConfig,
			}, //查询数据
			columns: [
				{
					type: "index",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{
					title: "Name",
					key: "name",
					align: "center",
				},
				{
					title: "Age",
					key: "age",
					align: "center",
				},
				{
					title: "Address",
					key: "address",
					align: "center",
				},
			],
			data: [
				{
					name: "John Brown",
					age: 18,
					address: "New York No. 1 Lake Park",
					date: "2016-10-03",
				},
				{
					name: "Jim Green",
					age: 24,
					address: "London No. 1 Lake Park",
					date: "2016-10-01",
				},
				{
					name: "Joe Black",
					age: 30,
					address: "Sydney No. 1 Lake Park",
					date: "2016-10-02",
				},
				{
					name: "Jon Snow",
					age: 26,
					address: "Ottawa No. 2 Lake Park",
					date: "2016-10-04",
				},
			],
		};
	},
	methods: {
		pageLoad() {
			this.tableConfig.loading = false;
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 120 - 60;
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
	mounted() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
	},
};
</script>
