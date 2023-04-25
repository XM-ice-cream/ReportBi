/* MaverickCustData */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
									{{ $t("selectQuery") }}
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form
										ref="searchReq"
										:model="req"
										:label-width="80"
										:label-colon="true"
										:rules="ruleValidate"
										@submit.native.prevent
										@keyup.native.enter="searchClick"
									>
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
										<!-- 线体 -->
										<FormItem :label="$t('line')" prop="line">
											<Input v-model.trim="req.line" :placeholder="$t('pleaseEnter') + $t('line')" />
										</FormItem>
										<!-- 机种 -->
										<FormItem :label="$t('model')" prop="prod">
											<Input v-model.trim="req.prod" :placeholder="$t('pleaseEnter') + $t('model')" />
										</FormItem>
										<!-- 站点类型 -->
										<FormItem :label="$t('station')" prop="sttype">
											<Input v-model.trim="req.sttype" :placeholder="$t('pleaseEnter') + $t('station')" />
										</FormItem>
										<!-- 类型 -->
										<FormItem label="类型" prop="tritype">
											<Select v-model.tirm="req.tritype" transfer :placeholder="$t('pleaseSelect') + '类型'" clearable>
												<Option v-for="(item, index) in tritypeList" :key="index" :value="item">{{ item }}</Option>
											</Select>
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
						</i-col>
						<i-col span="18">
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
import { getpagelistReq } from "@/api/bill-manage/maverick-cusdata";
import { getButtonBoolean, formatDate } from "@/libs/tools";
import { utils, writeFile } from "xlsx"; // 注意处理方法引入方式

