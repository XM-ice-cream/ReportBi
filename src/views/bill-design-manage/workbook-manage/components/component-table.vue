t
<!-- 文本 -->
<template>
	<div id="tableChart" class="charts component-table" ref="tablechart"></div>
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
			const { column, row, mark, value, renameObj } = this.chartData;
			//获取标签文本字段
			const markField = this.getLableField(mark)[0]?.orderBy || null;
			//行列数据重组
			// 1.获取所有的行、列
			const rowArr = row.map((item) => `${item.axis}${item.orderBy}`);
			const columnArr = column.map((item) => `${item.axis}${item.orderBy}`);
			const columnName = columnArr.map((item) => renameObj[item]).join(" / "); //拖拽字段 列名称 以斜杠拼接 显示

			//获取所有的行/列
			let rowInfo = [];
			let columnInfo = [];

			value.map((item) => {
				let rowName = rowArr.map((rItem) => item[rItem]).toString();
				let columnName = columnArr.map((cItem) => item[cItem]).toString();
				//去重
				rowInfo = [...new Set([...rowInfo, rowName])];
				columnInfo = [...new Set([...columnInfo, columnName])];
			});

			const rowTemp = rowInfo[0].split(",");
			const columnTemp = columnInfo[0].split(",");
			//创建值的二维数组
			let valueInfo = [];
			value.forEach((item) => {
				let rowName = rowArr.map((rItem) => item[rItem]);
				let columnName = columnArr.map((cItem) => item[cItem]);

				//定位 值 在第几行
				const rowIndex = rowInfo.indexOf(rowName.toString());
				if (!valueInfo[rowIndex]) valueInfo[rowIndex] = rowName; //如果该数组不存在,则将标题行信息赋为初始值valueInfo[rowIndex] =[1,2,3]
				//定位 值 在第几列 [需要加上标题行的列数]
				const columnIndex = columnInfo.indexOf(columnName.toString()) + rowName.length;

				valueInfo[rowIndex][columnIndex] = { ...item, actual: markField ? item[`z${markField}`] : "Abc" };
			});
			//创建表格 并渲染列名称
			let tablHtml = `<table id='myTable'>
         <tr>
          <th colspan='${rowTemp.length}'></th>
          <th colspan='${columnInfo.length}' class='title'>
            ${columnName}
          </th>
        </tr>`;

			// 渲染行名称和列名称对应的具体值
			tablHtml += columnTemp
				.map((item, index) => {
					let tableHtmlTemp = "";
					//每一列的最后一行 要有 下边框
					const borderBottom = index === columnTemp.length - 1 ? "class='borderBottom'" : "";
					tableHtmlTemp += `<tr ${borderBottom}>`;

					//渲染行名称及列名称左边空白的地方
					tableHtmlTemp += rowTemp
						.map((ritem, rindex) => {
							let htmlTemp = "";
							//如果列名称是最后一列,则填充 拖拽的行名称
							if (index === columnTemp.length - 1) htmlTemp = `<th class='title'>${renameObj["x" + `${rindex}`]}</th>`;
							else {
								//渲染列的第一单元格时,需要填充colspan为行名称的长度
								if (rindex === 0) htmlTemp = `<th colspan='${rowTemp.length}'></th>`;
								//其余的列名称前面 行名称上面的 内容用hidden-cell 填充,目的是 全程实际行列数保持一致
								else htmlTemp += `<th  class='hidden-cell'></th>`;
							}

							return htmlTemp;
						})
						.join("");

					//渲染列名称对应的详细信息
					tableHtmlTemp += columnInfo
						.map((citem) => {
							const columnItem = citem.split(",")[index] || "";
							return `<th>${columnItem}</th>`;
						})
						.join("");

					tableHtmlTemp += "</tr>";
					return tableHtmlTemp;
				})
				.join("");

			//渲染行/值  [必须要用for循环,要不然值为empty的无法循环]
			for (let i = 0; i < valueInfo.length; i++) {
				const rowItem = valueInfo[i];
				tablHtml += `<tr style='${i % 2 ? "background:#f5f5f5" : ""}'>`; //间隔显示行背景色
				for (let j = 0; j < rowItem.length; j++) {
					const columnItem = rowItem[j];
					//获取悬浮提示信息
					const title =
						columnItem?.actual &&
						Object.keys(columnItem)
							.filter((item) => item !== "actual")
							.map((item) => `${renameObj[item]}: ${columnItem[item]}`)
							.join("\n");
					//实际列值填充
					tablHtml += `<td title='${title || ""}'>${columnItem?.actual || columnItem || ""}</td>`;
				}
				//获取总列数减去实际列数的差值,填充差值td
				const diff = columnInfo.length + rowTemp.length - rowItem.length;
				if (diff > 0) {
					for (let m = 0; m < diff; m++) {
						tablHtml += `<td></td>`;
					}
				}
				tablHtml += "</tr>";
			}

			tablHtml += "</table>";
			this.$refs.tablechart.innerHTML = tablHtml;
			this.$nextTick(() => {
				this.mergeTable(rowTemp.length, columnTemp);
			});
		},
		//获取标签显示字段
		getLableField(mark) {
			return mark[0].data.filter((item) => item.innerText === "mark");
		},
		//合并单元格
		mergeTable(rowTempLength, columns) {
			const table = document.getElementById("myTable");
			const rows = table.getElementsByTagName("tr");
			//合并列
			for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
				const row = rows[rowIndex]; //当前行
				const toprow = rowIndex ? rows[rowIndex - 1] : ""; //前一行

				const cols = row.getElementsByTagName("th"); //当前列
				const topCols = toprow ? toprow.getElementsByTagName("th") : ""; //前一行的当前列

				let prevCell = null;
				let cellSpan = 1;
				for (let colIndex = 0; colIndex < cols.length; colIndex++) {
					const cell = cols[colIndex];
					const topcell = topCols ? topCols[colIndex] : "";
					//为了上一行的当前列是合并单元格再去合并,否则就不合并
					if (prevCell && cell.textContent === prevCell.textContent && (!topcell || topcell.style?.colspan || topcell?.className == "hidden-cell")) {
						cellSpan++;
						cell.className = "hidden-cell"; //用于导出excel
						prevCell.setAttribute("colspan", cellSpan);
					} else {
						cellSpan = 1;
						prevCell = cell;
					}
				}
			}
			//合并行
			let prevValue = null;
			let spanCount = 1;
			//列循环
			for (let j = 0; j < rowTempLength; j++) {
				//行循环
				for (let i = columns.length + 1; i < table.rows.length; i++) {
					let leftColumn = j ? table.rows[i].cells[j - 1] : "";
					let currentCell = table.rows[i].cells[j]; //当前单元格
					let currentValue = currentCell.innerText; //当前单元格 值

					if (currentValue === prevValue && (!leftColumn || leftColumn.style?.rowspan || leftColumn?.className == "hidden-cell")) {
						currentCell.className = "hidden-cell"; //用于导出excel
						spanCount++;
					} else {
						if (spanCount > 1 && i - spanCount > columns.length) {
							const rowSpanCountCell = table.rows[i - spanCount].cells[j]; //合并单元格的列
							rowSpanCountCell.rowSpan = spanCount;
							rowSpanCountCell.style.background = "#fff";
						}
						prevValue = currentValue;
						spanCount = 1;
						currentCell.className = "borderBottom";
					}
				}
				if (spanCount > 1) {
					const rowSpanCountCell = table.rows[table.rows.length - spanCount].cells[j]; //合并单元格的列
					rowSpanCountCell.rowSpan = spanCount;
					rowSpanCountCell.className = "borderBottom";
					rowSpanCountCell.style.background = "#fff";
				}
			}
		},
	},
	mounted() {
		// this.$nextTick(() => {
		// 	this.pageLoad();
		// });
	},
};
</script>
<style>
@import "../../../../assets/bi-table.less";
#myTable .title {
	color: #000;
	font-weight: bold;
}
#myTable .borderBottom {
	border-bottom: 1px solid #e6e6e6;
}
#myTable .hidden-cell {
	display: none;
}
</style>
<style lang="less" scoped>
.charts {
	height: 100%;
	width: 100%;
}
</style>
