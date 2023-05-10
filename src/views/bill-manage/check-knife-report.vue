/* 验刀数据查询 */
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
												style="width: 200px"
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
												style="width: 200px"
											></DatePicker>
										</FormItem>
										<!-- 项目名 -->
										<FormItem :label="$t('itemName')" prop="itemName">
											<Input v-model="req.itemName" :placeholder="$t('pleaseEnter') + $t('itemName')" @on-search="pageLoad" />
										</FormItem>
										<!-- 条码 -->
										<FormItem :label="$t('barCoding')" prop="code">
											<Input v-model="req.code" :placeholder="$t('pleaseEnter') + $t('barCoding')" @on-search="pageLoad" />
										</FormItem>
										<!-- 验刀类别 -->
										<FormItem :label="$t('category')" prop="category">
											<Select v-model="req.category" transfer :placeholder="$t('pleaseSelect') + $t('category')">
												<Option v-for="(item, i) in categoryList" :value="item.detailCode" :key="i">
													{{ item.detailName }}
												</Option>
											</Select>
										</FormItem>
										<!-- 机种 -->
										<FormItem :label="$t('model')" prop="model">
											<Select v-model="req.model" transfer :placeholder="$t('pleaseSelect') + $t('model')">
												<Option v-for="(item, i) in modelList" :value="item.detailCode" :key="i">
													{{ item.detailName }}
												</Option>
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/check-knife-report";
import { getButtonBoolean, formatDate, exportFile, renderDate } from "@/libs/tools";
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";

export default {
	name: "check-knife-report",
	data() {
		return {
			parameterJson: [],
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
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
				{ title: this.$t("itemName"), key: "itemName", align: "center", width: 120 },
				{ title: this.$t("itemCode"), key: "itemValue", align: "center", width: 120 },
				{ title: this.$t("barCoding"), key: "code", align: "center", width: 150, tooltip: true },
				{ title: this.$t("category"), key: "category", align: "center", width: 120, tooltip: true },
				{ title: this.$t("model"), key: "model", align: "center", width: 80, tooltip: true },
				{ title: this.$t("standardValues"), key: "standardValues", align: "center", width: 80, tooltip: true },
				{ title: this.$t("upperDeviation"), key: "upperDeviation", align: "center", width: 80, tooltip: true },
				{ title: this.$t("lowDeviation"), key: "lowDeviation", align: "center", width: 80, tooltip: true },
				{ title: this.$t("status"), key: "status", align: "center", width: 120, tooltip: true },
				{ title: "BatchID", key: "batchID", width: 120, align: "center", tooltip: true },
				{ title: this.$t("createUser"), key: "createUserName", width: 80, align: "center" },
				{ title: this.$t("createDate"), key: "createDate", width: 125, render: renderDate, align: "center" },
				{ title: this.$t("remark"), key: "remark", minWidth: 100, tooltip: true },
			], // 表格数据
			data: [], // 表格数据
			btnData: [],
			req: {
				startTime: "",
				endTime: "",
				itemName: "",
				code: "",
				category: "",
				model: "",
				...this.$config.pageConfig,
			}, //查询数据
			modelList: [],
			categoryList: [],
		};
	},
	activated() {
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		this.pageLoad();
		this.getDataItemData();
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			const { startTime, endTime, itemName, code, category, model } = this.req;
			if (!itemName && !code && !category && !model && !startTime && !endTime) {
				return this.$Msg.error(`${this.$t("pleaseSelect")}${this.$t("startTime")}/${this.$t("endTime")}`);
			}
			this.tableConfig.loading = true;
			let obj = {
				orderField: this.req.orderField, // 排序字段
				ascending: this.req.ascending, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					startTime: startTime ? formatDate(startTime) : "",
					endTime: endTime ? formatDate(endTime) : "",
					itemName,
					code,
					category,
					model,
				},
			};
			getpagelistReq(obj)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						this.data = data || [];
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
						this.searchPoptipModal = false;
					}
				})
				.catch(() => (this.tableConfig.loading = false));
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 点击编码规则中的加号按钮触发
		async getDataItemData() {
			this.categoryList = await this.getDataItemDetailList("CheckKnifeCategory");
			this.modelList = await this.getDataItemDetailList("Model");
		},
		async getDataItemDetailList(itemCode) {
			const obj = { itemCode, enabled: 1, oderType: 0 };
			let arr = [];
			await getdataitemlistReq(obj).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
		},
		// 导出
		exportClick() {
			const { startTime, endTime, itemName, code, category, model } = this.req;
			let obj = {
				startTime: startTime ? formatDate(startTime) : "",
				endTime: endTime ? formatDate(endTime) : "",
				itemName,
				code,
				category,
				model,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("check-knife-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
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
};
</script>