export default {
	components: {},
	name: "maverick-cusdata",
	data() {
		return {
			searchPoptipModal: false,
			btnData: [],
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			tritypeList: ["SYL", "SBL"],
			req: {
				startTime: "",
				endTime: "",
				line: "",
				prod: "",
				sttype: "",
				tritype: "SYL",
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
				{ title: "TType", key: "ttype", align: "center", minWidth: 100, tooltip: true },
				{ title: "TriggeRid", key: "triggerid", align: "center", minWidth: 100, tooltip: true },
				{ title: "LOB", key: "lob", align: "center", minWidth: 100, tooltip: true },
				{ title: "CM", key: "cm", align: "center", minWidth: 100, tooltip: true },
				{ title: "Line", key: "line", align: "center", minWidth: 100, tooltip: true },
				{ title: "WorkOrder", key: "workorder", align: "center", minWidth: 100, tooltip: true },
				{ title: "PN", key: "pn", align: "center", minWidth: 100, tooltip: true },
				{ title: "WoQty", key: "woqty", align: "center", minWidth: 100, tooltip: true },
				{ title: "Station", key: "station", align: "center", minWidth: 100, tooltip: true },
				{ title: "Input", key: "input", align: "center", minWidth: 100, tooltip: true },
				{ title: "FailQty", key: "failqty", align: "center", minWidth: 100, tooltip: true },
				{ title: "FailRate", key: "failrate", minWidth: 100, align: "center" },
				{ title: "YieldGoal", key: "yieldgoal", minWidth: 100, align: "center" },

				{ title: "DRI", key: "dri", minWidth: 100, align: "center", tooltip: true },
				{ title: "Date", key: "date", minWidth: 100, align: "center", tooltip: true },
				{ title: "RiskLevel", key: "risklevel", minWidth: 100, align: "center", tooltip: true },
				{ title: "Type", key: "type", minWidth: 100, align: "center", tooltip: true },
				{ title: "Qty", key: "qty", minWidth: 100, align: "center", tooltip: true },
				{ title: "SN", key: "sn", align: "center", minWidth: 100, tooltip: true },
				{ title: "Location", key: "location", minWidth: 100, align: "center", tooltip: true },
				{ title: "ErrorCode", key: "errorcode", minWidth: 100, align: "center", tooltip: true },
				{ title: "SPIResult", key: "spiresult", minWidth: 100, align: "center", tooltip: true },
				{ title: "PreAOIResult", key: "preaoiresult", minWidth: 100, align: "center", tooltip: true },
				{ title: "PostAOIresult", key: "postaoiresult", minWidth: 100, align: "center", tooltip: true },
				{ title: "SwapConfirm", key: "swapconfirm", minWidth: 100, align: "center", tooltip: true },
				{ title: "XrayResult", key: "xrayresult", minWidth: 100, align: "center", tooltip: true },
				{ title: "OnHoldAPN", key: "onholdapn", align: "center", minWidth: 100, tooltip: true },
				{ title: "OnHoldDC", key: "onholddc", minWidth: 100, align: "center", tooltip: true },
				{ title: "OnHoldLC", key: "onholdlc", minWidth: 100, align: "center", tooltip: true },
				{ title: "Vndor", key: "vendor", minWidth: 100, align: "center", tooltip: true },
				{ title: "RawMaterialOnHoldQty", key: "rawmaterialonholdqty", minWidth: 100, align: "center", tooltip: true },
				{ title: "MLBOnHoldQty", key: "mlbonholdqty", minWidth: 100, align: "center", tooltip: true },
				{ title: "FailureAnalysis", key: "failureanalysis", minWidth: 100, align: "center", tooltip: true },
				{ title: "RootCause", key: "rootcause", minWidth: 100, align: "center", tooltip: true },
				{ title: "Correctiveaction", key: "correctiveaction", align: "center", minWidth: 100, tooltip: true },
				{ title: "Follow UpStatus", key: "followupstatus", minWidth: 100, align: "center", tooltip: true },
				{ title: "CP", key: "cp", minWidth: 100, align: "center", tooltip: true },
				{ title: "ClosedDate", key: "closeddate", minWidth: 100, align: "center", tooltip: true },
				{ title: "Status", key: "status", minWidth: 100, align: "center", tooltip: true },
				{ title: "Week", key: "week", minWidth: 100, align: "center", tooltip: true },
				{ title: "Brdtype", key: "brdtype", minWidth: 100, align: "center", tooltip: true },
				{ title: "Project", key: "project", minWidth: 100, align: "center", tooltip: true },
			], // 表格数据
			// 验证实体
			ruleValidate: {
				startTime: [
					{
						required: true,
						type: "date",
						message: this.$t("pleaseSelect") + "开始时间",
						trigger: "change",
					},
				],
				endTime: [
					{
						required: true,
						type: "date",
						message: this.$t("pleaseSelect") + "结束时间",
						trigger: "change",
					},
				],
			},
		};
	},
	activated() {
		this.autoSize();
		this.tableConfig.loading = false;
		window.addEventListener("resize", () => this.autoSize);
		getButtonBoolean(this, this.btnData);
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
			this.searchPoptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					const { startTime, endTime, line, sttype, tritype, pageSize, pageIndex, ascending, prod } = this.req;
					const obj = {
						orderField: "line", // 排序字段
						ascending, // 是否升序
						pageSize, // 分页大小
						pageIndex, // 当前页码
						data: { startTime: formatDate(startTime), endTime: formatDate(endTime), prod, line, sttype, tritype },
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
					this.searchPoptipModal = false;
				}
			});
		},
		// 导出
		exportClick() {
			const { startTime, endTime, line, sttype, tritype, prod, ascending } = this.req;
			const obj = {
				orderField: "line", // 排序字段
				ascending, // 是否升序
				pageSize: 10000, // 分页大小
				pageIndex: 1, // 当前页码
				data: { startTime: formatDate(startTime), endTime: formatDate(endTime), prod, line, sttype, tritype },
			};
			const excelName = `MaverickCustData`;
			getpagelistReq(obj).then((res) => {
				if (res.code === 200) {
					let data = res.result?.data || [];
					let titleList = [
						"序号",
						"TType",
						"TriggeRid",
						"LOB",
						"CM",
						"Line",
						"WorkOrder",
						"PN",
						"WoQty",
						"Station",
						"Input",
						"FailQty",
						"FailRate",
						"YieldGoal",
						"DRI",
						"Date",
						"RiskLevel",
						"Type",
						"Qty",
						"SN",
						"Location",
						"ErrorCode",
						"SPIResult",
						"PreAOIResult",
						"PostAOIresult",
						"SwapConfirm",
						"XrayResult",
						"OnHoldAPN",
						"OnHoldDC",
						"OnHoldLC",
						"Vndor",
						"RawMaterialOnHoldQty",
						"MLBOnHoldQty",
						"Failureanalysis",
						"RootCause",
						"Correctiveaction",
						"Follow UpStatus",
						"CP",
						"ClosedDate",
						"Status",
						"Week",
						"Brdtype",
						"Project",
					]; // 表格表头
					let tableData = [titleList];
					tableData[0][0] = "序号";
					data.map((item, index) => {
						let rowData = [];
						//导出内容的字段
						rowData = [
							index + 1,
							item.ttype,
							item.triggerid,
							item.lob,
							item.cm,
							item.line,
							item.workorder,
							item.pn,
							item.woqty,
							item.station,
							item.input,
							item.failqty,
							item.failrate,
							item.yieldgoal,
							item.dri,
							item.date,
							item.risklevel,
							item.type,
							item.qty,
							item.sn,
							item.location,
							item.errorcode,
							item.spiresult,
							item.preaoiresult,
							item.postaoiresult,
							item.swapconfirm,
							item.xrayresult,
							item.onholdapn,
							item.onholddc,
							item.onholdlc,
							item.vendor,
							item.rawmaterialonholdqty,
							item.mlbonholdqty,
							item.failureanalysis,
							item.rootcause,
							item.correctiveaction,
							item.followupstatus,
							item.cp,
							item.closeddate,
							item.status,
							item.week,
							item.brdtype,
							item.project,
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
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
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
		this.searchClick();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
	},
};
</script>
<style scoped>
.replydetail {
	color: #0078dd;
	background-color: #4127ce00;
	border-color: #0189fd;
}
</style>
