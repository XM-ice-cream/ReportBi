/* 标签数据 */
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
									<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
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
										<!-- 料号 -->
										<FormItem :label="$t('pn')" prop="pn">
											<Input v-model="req.pn" :placeholder="$t('pleaseEnter') + $t('pn')" @on-search="searchClick" />
										</FormItem>
										<!-- RID -->
										<FormItem :label="$t('rId')" prop="rid">
											<Input v-model.trim="req.rid" placeholder="请输入RID,多个以英文逗号或空格分隔" @on-search="searchClick" />
										</FormItem>
										<!-- 生产批次 -->
										<FormItem :label="$t('lotCode')" prop="lotCode">
											<Input v-model.trim="req.lotCode" :placeholder="$t('pleaseEnter') + $t('lotCode')" @on-search="searchClick" />
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/store-tag-data";
import { getButtonBoolean, formatDate, commaSplitString, exportFile, renderDate } from "@/libs/tools";

export default {
	name: "store-tag-data",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				startTime: "",
				endTime: "",
				pn: "",
				rid: "",
				lotCode: "",
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
				{ title: this.$t("rId"), key: "rid", align: "center", width: 200, tooltip: true },
				{ title: this.$t("pn"), key: "pn", align: "center", width: 140, tooltip: true },
				{ title: "规格描述", key: "description", align: "center", width: 250, tooltip: true },
				{ title: this.$t("dateCode"), key: "dateCode", align: "center", width: 90, tooltip: true },
				{ title: this.$t("lotCode"), key: "lotCode", align: "center", width: 90, tooltip: true },
				{ title: "入库数量", key: "qty", align: "center", width: 80, tooltip: true },
				{ title: this.$t("binCode"), key: "binCode", align: "center", width: 80, tooltip: true },
				{ title: this.$t("forkType"), key: "forkType", align: "center", width: 80, tooltip: true },
				{ title: this.$t("grade"), key: "humidityLevel", align: "center", width: 80, tooltip: true },
				{ title: this.$t("freezeDate"), key: "createDate", align: "center", width: 120, tooltip: true, render: renderDate },
				{ title: "员工姓名", key: "createUsername", align: "center", width: 100, tooltip: true },
				{ title: this.$t("remark"), key: "remark", align: "center", width: 120, tooltip: true },
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
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			let { startTime, endTime, pn, rid, lotCode } = this.req;
			if ((startTime && endTime) || pn || rid || lotCode) {
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						this.tableConfig.loading = true;
						let obj = {
							orderField: "rid", // 排序字段
							ascending: true, // 是否升序
							pageSize: this.req.pageSize, // 分页大小
							pageIndex: this.req.pageIndex, // 当前页码
							data: {
								startTime: formatDate(startTime),
								endTime: formatDate(endTime),
								pn,
								rid: commaSplitString(rid).join(),
								lotCode,
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
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
		},
		// 导出
		exportClick() {
			let { startTime, endTime, pn, rid, lotCode } = this.req;
			if ((startTime && endTime) || pn || rid || lotCode) {
				let obj = {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					pn,
					rid: commaSplitString(rid).join(),
					lotCode,
				};
				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("store-tag-data")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
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
