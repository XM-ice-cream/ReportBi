<template>
	<div style="height: 100%">
		<Modal fullscreen v-model="modal" footer-hide title="Fullscreen Modal" :mask-closable="false" :scrollable="true" @on-cancel="modalCancel">
			<Row>
				<Form :label-width="70" inline @submit.native.prevent ref="searchReq" :model="req" @keyup.native.enter="pageLoad">
					<!-- 起始时间 -->
					<FormItem :label="$t('startTime')" prop="startTime">
						<DatePicker
							transfer
							type="datetime"
							:placeholder="$t('pleaseSelect') + $t('startTime')"
							format="yyyy-MM-dd HH:mm:ss"
							:options="$config.datetimeOptions"
							v-model="req.startTime"
						></DatePicker>
					</FormItem>
					<!-- 结束时间 -->
					<FormItem :label="$t('endTime')" prop="endTime">
						<DatePicker
							transfer
							type="datetime"
							:placeholder="$t('pleaseSelect') + $t('endTime')"
							format="yyyy-MM-dd HH:mm:ss"
							:options="$config.datetimeOptions"
							v-model="req.endTime"
						></DatePicker>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="pageLoad">{{ $t("query") }}</Button>
					</FormItem>
				</Form>
			</Row>
			<div class="content" v-if="modal">
				<div id="dailyyieldecharts" class="echarts"></div>
				<div class="detail">
					<span class="title">WIP 不良明细(Fail)</span>
					<Table
						:border="tableConfig.border"
						:highlight-row="tableConfig.highlightRow"
						:height="tableConfig.height"
						:loading="tableConfig.loading"
						:columns="columns"
						:data="data"
					></Table>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
import { getinputsReq, exportReq } from "@/api/bill-manage/quality-yield-query-report";
import { exportFile, formatDate } from "@/libs/tools";
import * as echarts from "echarts";

export default {
	name: "kanbanYield",
	data() {
		return {
			modal: false,
			modalDrawer: true,
			tableConfig: { ...this.$config.tableConfig }, // table配置
			btnData: [],
			queryObj: {},
			req: {
				startTime: "",
				endTime: "",
			}, //查询数据
			yiledEcharts: "",
			data: [
				{
					station: "SMT",
					yield: "FYP",
					workorder: "100%",
				},
				{
					station: "SMT",
					yield: "After Reworked",
					workorder: "100%",
				},
				{
					station: "SMT",
					yield: "Fail Qty",
					workorder: "100%",
				},
			],
			columns: [
				{
					title: "Station/Lines",
					key: "station",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Yield",
					key: "yield",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Overall Yield",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "L1",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "L2",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "L3",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "L4",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "L5",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "L6",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "L7",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "L8",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "L9",
					key: "workorder",
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
			],
		};
	},
	watch: {
		modal() {
			if (this.modal) {
				this.pageLoad();
				this.autoSize();
				this.$nextTick(() => {
					this.initEcharts();
				});
			}
		},
	},
	mounted() {},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = true;
			let obj = {
				orderField: "unitId", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: this.queryObj,
			};
			getinputsReq(obj)
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
		initEcharts() {
			this.yiledEcharts = echarts.init(document.getElementById("dailyyieldecharts"));
			let option = {
				color: ["#398efe", "#1ddbb9", "#ffdb5c", "#ff9f7f", "#fb7293", "#e7bcf3", "#8378ea"],
				title: {
					text: "DM02 Line1 BE Daily Yield Report",
					left: "center",
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross",
						crossStyle: {
							color: "#999",
						},
					},
				},
				toolbox: {
					feature: {
						dataView: { show: true, readOnly: false },
						magicType: { show: true, type: ["line", "bar"] },
						restore: { show: true },
						saveAsImage: { show: true },
					},
				},
				grid: {
					left: "center",
					bottom: "10%",
					width: "90%",
					height: "70%",
				},
				legend: {
					data: ["Evaporation", "Precipitation", "Temperature"],
					top: "10%",
				},
				xAxis: [
					{
						type: "category",
						data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
						axisPointer: {
							type: "shadow",
						},
					},
				],
				yAxis: [
					{
						type: "value",
						name: "Precipitation",
						min: 0,
						max: 250,
						interval: 50,
						axisLabel: {
							formatter: "{value} ml",
						},
					},
					{
						type: "value",
						name: "Temperature",
						min: 0,
						max: 25,
						interval: 5,
						axisLabel: {
							formatter: "{value} °C",
						},
					},
				],
				series: [
					{
						name: "Evaporation",
						type: "bar",
						tooltip: {
							valueFormatter: function (value) {
								return value + " ml";
							},
						},
						data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
					},
					{
						name: "Precipitation",
						type: "bar",
						tooltip: {
							valueFormatter: function (value) {
								return value + " ml";
							},
						},
						data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
					},
					{
						name: "Temperature",
						type: "line",
						yAxisIndex: 1,
						tooltip: {
							valueFormatter: function (value) {
								return value + " °C";
							},
						},
						data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
					},
				],
			};
			this.yiledEcharts.setOption(option, true);
			window.addEventListener("resize", () => {
				if (this.yiledEcharts) {
					this.yiledEcharts.resize();
				}
			});
		},
		modalCancel() {
			this.modal = false;
		},
		// 导出
		exportClick() {
			let obj = {
				orderField: "unitId", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				total: 0,
				data: this.queryObj,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("quality-yield-query-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight / 2 - 150;
		},
	},
};
</script>
<style scoped lang="less">
.content {
	width: calc(100% - 1rem);
	height: calc(100% - 4rem);
	.echarts {
		height: 50%;
		width: 100%;
	}
	.detail {
		height: 50%;
		width: 100%;
		.title {
			font-weight: bold;
			margin: 0.3rem;
			padding: 0.4rem 1rem;
			display: inline-block;
			font-size: 13px;
			color: #fffdfd;
			background: #39b6f1;
			/* text-align: center; */
			border-radius: 1px 10px;
		}
	}
}
</style>
