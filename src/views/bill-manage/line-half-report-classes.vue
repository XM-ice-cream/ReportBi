/* 产线报表(半点时间) */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="350" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="60" @submit.native.prevent>
										<!-- 站点 -->
										<FormItem :label="$t('time')" prop="dateTime">
											<DatePicker
												transfer
												type="date"
												:placeholder="$t('pleaseSelect') + $t('time')"
												format="yyyy-MM-dd"
												:options="$config.datetimeOptions"
												v-model="req.dateTime"
											></DatePicker>
										</FormItem>
										<!-- 线体 -->
										<FormItem :label="$t('line')" prop="line">
											<Select v-model="req.lineName" clearable filterable transfer :placeholder="`${$t('pleaseSelect')}${$t('line')}`">
												<Option v-for="(item, i) in lineList" :value="item.name" :key="i">{{ item.name }}</Option>
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
				></Table>
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/line-half-report";
import { getButtonBoolean, formatDate, exportFile, initTreeList } from "@/libs/tools";
import { getlisttreeauthReq } from "@/api/basis-info/area-floor";

export default {
	name: "line-half-report-classes",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				dateTime: "", // 时间
				lineName: "", // 线体名称
				...this.$config.pageConfig,
			}, //查询数据
			columns: [
				{
					title: this.$t("sort"),
					type: "index",
					width: 50,
					align: "center",
					fixed: "left",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: this.$t("equipment"), key: "eqpId", width: 200, align: "center", tooltip: true, fixed: "left" },
				{ title: this.$t("siteLocation"), key: "stepName", width: 200, align: "center", tooltip: true, fixed: "left" },
				{ title: this.$t("classes"), key: "dayShift", width: 60, align: "center", fixed: "left" },
				{ title: "08:30-09:30", key: "time8", width: 100, align: "center" },
				{ title: "09:30-10:30", key: "time9", width: 100, align: "center" },
				{ title: "10:30-11:30", key: "time10", width: 100, align: "center" },
				{ title: "11:30-12:30", key: "time11", width: 100, align: "center" },
				{ title: "12:30-13:30", key: "time12", width: 100, align: "center" },
				{ title: "13:30-14:30", key: "time13", width: 100, align: "center" },
				{ title: "14:30-15:30", key: "time14", width: 100, align: "center" },
				{ title: "15:30-16:30", key: "time15", width: 100, align: "center" },
				{ title: "16:30-17:30", key: "time16", width: 100, align: "center" },
				{ title: "17:30-18:30", key: "time17", width: 100, align: "center" },
				{ title: "18:30-19:30", key: "time18", width: 100, align: "center" },
				{ title: "19:30-20:30", key: "time19", width: 100, align: "center" },
				{ title: "Total", key: "total", minWidth: 120, align: "center" },
			], // 表格数据
			lineList: [], // 线体列表
		};
	},
	async activated() {
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		await this.getLineList();
		this.req.orderField = "seq";
		this.req.ascending = true;
		this.req.dateTime = new Date();
		this.req.lineName = this.lineList?.[0].name;
		this.tableConfig.loading = false;
		this.pageLoad();
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			if (!this.req.dateTime) return this.$Msg.error(`${this.$t("pleaseSelect")}${this.$t("time")}`);
			if (!this.req.lineName) return this.$Msg.error(`${this.$t("pleaseSelect")}${this.$t("time")}`);
			this.tableConfig.loading = true;
			let obj = {
				orderField: this.req.orderField, // 排序字段
				ascending: this.req.ascending, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					dateTime: formatDate(this.req.dateTime, "yyyy-MM-dd"),
					lineName: this.req.lineName,
					dayShift: "DN",
				},
			};
			getpagelistReq(obj)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						const pageData = data || [];
						this.data = pageData.map((item) => {
							return { ...item, total: this.getTotal(item) };
						});
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
						this.searchPoptipModal = false;
					}
				})
				.catch(() => (this.tableConfig.loading = false));
		},
		// 获取线体数据
		async getLineList() {
			const obj = {
				userId: this.$store.state.id,
				systemFlag: this.$store.state.systemFlag,
			};
			await getlisttreeauthReq(obj).then(async (res) => {
				if (res.code === 200) {
					let data = res.result || [];
					let arr = [];
					await initTreeList(arr, data);
					this.lineList = arr.filter((item) => item.category === 4); //线体
				}
			});
		},
		// 获取合计数
		getTotal(item) {
			let total = 0;
			for (let key of Object.keys(item)) {
				if (key.includes("time") && !isNaN(Number(item[key]))) total += Number(item[key]);
			}
			return total;
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 导出
		exportClick() {
			if (!this.req.dateTime) return this.$Msg.error(`${this.$t("pleaseSelect")}${this.$t("time")}`);
			if (!this.req.lineName) return this.$Msg.error(`${this.$t("pleaseSelect")}${this.$t("time")}`);
			let obj = {
				orderField: this.req.orderField, // 排序字段
				ascending: this.req.ascending, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					dateTime: formatDate(this.req.dateTime, "yyyy-MM-dd"),
					lineName: this.req.lineName,
					dayShift: "DN",
				},
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("line-half-report-classes")}_${obj.data.lineName}_${obj.data.dateTime}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
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
