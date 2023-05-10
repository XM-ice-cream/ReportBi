/**淀山湖 Maverick Info报表 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Tabs type="card" closable @on-tab-remove="handleTabRemove" v-model="tabName">
				<TabPane label="Maverick Trigger" name="tab1" :index="1" v-if="tab1" :closable="false">
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
												<!-- ID -->
												<FormItem label="ID" prop="triggerid">
													<Input v-model.trim="req.triggerid" clearabled :placeholder="$t('pleaseEnter') + 'ID'" />
												</FormItem>
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
												<FormItem label="线体" prop="line">
													<Input v-model.trim="req.line" clearabled :placeholder="$t('pleaseEnter') + '线体'" />
												</FormItem>
												<!-- 机种 -->
												<FormItem label="机种" prop="model">
													<Input v-model.trim="req.model" clearabled :placeholder="$t('pleaseEnter') + '机种'" />
												</FormItem>
												<!-- stationType Customer -->
												<FormItem label="站别" prop="station">
													<Input v-model.trim="req.station" clearabled :placeholder="$t('pleaseEnter') + '站别'" />
												</FormItem>
												<!-- Yield_Type  -->
												<FormItem label="Yield Type" prop="yielD_TYPE">
													<Select v-model="req.yielD_TYPE" clearable :placeholder="$t('pleaseEnter') + 'Yield Type'" transfer>
														<Option v-for="item in yieldTypeList" :value="item" :key="item">{{ item }}</Option>
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
							<!-- OPEN -->
							<template slot-scope="{ row }" slot="open">
								<div @click="show(row, 1, 'OPEN')" style="color: blue; cursor: pointer">
									{{ row.open }}
								</div>
							</template>
							<!-- ONGOING -->
							<template slot-scope="{ row }" slot="ongoing">
								<div @click="show(row, 2, 'ONGOING')" style="color: blue; cursor: pointer">
									{{ row.ongoing }}
								</div>
							</template>
							<!-- close -->
							<template slot-scope="{ row }" slot="closed">
								<div @click="show(row, 3, 'CLOSED')" style="color: blue; cursor: pointer">
									{{ row.closed }}
								</div>
							</template>
						</Table>
					</Card>
				</TabPane>
				<TabPane label="Open" name="tab2" :index="2" v-if="tab2">
					<TabTable ref="tab2" />
				</TabPane>
				<TabPane label="Ongoing" name="tab3" :index="3" v-if="tab3">
					<TabTable ref="tab3" />
				</TabPane>
				<TabPane label="Close" name="tab4" :index="4" v-if="tab4">
					<TabTable ref="tab4" />
				</TabPane>
			</Tabs>
		</div>
	</div>
</template>

<script>
import { getPageListReq } from "@/api/bill-manage/maverick-trigger";
import { formatDate, getButtonBoolean } from "@/libs/tools";
import TabTable from "./maverick-trigger/tabTable.vue";
import { utils, writeFile } from "xlsx"; // 注意处理方法引入方式

export default {
	name: "maverick-info",
	components: { TabTable },
	data() {
		return {
			searchPoptipModal: false,
			tableConfig: { ...this.$config.tableConfig }, // table配置
			tabName: "tab1",
			tab1: true,
			tab2: false,
			tab3: false,
			tab4: false,
			yieldTypeList: ["SYL", "SBL"],
			data: [], // 表格数据
			btnData: [],
			req: {
				triggerid: "",
				startTime: "",
				endTime: "",
				model: "",
				station: "",
				line: "",
				yielD_TYPE: "",
				...this.$config.pageConfig,
			}, //查询数据
			// 模态框表格数据
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
				{
					title: "机种",
					key: "model",
					ellipsis: true,
					tooltip: true,
					minWidth: 130,
					align: "center",
				},
				{
					title: "区段",
					key: "stage",
					ellipsis: true,
					tooltip: true,
					width: 100,
					align: "center",
				},
				{
					title: "制程",
					key: "stationtype",
					ellipsis: true,
					tooltip: true,
					minWidth: 150,
					align: "center",
				},
				{
					title: "线体",
					key: "line",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "Yield Type",
					key: "yieldtype",
					ellipsis: true,
					tooltip: true,
					minWidth: 100,
					align: "center",
				},
				{
					title: "Open",
					slot: "open",
					ellipsis: true,
					tooltip: true,
					width: 100,
					align: "center",
				},
				{
					title: "Ongoing",
					slot: "ongoing",
					ellipsis: true,
					tooltip: true,
					width: 200,
					align: "center",
				},
				{
					title: "Close",
					slot: "closed",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
				{
					title: "Total",
					key: "total",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
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
				yielD_TYPE: [
					{
						required: true,
						message: this.$t("pleaseSelect") + "类别",
						trigger: "change",
					},
				],
			},
		};
	},
	mounted() {
		this.tableConfig.loading = false;
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
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
			this.selectObj = {};
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					const { triggerid, model, station, line, yielD_TYPE, type, startTime, endTime } = this.req;
					let obj = { triggerid, model, station, line, yielD_TYPE, type, startTime: formatDate(startTime), endTime: formatDate(endTime) };
					getPageListReq(obj)
						.then((res) => {
							this.tableConfig.loading = false;
							if (res.code === 200) {
								this.data = res.result || [];
							}
						})
						.catch(() => (this.tableConfig.loading = false))
						.finally(() => {
							this.searchPoptipModal = false;
						});
				}
			});
		},
		handleTabRemove(name) {
			this[name] = false;
		},
		// 表格单元格点击事件
		show(row, cellIndex, type) {
			const { startTime, endTime, station, yielD_TYPE } = this.req;
			const count = type == "OPEN" ? row.open : type == "ONGOING" ? row.ongoing : row.closed;
			let obj = {
				...row,
				triggerstatus: type,
				triggerstatuscount: count,
				startTime: formatDate(startTime),
				endTime: formatDate(endTime),
				station,
				yielD_TYPE,
			};
			let index = cellIndex + 1;
			this.tabName = "tab" + index;
			this["tab" + index] = true;
			this.$nextTick(() => {
				this.$refs["tab" + index].req.pageIndex = 1;
				this.$refs["tab" + index].queryObj = obj;
				this.$refs["tab" + index].pageLoad(obj);
			});
		},
		// 导出
		exportClick() {
			const { triggerid, model, station, line, yielD_TYPE, type, startTime, endTime } = this.req;
			let obj = { triggerid, model, station, line, yielD_TYPE, type, startTime: formatDate(startTime), endTime: formatDate(endTime) };

			const excelName = `MaverickTrigger`;
			getPageListReq(obj).then((res) => {
				if (res.code === 200) {
					let data = res.result || [];
					let titleList = ["序号", "机种", "区段", "制程", "线体", "Yield Type", "Open", "Ongoing", "Close", "Total"]; // 表格表头
					let tableData = [titleList];
					tableData[0][0] = "序号";
					data.map((item, index) => {
						let rowData = [];
						//导出内容的字段
						rowData = [
							index + 1,
							item.model,
							item.stage,
							item.stationtype,
							item.line,
							item.yieldtype,
							item.open,
							item.ongoing,
							item.closed,
							item.total,
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
