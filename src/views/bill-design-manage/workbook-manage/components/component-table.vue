<!-- 文本 -->
<template>
	<div id="tableChart" class="charts" ref="textchart"></div>
</template>
<script>
export default {
	name: "componentTable",
	props: {
		chartData: Object,
	},
	data() {
		return {};
	},

	methods: {
		pageLoad() {
			console.log(this.chartData);
			let tableObj = {};
			const { column, row, mark, value } = this.chartData;
			//获取标签文本字段
			const markField = this.getLableField(mark)[0]?.orderBy || null;
			console.log(this.getLableField(mark));
			//行列数据重组
			// 1.获取所有的行、列
			const rowArr = row.map((item) => `${item.axis}${item.orderBy}`);
			const columnArr = column.map((item) => `${item.axis}${item.orderBy}`);
			const rowColumnArr = row.concat(column).map((item) => `${item.axis}${item.orderBy}`);
			//2.重新修改值
			value.forEach((item) => {
				let name = "";
				rowColumnArr.forEach((arrItem) => {
					name += item[arrItem];
				});
				tableObj[name] = markField ? item[`z${markField}`] : "Abc";
			});
			console.log(tableObj);
			//3.绘画表格
			let tableHtmlArr = [];
			//渲染列的值
			columnArr.forEach((cItem) => {
				tableHtml += "<tr>";
				value.forEach((item) => {
					tableHtml += `<th>${item[cItem]}</th>`;
				});
				tableHtml += "</tr>";
			});
			//渲染行及对应的值
			value.forEach((item) => {
				tableHtml += "<tr>";
				rowArr.forEach((rItem) => {
					tableHtml += `<th>${item[rItem]}</th>`;
				});
				tableHtml += "</tr>";
			});
		},
		//获取标签显示字段
		getLableField(mark) {
			return mark[0].data.filter((item) => item.innerText === "mark");
		},
	},
	mounted() {
		// this.$nextTick(() => {
		// 	this.pageLoad();
		// });
	},
};
</script>
<style lang="less" scoped>
.charts {
	height: 100%;
	width: 100%;
}
</style>
