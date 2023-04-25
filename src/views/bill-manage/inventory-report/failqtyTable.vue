<template>
	<Modal v-model="modalFlag" :title="title" :mask-closable="false" draggable width="1200" :styles="{ top: '20px' }" :footer-hide="true">
		<Button type="primary" @click="exportClick" class="exportBtn">导出</Button>
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
import { getFailQtyReq, downloadFailQtyReq } from "@/api/bill-manage/inventory-report";
export default {
	name: "BorrowTable",
	components: {},
	props: {},
	data() {
		return {
			modalFlag: false,
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			columns: [
				{
					title: "工单",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "SN",
					key: "unitid",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "当前状态",
					key: "currentstatus",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "NG站点",
					key: "curprocessname",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "不良代码",
					key: "defectcode",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "进LAB时间",
					key: "trackintime",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
					render: renderDate,
				},
				{
					title: "出LAB时间",
					key: "trackouttime",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
					render: renderDate,
				},
			],
			title: "",
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
			this.title = obj.type;
			this.tableConfig.loading = true;
			getFailQtyReq(obj)
				.then((res) => {
					if (res.code === 200) {
						this.data = res.result;
					}
				})
				.finally(() => (this.tableConfig.loading = false));
		},
		//导出
		exportClick() {
			downloadFailQtyReq({ ...this.req }).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.req.type}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
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
