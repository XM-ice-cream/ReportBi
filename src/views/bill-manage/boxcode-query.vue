/* 箱号查询报表 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="800" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 箱号 -->
										<FormItem :label="$t('cartonCode')" prop="boxCode">
											<Input
												v-model="req.boxCode"
												:placeholder="$t('pleaseEnter') + $t('cartonCode')"
												type="textarea"
												:autosize="{ minRows: 1, maxRows: 20 }"
												@on-search="searchClick"
											/>
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/boxcode-query";
import { getButtonBoolean, formatDate, exportFile } from "@/libs/tools";

export default {
	name: "boxcode-query",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				boxCode: "",
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
				{ title: "PW", key: "pw", align: "center", width: 120, tooltip: true, fixed: "left" },
				{ title: this.$t("cartonCode"), key: "boxNo", align: "center", width: 140, tooltip: true },
				{ title: "SubUnitId", key: "subUnitid", align: "center", width: 200, tooltip: true },
			], // 表格数据
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		this.getDataItemData();
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
			let { boxCode } = this.req;
			if (boxCode) {
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						this.tableConfig.loading = true;
						let obj = {
							orderField: "BOXNO", // 排序字段
							ascending: true, // 是否升序
							pageSize: this.req.pageSize, // 分页大小
							pageIndex: this.req.pageIndex, // 当前页码
							data: {
								boxCode,
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
				this.$Msg.warning(this.$t("pleaseEnter") + this.$t("cartonCode"));
			}
		},
		// 导出
		exportClick() {
			let { boxCode } = this.req;
			if (boxCode) {
				let obj = {
					boxCode,
				};
				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("boxcode-query")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning(this.$t("pleaseEnter") + this.$t("cartonCode"));
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
