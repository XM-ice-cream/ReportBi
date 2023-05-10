/* Bom报表 */
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
										<!-- 工单 -->
										<FormItem :label="$t('workOrder')" prop="workOrder">
											<Input v-model="req.workOrder" :placeholder="$t('pleaseEnter') + $t('workOrder')" @on-search="pageLoad" />
										</FormItem>
										<!-- 大条码 -->
										<FormItem :label="$t('panelNo')" prop="panel">
											<Input v-model.trim="req.panel" placeholder="请输入大板码号,多个以英文逗号或空格分隔" />
										</FormItem>
										<!-- 小条码 -->
										<FormItem :label="$t('smallBoardCode')" prop="unitId">
											<Input v-model.trim="req.unitId" :placeholder="$t('pleaseEnter') + $t('smallBoardCode')" />
										</FormItem>
										<!-- DateCode -->
										<FormItem label="DateCode" prop="dateCode">
											<Input v-model.trim="req.dateCode" :placeholder="$t('pleaseEnter') + 'DateCode'" />
										</FormItem>
										<!-- LotCode -->
										<FormItem label="LotCode" prop="lotCode">
											<Input v-model.trim="req.lotCode" :placeholder="$t('pleaseEnter') + 'LotCode'" />
										</FormItem>
										<!-- ReelId -->
										<FormItem label="ReelId" prop="reelId">
											<Input v-model.trim="req.reelId" :placeholder="$t('pleaseEnter') + 'ReelId'" />
										</FormItem>
										<!-- 类别 -->
										<FormItem :label="$t('category')" prop="category">
											<Select v-model="req.category" clearable :placeholder="$t('pleaseSelect') + $t('category')" transfer>
												<Option v-for="(item, i) in categoryList" :value="item.detailName" :key="i">{{ item.detailName }} </Option>
											</Select>
										</FormItem>
										<!-- 脚位 -->
										<FormItem :label="$t('footPosition')" prop="electricalreference">
											<Input v-model.trim="req.electricalreference" :placeholder="$t('pleaseEnter') + $t('footPosition')" />
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/bom-report-lz";
import { getButtonBoolean, formatDate, exportFile, limitStrLength, commaSplitString } from "@/libs/tools";
import { getlistReq as getDataItemReq } from "@/api/system-manager/data-item";

export default {
	name: "bom-report-lz",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			categoryList: [], // 类别下拉框
			req: {
				startTime: "",
				endTime: "",
				workOrder: "", //工单
				panel: "",
				unitId: "",
				dateCode: "",
				lotCode: "",
				reelId: "",
				category: "",
				electricalreference: "",
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
				{ title: this.$t("panelNo"), key: "pcbId", align: "center" },
				{ title: "BinCode", key: "binCode", align: "center" },
				{ title: this.$t("pn"), key: "pn", align: "center" },
				{ title: this.$t("footPosition"), key: "electricalreference", align: "center" },
				{ title: "ReelId", key: "wafeRid", align: "center" },
				{ title: this.$t("row"), key: "rowNo", align: "center", width: 60 },
				{ title: this.$t("column"), key: "columnNo", align: "center", width: 60 },
				{ title: "LotCode", key: "lotCode", align: "center" },
				{ title: "DateCode", key: "dateCode", align: "center" },
				{ title: this.$t("time"), key: "localTime", align: "center", width: 150 },
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
			let { startTime, endTime, workOrder, panel, unitId, dateCode, lotCode, reelId, category, electricalreference } = this.req;
			if (limitStrLength(panel)) {
				this.$Msg.error("查询条件超出最大长度2000!");
				this.searchPoptipModal = true;
				return;
			}
			if (startTime && endTime) {
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						this.tableConfig.loading = true;
						let obj = {
							orderField: "PN", // 排序字段
							ascending: true, // 是否升序
							pageSize: this.req.pageSize, // 分页大小
							pageIndex: this.req.pageIndex, // 当前页码
							data: {
								startTime: formatDate(startTime),
								endTime: formatDate(endTime),
								workOrder,
								panel: commaSplitString(panel).join(),
								unitId,
								dateCode,
								lotCode,
								reelId,
								category,
								electricalreference,
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
			let { startTime, endTime, workOrder, panel, unitId, dateCode, lotCode, reelId, category, electricalreference } = this.req;
			if (startTime && endTime) {
				if (limitStrLength(panel)) {
					this.$Msg.error("查询条件超出最大长度2000!");
					return;
				}
				let obj = {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					workOrder,
					panel,
					unitId,
					dateCode,
					lotCode,
					reelId,
					category,
					electricalreference,
				};
				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("bom-report-lz")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
		},
		// 获取数据字典数据
		getDataItemData() {
			const obj = { itemCode: "BOMCategory", enabled: 1 };
			getDataItemReq(obj).then((res) => {
				if (res.code === 200) {
					this.categoryList = res.result || [];
				}
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
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
