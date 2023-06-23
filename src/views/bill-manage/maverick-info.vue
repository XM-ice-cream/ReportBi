/**淀山湖 Maverick Info报表 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Tabs type="card" closable @on-tab-remove="handleTabRemove" v-model="tabName">
				<TabPane label="Maverick Info" name="tab1" :index="1" v-if="tab1" :closable="false">
					<Card :bordered="false" dis-hover class="card-style">
						<div slot="title">
							<Row>
								<i-col span="6">
									<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
										<Button @click.stop="searchPoptipModal = !searchPoptipModal">
											<Icon type="ios-funnel" />
										</Button>
										<div class="poptip-style-content" slot="content">
											<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
												<!-- ID -->
												<FormItem label="ID" prop="id">
													<Input v-model.trim="req.id" clearabled :placeholder="$t('pleaseEnter') + 'ID'" />
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
												<FormItem label="stationType Customer" prop="stationType_Customer">
													<Input v-model.trim="req.stationType_Customer" clearabled :placeholder="$t('pleaseEnter') + 'stationType Customer'" />
												</FormItem>
												<!-- Yield_Type  -->
												<FormItem label="Yield Type" prop="Yield_Type ">
													<Input v-model.trim="req.yield_Type" clearabled :placeholder="$t('pleaseEnter') + 'Yield Type'" />
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
									<button-custom :btnData="btnData"></button-custom>
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
								<div @click="show(row, 1)" style="color: blue; cursor: pointer">
									{{ row.open }}
								</div>
							</template>
							<!-- ONGOING -->
							<template slot-scope="{ row }" slot="ongoing">
								<div @click="show(row, 2)" style="color: blue; cursor: pointer">
									{{ row.ongoing }}
								</div>
							</template>
							<!-- close -->
							<template slot-scope="{ row }" slot="close">
								<div @click="show(row, 3)" style="color: blue; cursor: pointer">
									{{ row.close }}
								</div>
							</template>
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
import { getPageListReq } from "@/api/bill-manage/maverick-info";
import { formatDate, getButtonBoolean } from "@/libs/tools";
import TabTable from "./maverick-info/tabTable.vue";

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
			data: [], // 表格数据
			btnData: [],
			req: {
				id: "",
				startTime: "",
				endTime: "",
				model: "",
				stationType_Customer: "",
				line: "",
				yield_Type: "",
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
					title: "ID",
					key: "id",
					width: 120,
					ellipsis: true,
					tooltip: true,
					align: "center",
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
					title: "Stage",
					key: "stage",
					ellipsis: true,
					tooltip: true,
					width: 100,
					align: "center",
				},
				{
					title: "StationType Customer",
					key: "stationType_Customer",
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
					title: "Yield type",
					key: "yield_Type",
					ellipsis: true,
					tooltip: true,
					width: 100,
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
					slot: "close",
					ellipsis: true,
					tooltip: true,
					minWidth: 80,
					align: "center",
				},
			], // 表格数据
		};
	},
	activated() {
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
			this.tableConfig.loading = true;
			const { id, model, stationtypE_CUSTOMER, line, yielD_TYPE, type, startTime, endTime } = this.req;
			let obj = {
				orderField: "model", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: { id, model, stationtypE_CUSTOMER, line, yielD_TYPE, type, startTime: formatDate(startTime), endTime: formatDate(endTime) },
			};
			getPageListReq(obj)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
						this.data = data || [];
					}
				})
				.catch(() => (this.tableConfig.loading = false))
				.finally(() => {
					this.searchPoptipModal = false;
				});
		},
		handleTabRemove(name) {
			this[name] = false;
		},
		// 表格单元格点击事件
		show(row, type) {
			const { startTime, endTime, stationtypE_CUSTOMER, yielD_TYPE } = this.req;
			let obj = { ...row, type: String(type), startTime: formatDate(startTime), endTime: formatDate(endTime), stationtypE_CUSTOMER, yielD_TYPE };
			let index = type + 1;
			this.tabName = "tab" + index;
			this["tab" + index] = true;
			this.$nextTick(() => {
				this.$refs["tab" + index].req.pageIndex = 1;
				this.$refs["tab" + index].queryObj = obj;
				this.$refs["tab" + index].pageLoad(obj);
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
