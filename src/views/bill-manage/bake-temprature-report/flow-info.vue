<template>
	<!-- 右侧抽屉 Form表单 -->
	<Drawer v-model="drawerFlag" :title="drawerTitle" width="1000" :mask-closable="false" @on-close="cancelClick">
		<Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"> </Table>
		<page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
	</Drawer>
</template>

<script>
import { getpagelistReq } from "@/api/bill-manage/sn-query";
import { formatDate } from "@/libs/tools";

export default {
	name: "bake-flow-info",
	props: {
		drawerFlag: {
			type: Boolean,
			default: false,
		},
		selectObj: {
			type: Object,
			default: () => null,
		},
		drawerTitle: {
			type: String,
			default: "流程卡信息",
		},
	},
	watch: {
		drawerFlag() {
			this.submitData = { ...this.selectObj };
			this.pageLoad();
			this.autoSize();
			window.addEventListener("resize", () => this.autoSize());
		},
	},
	data() {
		return {
			data: [],
			tableConfig: { ...this.$config.tableConfig }, // table配置
			req: {
				...this.$config.pageConfig,
			},
			submitData: {
				id: "",
				jobname: "",
				linename: "",
				refdes: "",
			},
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
				{ title: "工单", key: "workorder", align: "center", width: 120, tooltip: true },
				{ title: "大板序号", key: "panelNo", align: "center", width: 150 },
				{ title: "UnitId", key: "unitId", align: "center", width: 140, tooltip: true },
				{ title: "成品料号名称", key: "partName", align: "center", width: 140, tooltip: true },
				{ title: "流程名称", key: "routeName", align: "center", width: 150 },
				{ title: "线别名称", key: "lineName", align: "center", width: 140, tooltip: true },
				{
					title: "当前制程名称",
					key: "curProcessName",
					align: "center",
					width: 140,
					tooltip: true,
				},
				{ title: "工作站（设备ID）", key: "eqpId", align: "center", width: 150 },
				{ title: "下个制程名称", key: "nextProcessName", align: "center", width: 150 },
				{ title: "当前状态", key: "currentStatus", align: "center", width: 70 },
				{ title: "进入制程时间", key: "inProcessTime", align: "center", width: 150 },
				{ title: "离开制程时间", key: "outProcessTime", align: "center", width: 150 },
				{ title: "进入生产线时间", key: "inPdLineTime", align: "center", width: 150 },
				{ title: "离开生产线时间", key: "outPdLineTime", align: "center", width: 150 },
				{ title: "栈板号", key: "palletNo", align: "center", width: 150 },
				{ title: "货柜", key: "container", align: "center", width: 150 },
				{ title: "箱号", key: "cartonNo", align: "center", width: 150 },
				{ title: "抽验编号", key: "qcNo", align: "center", width: 150 },
				{ title: "抽验结果", key: "qcResult", align: "center", width: 70 },
				{ title: "重工号", key: "reworkWo", align: "center", width: 150 },
				{ title: "包装盒/袋子", key: "boxNo", align: "center", width: 150 },
				{ title: "穴位", key: "boardNo", align: "center", width: 70 },
				{ title: "载具", key: "carrier", align: "center", width: 150 },
				{ title: "Cover", key: "cover", align: "center", width: 150 },
				{ title: "Base", key: "base", align: "center", width: 150 },
				{ title: "Magazine", key: "magazine", align: "center", width: 150 },
				{ title: "操作动作", key: "action", align: "center", width: 70 },
				{ title: "X板标识", key: "xFlag", align: "center", width: 70 },
				{ title: "当前制程过站成功数量", key: "splitFlag", align: "center", width: 150 },
				{ title: "分板标识", key: "pcbWashRecord", align: "center", width: 70 },
				{ title: "ledBin", key: "ledBin", align: "center", width: 70 },
				{ title: "holdReason", key: "holdReason", align: "center", width: 150 },
				{ title: "processGrade", key: "processGrade", align: "center", width: 150 },
			], // 表格数据
		};
	},
	activated() {},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			console.log(this.submitData);
			let { datecode, partName, workorder, curprocessname, eqpID } = this.submitData;
			const startTime = datecode.split("-")[0];
			const endTime = datecode.split("-")[1];
			this.tableConfig.loading = true;
			let obj = {
				orderField: "unitId", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					startTime: formatDate(`${startTime.substr(0, 4)}-${startTime.substr(4, 2)}-${startTime.substr(6, 2)} ${startTime.substr(8, 2)}:00:00`),
					endTime: formatDate(`${endTime.substr(0, 4)}-${endTime.substr(4, 2)}-${endTime.substr(6, 2)} ${endTime.substr(8, 2)}:00:00`),
					partName,
					workorder,
					curprocessname,
					eqpID,
					IsHistory: true,
				},
			};
			getpagelistReq(obj)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						this.data = data || [];
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
						this.searchPoptipModal = false;
					}
				})
				.catch(() => (this.tableConfig.loading = false));
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 170 - 60;
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
		// 左侧抽屉取消
		cancelClick() {
			this.$emit("update:drawerFlag", false);
			this.$refs.submitData.resetFields();
		},
	},
};
</script>
