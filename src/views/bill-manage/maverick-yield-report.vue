/* 淀山湖 MaverickReport */
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
									<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick" :rules="ruleValidate">
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
										<!-- 数据类型 -->
										<FormItem label="数据类型" prop="yielD_TYPE">
											<Select v-model="req.yielD_TYPE" clearable>
												<Option v-for="item in yieldTypeList" :value="item" :key="item">{{ item }}</Option>
											</Select>
										</FormItem>
										<!-- 线体名称 -->
										<FormItem :label="$t('lineName')" prop="lineName">
											<Input v-model.trim="req.lineName" :placeholder="$t('pleaseEnter') + $t('lineName')" />
										</FormItem>
										<!-- 站点 -->
										<FormItem :label="$t('stationId')" prop="station">
											<Input v-model.trim="req.station" :placeholder="$t('pleaseEnter') + $t('stationId')" />
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/maverick-yield-report";
import { formatDate, getButtonBoolean, exportFile } from "@/libs/tools";
export default {
	name: "maverick-yield-report",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			yieldTypeList: ["SYL", "SBL"],
			req: {
				startTime: "",
				endTime: "",
				yielD_TYPE: "",
				lineName: "",
				station: "",
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
				{ title: "工作周", key: "workWeek", minWidth: 110, align: "center", tooltip: true },
				{ title: "产品类型", key: "productType", minWidth: 120, align: "center", tooltip: true },
				{ title: "产品名称", key: "product", minWidth: 80, align: "center", tooltip: true },
				{ title: "厂区", key: "site", minWidth: 60, align: "center", tooltip: true },
				{ title: "线别", key: "line", minWidth: 120, align: "center", tooltip: true },
				{ title: "站点", key: "station", minWidth: 80, align: "center", tooltip: true },
				{ title: "日期", key: "dateCode", minWidth: 120, align: "center", tooltip: true },
				{ title: "投入数", key: "inputQty", minWidth: 60, align: "center", tooltip: true },
				{ title: "不良数", key: "failQty", minWidth: 60, align: "center", tooltip: true },
				{ title: "良率目标", key: "maverickRiskLimit", width: 60, align: "center", tooltip: true },
				{ title: "良率", key: "yield", minWidth: 60, align: "center", tooltip: true },
				{ title: "脚位", key: "testItem", minWidth: 60, align: "center", tooltip: true },
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
		//点击搜索按钮触发
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
					let { startTime, endTime, yielD_TYPE, lineName, station } = this.req;
					this.tableConfig.loading = true;
					let obj = {
						orderField: "line", // 排序字段
						ascending: true, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							startTime: formatDate(startTime),
							endTime: formatDate(endTime),
							yielD_TYPE,
							lineName,
							station,
						},
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
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					let { startTime, endTime, yielD_TYPE, lineName, station } = this.req;
					const obj = {
						startTime: formatDate(startTime),
						endTime: formatDate(endTime),
						yielD_TYPE,
						lineName,
						station,
					};

					exportReq(obj).then((res) => {
						let blob = new Blob([res], { type: "application/vnd.ms-excel" });
						const fileName = `${this.$t("maverick-yield-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
						exportFile(blob, fileName);
					});
				}
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.searchPoptipModal = false;
			this.$nextTick(() => {
				this.searchPoptipModal = true;
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
