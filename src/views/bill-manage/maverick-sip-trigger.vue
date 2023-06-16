/* SIP Trigger */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
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
										<!-- 机种 -->
										<FormItem :label="$t('model')" prop="model">
											<Input v-model.trim="req.model" :placeholder="$t('pleaseEnter') + $t('model')" />
										</FormItem>
										<!-- 站点类型 -->
										<FormItem :label="$t('station')" prop="stationtype">
											<Input v-model.trim="req.stationtype" :placeholder="$t('pleaseEnter') + $t('station')" />
										</FormItem>
										<!-- 线体 -->
										<FormItem :label="$t('line')" prop="line">
											<Input v-model.trim="req.line" :placeholder="$t('pleaseEnter') + $t('line')" />
										</FormItem>

										<!-- 类型 -->
										<FormItem label="类型" prop="yield_Type">
											<Select v-model.tirm="req.yield_Type" transfer :placeholder="$t('pleaseSelect') + '类型'" clearable>
												<Option v-for="(item, index) in yieldTypeList" :key="index" :value="item">{{ item }}</Option>
											</Select>
										</FormItem>
										<!-- 状态 -->
										<FormItem label="状态" prop="triggerstatus">
											<Select v-model.tirm="req.triggerstatusType" transfer :placeholder="$t('pleaseSelect') + '状态'" clearable>
												<Option v-for="(item, index) in triggerstatusTypeList" :key="index" :value="item">{{ item }}</Option>
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
import { getpagelistReq } from "@/api/bill-manage/maverick-sip-trigger";
import { getButtonBoolean, formatDate, renderDate } from "@/libs/tools";
import { utils, writeFile } from "xlsx"; // 注意处理方法引入方式

export default {
	components: {},
	name: "maverick-sip-trigger",
	data() {
		return {
			searchPoptipModal: false,
			btnData: [],
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			yieldTypeList: ["SYL", "SBL"],
			triggerstatusTypeList: ["OPEN", "ONGOING", "CLOSED"],
			req: {
				startTime: "",
				endTime: "",
				line: "",
				model: "",
				stationtype: "",
				yield_Type: "SYL",
				triggerstatus: "",
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
				{ title: "TriggeRid", key: "triggerid", align: "center", minWidth: 100, tooltip: true },
				{ title: "Component", key: "component", align: "center", minWidth: 100, tooltip: true },
				{ title: "SN", key: "sn", align: "center", minWidth: 150, tooltip: true },
				{ title: "Status", key: "status", align: "center", minWidth: 100, tooltip: true },
				{ title: "AlertDate", key: "alert_date", align: "center", minWidth: 130, tooltip: true, render: renderDate },
				{ title: "Station", key: "station", align: "center", minWidth: 120, tooltip: true },
				{ title: "ErrorCode", key: "error_code", align: "center", minWidth: 200, tooltip: true },
				{ title: "FAComponent", key: "fA_component", align: "center", minWidth: 100, tooltip: true },
				{ title: "DRI", key: "dri", align: "center", minWidth: 100, tooltip: true },
				{ title: "FA", key: "fa", align: "center", minWidth: 100, tooltip: true },
				{ title: "CA", key: "ca", minWidth: 180, align: "center", tooltip: true },
				{ title: "ProjectName", key: "project_name", minWidth: 100, align: "center" },
				{ title: "Category", key: "category", minWidth: 100, align: "center", tooltip: true },
				{ title: "Target", key: "target", minWidth: 100, align: "center", tooltip: true },
				{ title: "CP", key: "cp", minWidth: 100, align: "center", tooltip: true },
			], // 表格数据
			// 验证实体
			ruleValidate: {},
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
					const { startTime, endTime, line, model, stationtype, yield_Type, triggerstatus, pageSize, pageIndex, ascending, prod } = this.req;
					const obj = {
						orderField: "PID", // 排序字段
						ascending, // 是否升序
						pageSize, // 分页大小
						pageIndex, // 当前页码
						data: { startTime: formatDate(startTime), endTime: formatDate(endTime), line, model, stationtype, yield_Type, triggerstatus },
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
			const { startTime, endTime, line, model, stationtype, yield_Type, triggerstatus, ascending } = this.req;
			const obj = {
				orderField: "PID", // 排序字段
				ascending, // 是否升序
				pageSize: 10000, // 分页大小
				pageIndex: 1, // 当前页码
				data: { startTime: formatDate(startTime), endTime: formatDate(endTime), line, model, stationtype, yield_Type, triggerstatus },
			};
			const excelName = `SIP Trigger`;
			getpagelistReq(obj).then((res) => {
				if (res.code === 200) {
					let data = res.result?.data || [];
					let titleList = [
						"序号",
						"TriggeRid",
						"Component",
						"SN",
						"Status",
						"AlertDate",
						"Station",
						"ErrorCode",
						"FAComponent",
						"DRI",
						"FA",
						"CA",
						"ProjectName",
						"Category",
						"Target",
						"CP",
					]; // 表格表头
					let tableData = [titleList];
					tableData[0][0] = "序号";
					data.map((item, index) => {
						let rowData = [];
						//导出内容的字段
						rowData = [
							index + 1,
							item.triggerid,
							item.component,
							item.sn,
							item.status,
							formatDate(item.alert_date),
							item.station,
							item.error_code,
							item.fA_component,
							item.dri,
							item.fa,
							item.ca,
							item.project_name,
							item.category,
							item.target,
							item.cp,
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
	mounted() {
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
