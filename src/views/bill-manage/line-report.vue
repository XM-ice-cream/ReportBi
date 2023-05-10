/* 产线报表 */
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
									<Form ref="searchReq" :model="req" :label-width="60" :label-colon="true" @submit.native.prevent>
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
										<FormItem :label="$t('line')" prop="lineName">
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/line-report";
import { getButtonBoolean, formatDate, exportFile, initTreeList } from "@/libs/tools";
import { getlisttreeauthReq } from "@/api/basis-info/area-floor";

export default {
	name: "line-report",
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
				{ title: "08:00-09:00", key: "time8", width: 100, align: "center" },
				{ title: "09:00-10:00", key: "time9", width: 100, align: "center" },
				{ title: "10:00-11:00", key: "time10", width: 100, align: "center" },
				{ title: "11:00-12:00", key: "time11", width: 100, align: "center" },
				{ title: "12:00-13:00", key: "time12", width: 100, align: "center" },
				{ title: "13:00-14:00", key: "time13", width: 100, align: "center" },
				{ title: "14:00-15:00", key: "time14", width: 100, align: "center" },
				{ title: "15:00-16:00", key: "time15", width: 100, align: "center" },
				{ title: "16:00-17:00", key: "time16", width: 100, align: "center" },
				{ title: "17:00-18:00", key: "time17", width: 100, align: "center" },
				{ title: "18:00-19:00", key: "time18", width: 100, align: "center" },
				{ title: "19:00-20:00", key: "time19", width: 100, align: "center" },
				{ title: "20:00-21:00", key: "time20", width: 100, align: "center" },
				{ title: "21:00-21:00", key: "time21", width: 100, align: "center" },
				{ title: "22:00-23:00", key: "time22", width: 100, align: "center" },
				{ title: "23:00-24:00", key: "time23", width: 100, align: "center" },
				{ title: "00:00-01:00", key: "time0", width: 100, align: "center" },
				{ title: "01:00-02:00", key: "time1", width: 100, align: "center" },
				{ title: "02:00-03:00", key: "time2", width: 100, align: "center" },
				{ title: "03:00-04:00", key: "time3", width: 100, align: "center" },
				{ title: "04:00-05:00", key: "time4", width: 100, align: "center" },
				{ title: "05:00-06:00", key: "time5", width: 100, align: "center" },
				{ title: "06:00-07:00", key: "time6", width: 100, align: "center" },
				{ title: "07:00-08:00", key: "time7", width: 100, align: "center" },
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
				},
			};
			getpagelistReq(obj)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						const pageData = data || [];
						const arr = [];
						pageData.forEach((item) => {
							const xIndex = arr.findIndex((o) => o.eqpId === item.eqpId);
							if (xIndex > -1) {
								arr[xIndex].time0 = item.time0;
								arr[xIndex].time1 = item.time1;
								arr[xIndex].time2 = item.time2;
								arr[xIndex].time3 = item.time3;
								arr[xIndex].time4 = item.time4;
								arr[xIndex].time5 = item.time5;
								arr[xIndex].time6 = item.time6;
								arr[xIndex].time7 = item.time7;
								arr[xIndex].time20 = item.time20;
								arr[xIndex].time21 = item.time21;
								arr[xIndex].time22 = item.time22;
								arr[xIndex].time23 = item.time23;
							} else arr.push(item);
						});
						this.data = arr.map((item) => {
							return { ...item, total: this.getTotal(item) };
						});
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
						this.searchPoptipModal = false;
					}
				})
				.catch(() => (this.tableConfig.loading = false));
		},
		// 获取合计数
		getTotal(item) {
			let total = 0;
			for (let key of Object.keys(item)) {
				if (key.includes("time") && !isNaN(Number(item[key]))) total += Number(item[key]);
			}
			return total;
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
				},
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("line-report")}_${obj.data.lineName}_${obj.data.dateTime}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
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
};
</script>
