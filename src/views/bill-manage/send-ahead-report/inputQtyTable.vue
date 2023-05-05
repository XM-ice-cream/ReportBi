<template>
	<Modal v-model="modalFlag" :title="title" :mask-closable="false" draggable width="1200" :styles="{ top: '20px' }" :footer-hide="true">
		<Button type="primary" @click="exportClick" class="exportBtn"> 导出</Button>
		<vxe-table
			ref="xTable1"
			size="mini"
			resizable
			:border="tableConfig.border"
			align="center"
			:loading="tableConfig.loading"
			:data="data"
			:height="tableConfig.height"
		>
			<vxe-column type="seq" width="60"></vxe-column>
			<template v-for="item in columns">
				<vxe-column :field="item.key" :title="item.title" min-width="140" show-overflow> </vxe-column>
			</template>
		</vxe-table>
	</Modal>
</template>

<script>
import { renderDate, formatDate, exportFile } from "@/libs/tools";
import { getListReq } from "@/api/bill-manage/send-ahead-report";
import { utils, writeFile } from "xlsx"; // 注意处理方法引入方式

export default {
	name: "InputQtyTable",
	components: {},
	props: {},
	data() {
		return {
			modalFlag: false,
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			columns: [
				{
					title: "SN",
					key: "unitid",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "制程",
					key: "steP_SYS_NAME",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "状态",
					key: "checkstate",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "不良数",
					key: "faiL_QTY",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "错误码",
					key: "erroR_CODE",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "创建人",
					key: "createuser",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "创建时间",
					key: "createtime",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
					render: renderDate,
				},
			],
			title: "投入数",
			req: {},
		};
	},
	watch: {
		modalFlag(newVal) {
			if (newVal) {
				this.tableConfig.loading = false;
				this.autoSize();
				window.addEventListener("resize", () => this.autoSize());
			}
		},
	},
	methods: {
		pageLoad(obj) {
			this.req = { ...obj };
			this.tableConfig.loading = true;
			getListReq(obj)
				.then((res) => {
					if (res.code === 200) {
						this.data = res.result;
					}
				})
				.finally(() => (this.tableConfig.loading = false));
		},
		//导出
		exportClick() {
			const excelName = `Sendahead Report`;
			getListReq({ ...this.req }).then((res) => {
				if (res.code === 200) {
					let data = res.result || [];
					let titleList = ["序号", "SN", "制程", "状态", "不良数", "错误码", "创建人", "创建时间"]; // 表格表头
					let tableData = [titleList];
					tableData[0][0] = "序号";
					data.map((item, index) => {
						let rowData = [];
						//导出内容的字段
						rowData = [
							index + 1,
							item.unitId,
							item.steP_SYS_NAME,
							item.checkstate,
							item.faiL_QTY,
							item.erroR_CODE,
							item.createuser,
							formatDate(item.createtime),
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
		// 取消按钮事件
		cancelClick() {
			this.modalFlag = false;
		},
	},
};
</script>

<style scoped lang="less">
.exportBtn {
	height: 30px;
	padding: 0 10px;
	margin-bottom: 10px;
}
</style>
