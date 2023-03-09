/* MaverickToBox */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="3">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
									{{ $t("selectQuery") }}
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
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
											<Select v-model="req.line" clearable :placeholder="$t('pleaseSelect') + $t('line')" transfer>
												<Option v-for="item in lineList" :key="item" :label="item" :value="item" />
											</Select>
										</FormItem>
										<!-- 机种 -->
										<FormItem :label="$t('model')" prop="model">
											<Select v-model="req.model" clearable :placeholder="$t('pleaseSelect') + $t('model')" transfer>
												<Option v-for="item in modelList" :key="item" :label="item" :value="item" />
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
						<i-col span="6">
							<RadioGroup v-model="req.type" type="button" button-style="solid" @on-change="searchClick">
								<Radio label="GoalSBL"></Radio>
								<Radio label="SYL"></Radio>
								<Radio label="SBL"></Radio>
							</RadioGroup>
						</i-col>
						<i-col span="15">
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
import { getModelReq, getLineReq, getGoalSblReq, getSylReq, getSblReq, exportReq } from "@/api/bill-manage/maverick-to-box";
import { getButtonBoolean, renderDate, formatDate, exportFile } from "@/libs/tools";

export default {
	components: {},
	name: "maverick-to-box",
	data() {
		return {
			searchPoptipModal: false,
			btnData: [],
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			lineList: [], //线体
			modelList: [], //机种
			req: {
				type: "GoalSBL", //显示数据类别
				startTime: "",
				endTime: "",
				line: "",
				model: "",
				...this.$config.pageConfig,
			}, //查询数据
			columns: [],
			originColumns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					dataType: "GoalSBL,SYL,SBL",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "WorkWeek", key: "workweek", align: "center", minWidth: 100, tooltip: true, dataType: "SYL,SBL" },
				{ title: "ProductType", key: "producttype", align: "center", minWidth: 100, tooltip: true, dataType: "SYL,SBL" },
				{ title: "Product", key: "product", align: "center", minWidth: 100, tooltip: true, dataType: "GoalSBL,SYL,SBL" },
				{ title: "Site", key: "site", align: "center", minWidth: 100, tooltip: true, dataType: "SYL,SBL" },
				{ title: "Station", key: "station", align: "center", minWidth: 100, tooltip: true, dataType: "GoalSBL,SYL,SBL" },
				{ title: "Item", key: "item", align: "center", minWidth: 100, tooltip: true, dataType: "GoalSBL" },
				{ title: "StationItem", key: "stationitem", align: "center", minWidth: 100, tooltip: true, dataType: "GoalSBL" },
				{ title: "Mean", key: "mean", align: "center", minWidth: 100, tooltip: true, dataType: "GoalSBL" },
				{ title: "SigmaValue", key: "sigmavalue", align: "center", minWidth: 100, tooltip: true, dataType: "GoalSBL" },
				{ title: "SBL Statistical", key: "sblstatistical", align: "center", minWidth: 100, tooltip: true, dataType: "GoalSBL" },

				{ title: "Line", key: "line", align: "center", minWidth: 100, tooltip: true, dataType: "SYL,SBL" },
				{ title: "DateCode", key: "datecode", minWidth: 100, align: "center", dataType: "SYL,SBL" },
				{ title: "InputQty", key: "inputqty", minWidth: 100, align: "center", dataType: "SYL,SBL" },
				{ title: "FailQty", key: "failqty", minWidth: 100, align: "center", dataType: "SYL,SBL" },
				{ title: "MverickLimit", key: "mavericklimit", minWidth: 100, align: "center", dataType: "SYL,SBL" },
				{ title: "Yield", key: "yield", minWidth: 100, align: "center", dataType: "SYL" },
				{ title: "TestItem", key: "testitem", minWidth: 100, align: "center", dataType: "SBL" },
				{ title: "FR", key: "fr", minWidth: 100, align: "center", dataType: "SBL" },
			], // 表格数据
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
			this.columns = this.originColumns.filter((item) => item.dataType.split(",").includes(this.req.type));
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					const { type, startTime, endTime, line, model, ascending, pageSize, pageIndex } = this.req;
					const obj = {
						orderField: type == "GoalSBL" ? "line" : "workWeek", // 排序字段
						ascending, // 是否升序
						pageSize, // 分页大小
						pageIndex, // 当前页码
						data: { startTime: formatDate(startTime), endTime: formatDate(endTime), line, model },
					};
					const requestApi = type == "GoalSBL" ? getGoalSblReq(obj) : type == "SYL" ? getSylReq(obj) : getSblReq(obj);
					requestApi
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
			const { startTime, endTime, line, model } = this.req;
			const obj = {
				startTime: formatDate(startTime),
				endTime: formatDate(endTime),
				line,
				model,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("maverick-to-box")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
		},
		//获取线体
		getLine() {
			getLineReq().then((res) => {
				if (res.code == 200) {
					this.lineList = res.result;
				}
			});
		},
		//获取机种
		getModel() {
			getModelReq().then((res) => {
				if (res.code == 200) {
					this.modelList = res.result;
				}
			});
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
		this.getLine();
		this.getModel();
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
