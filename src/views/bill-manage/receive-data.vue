/*receiveData 查询报表*/
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="12" style="display: flex">
							<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button @click.stop="poptipModal = !poptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<!-- @submit.native.prevent @keyup.native.enter="searchClick" -->
									<Form ref="searchReq" :model="req" :label-width="70">
										<!-- 起始时间 -->
										<FormItem :label="$t('startTime')" prop="startTime">
											<DatePicker
												transfer
												type="datetime"
												:placeholder="$t('pleaseSelect') + $t('startTime')"
												format="yyyy-MM-dd HH:mm:ss"
												:options="$config.datetimeOptions"
												v-model="req.startTime"
												style="width: 280px"
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
												style="width: 280px"
											></DatePicker>
										</FormItem>
										<!-- 工单 -->
										<FormItem :label="$t('workOrder')" prop="workOrder">
											<Input type="text" v-model.trim="req.workOrder" :placeholder="$t('pleaseEnter') + $t('workOrder')" />
										</FormItem>
										<!-- 大条码 -->
										<FormItem :label="$t('panelNo')" prop="panelNo">
											<Input
												type="textarea"
												:autosize="{ minRows: 1, maxRows: 5 }"
												v-model.trim="req.panelNo"
												:placeholder="$t('pleaseEnter') + $t('panelNo') + '(请以逗号或回车分隔)'"
											/>
										</FormItem>
										<!-- dataKey -->
										<FormItem :label="$t('dataKey')" prop="dataKey">
											<Input
												type="textarea"
												:autosize="{ minRows: 1, maxRows: 5 }"
												v-model.trim="req.dataKey"
												:placeholder="$t('pleaseEnter') + 'dataKey' + '(请以逗号或回车分隔)'"
											/>
										</FormItem>
										<!-- dataType -->
										<FormItem :label="$t('dataType')" prop="dataType">
											<Input
												type="textarea"
												:autosize="{ minRows: 1, maxRows: 5 }"
												v-model.trim="req.dataType"
												:placeholder="$t('pleaseEnter') + $t('dataType') + '(请以逗号或回车分隔)'"
											/>
										</FormItem>
										<!-- 设备编码 -->
										<FormItem :label="$t('eqpCode')" prop="eqpCode">
											<Input
												type="textarea"
												:autosize="{ minRows: 1, maxRows: 5 }"
												v-model.trim="req.eqpCode"
												:placeholder="$t('pleaseEnter') + $t('eqpCode') + '(请以逗号或回车分隔)'"
											/>
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
						</i-col>
						<i-col span="12">
							<button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
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
		</div>
	</div>
</template>

<script>
import { getpagelistReq, exportReq } from "@/api/bill-manage/receive-data.js";
import { formatDate, getButtonBoolean, renderDate, exportFile } from "@/libs/tools";

export default {
	name: "receive-data",
	data() {
		return {
			visible: false,
			poptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				startTime: "",
				endTime: "",
				panelNo: "",
				dataKey: "",
				dataType: "",
				workOrder: "",
				eqpCode: "",
				...this.$config.pageConfig,
			}, //查询数据
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
				{ title: this.$t("panelNo"), key: "panelno", align: "center", minWidth: 100, ellipsis: true, tooltip: true },
				{ title: this.$t("workOrder"), key: "workorder", align: "center", minWidth: 100, ellipsis: true, tooltip: true },
				{ title: this.$t("lineName"), key: "linename", align: "center", minWidth: 180, ellipsis: true, tooltip: true },
				{ title: this.$t("eqpCode"), key: "eqpcode", align: "center", minWidth: 180, ellipsis: true, tooltip: true },
				{ title: this.$t("dataKey"), key: "datakey", align: "center", minWidth: 140, ellipsis: true, tooltip: true },
				{ title: this.$t("dataValue"), key: "datavalue", align: "center", minWidth: 140, ellipsis: true, tooltip: true },
				{ title: this.$t("dataType"), key: "datatype", align: "center", minWidth: 140, ellipsis: true, tooltip: true },
				{ title: this.$t("ruleName"), key: "rulename", align: "center", minWidth: 180, ellipsis: true, tooltip: true },
				{ title: this.$t("boardNo"), key: "boardno", align: "center", width: 80, ellipsis: true, tooltip: true },
				{ title: this.$t("createDate"), key: "createdate", align: "center", render: renderDate, minWidth: 100, ellipsis: true, tooltip: true },
			], // 表格数据
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.poptipModal = false;
		next();
	},
	methods: {
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
			this.poptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			let { dataKey, panelNo, startTime, endTime, dataType, workOrder, eqpCode } = this.req;
			this.tableConfig.loading = true;
			// 回车转逗号分割
			if (panelNo.indexOf("\n")) panelNo = panelNo.replace(/\n/g, ",");
			if (dataKey.indexOf("\n")) dataKey = dataKey.replace(/\n/g, ",");
			if (dataType.indexOf("\n")) dataType = dataType.replace(/\n/g, ",");
			if (eqpCode.indexOf("\n")) eqpCode = eqpCode.replace(/\n/g, ",");
			let obj = {
				orderField: "panelNo", // 排序字段
				ascending: false, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: { dataKey, panelNo, startTime: formatDate(startTime), endTime: formatDate(endTime), dataType, workOrder, eqpCode },
			};
			getpagelistReq(obj)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						this.data = data || [];
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
					}
				})
				.catch(() => (this.tableConfig.loading = false));
		},

		// 导出
		exportClick() {
			let { dataKey, panelNo, startTime, endTime, dataType, workOrder, eqpCode } = this.req;
			// 回车转逗号分割
			if (panelNo.indexOf("\n")) panelNo = panelNo.replace(/\n/g, ",");
			if (dataKey.indexOf("\n")) dataKey = dataKey.replace(/\n/g, ",");
			if (dataType.indexOf("\n")) dataType = dataType.replace(/\n/g, ",");
			if (eqpCode.indexOf("\n")) eqpCode = eqpCode.replace(/\n/g, ",");
			let obj = {
				datakey: dataKey,
				panelno: panelNo,
				startTime: formatDate(startTime),
				endTime: formatDate(endTime),
				datatype: dataType,
				workorder: workOrder,
				eqpcode: eqpCode,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = "ReceiveData" + `${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.$refs.processId.remove();
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
	},
};
</script>
