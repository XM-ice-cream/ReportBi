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

			//获取所有的行/列
			let rowInfo = [];
			let columnInfo = [];

			value.forEach((item) => {
				let rowName = [];
				let columnName = [];
				rowArr.forEach((rItem) => {
					rowName.push(item[rItem]);
				});
				columnArr.forEach((cItem) => {
					columnName.push(item[cItem]);
				});
				rowInfo.push(rowName.toString());
				columnInfo.push(columnName.toString());
			});
			//去重
			rowInfo = [...new Set(rowInfo)];
			columnInfo = [...new Set(columnInfo)]; //有多少列
			const rowTempLength = rowInfo[0].split(",").length;
			//创建值的二维数组
			let valueInfo = [];
			value.forEach((item) => {
				let rowName = [];
				let columnName = [];
				rowArr.forEach((rItem) => {
					rowName.push(item[rItem]);
				});
				columnArr.forEach((cItem, cIndex) => {
					columnName.push(item[cItem]);
				});
				const rowIndex = rowInfo.indexOf(rowName.toString());
				if (!valueInfo[rowIndex]) {
					valueInfo[rowIndex] = rowName;
				}
				const columnIndex = columnInfo.indexOf(columnName.toString());

				valueInfo[rowIndex][columnIndex + rowName.length] = { ...item, actual: markField ? item[`z${markField}`] : "Abc" };
			});
			//创建表格
			let tablHtml = "<table id='myTable'>";
			//渲染列 按列进行遍历
			const columns = columnInfo[0].split(",");
			tablHtml += `<tr>
        <th colspan='${rowTempLength}'></th>
          <th colspan='${columnInfo.length}' style='color:#000;font-weight:bold'>
            ${columnArr.map((item) => renameObj[item]).join(" / ")}
          </th>
        </tr>`;

			for (let i = 0; i < columns.length; i++) {
				const borderBottom = i === columns.length - 1 ? "style='border-bottom:1px solid #e6e6e6;'" : "";
				tablHtml += `<tr ${borderBottom}>`;
				if (i === columns.length - 1)
					rowInfo[0].split(",").forEach((item, index) => (tablHtml += `<th style='color:#000;font-weight:bold'>${renameObj["x" + `${index}`]}</th>`));
				else
					rowInfo[0].split(",").forEach((item, index) => {
						if (index === 0) tablHtml += `<th colspan='${rowTempLength}'></th>`;
						else tablHtml += `<th style='display:none' class='hidden-cell'></th>`;
					});
				for (let j = 0; j < columnInfo.length; j++) {
					const columnItem = columnInfo[j].split(",")[i];
					tablHtml += `<th>${columnItem || ""}</th>`;
				}
				tablHtml += "</tr>";
			}
			//渲染行/值
			for (let i = 0; i < valueInfo.length; i++) {
				const rowItem = valueInfo[i];
				tablHtml += `<tr style='${i % 2 ? "background:#f5f5f5" : ""}'>`;
				for (let j = 0; j < rowItem.length; j++) {
					const columnItem = rowItem[j];
					const title =
						columnItem?.actual &&
						Object.keys(columnItem)
							.filter((item) => item !== "actual")
							.map((item) => `${renameObj[item]}: ${columnItem[item]}`)
							.join("\n");
					tablHtml += `<td title='${title || ""}'>${columnItem?.actual || columnItem || ""}</td>`;
				}
				const diff = columnInfo.length + rowTempLength - rowItem.length;
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
				this.mergeTable(rowTempLength, columns);
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
				const row = rows[rowIndex];
				const toprow = rowIndex ? rows[rowIndex - 1] : "";

				const cols = row.getElementsByTagName("th");
				const topCols = toprow ? toprow.getElementsByTagName("th") : "";

				let prevCell = null;
				let cellSpan = 1;
				for (let colIndex = 0; colIndex < cols.length; colIndex++) {
					const cell = cols[colIndex];
					const topcell = topCols ? topCols[colIndex] : "";
					const topcellpre = topCols && colIndex ? topCols[colIndex - 1] : "";
					//为了上一行的当前列是合并单元格再去合并,否则就不合并
					if (prevCell && cell.textContent === prevCell.textContent && (!topcell || topcell.style?.colspan || topcell.style?.display)) {
						cellSpan++;
						cell.style.display = "none";
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
					let currentValue = table.rows[i].cells[j].innerText;
					if (currentValue === prevValue && (!leftColumn || leftColumn.style?.rowspan || leftColumn.style?.display)) {
						table.rows[i].cells[j].style.display = "none";
						table.rows[i].cells[j].className = "hidden-cell"; //用于导出excel
						spanCount++;
					} else {
						if (spanCount > 1 && i - spanCount > columns.length) {
							table.rows[i - spanCount].cells[j].rowSpan = spanCount;
							table.rows[i - spanCount].cells[j].style.background = "#fff";
						}
						prevValue = currentValue;
						spanCount = 1;
						table.rows[i].cells[j].style.borderBottom = "1px solid #e6e6e6";
					}
				}
				if (spanCount > 1) {
					table.rows[table.rows.length - spanCount].cells[j].rowSpan = spanCount;
					table.rows[table.rows.length - spanCount].cells[j].style.borderBottom = "1px solid #e6e6e6";
					table.rows[table.rows.length - spanCount].cells[j].style.background = "#fff";
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
</style>
<style lang="less" scoped>
.charts {
	height: 100%;
	width: 100%;
}
</style>
