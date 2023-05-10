/* trackout 产能 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="12" style="display: flex">
							<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button @click.stop="poptipModal = !poptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<!-- @submit.native.prevent @keyup.native.enter="searchClick" -->
									<Form ref="searchReq" :model="req" :label-width="70" :label-colon="true">
										<!-- 制程 -->
										<FormItem :label="$t('process')" prop="processId">
											<v-selectpage
												class="select-page-style"
												ref="processId"
												v-if="poptipModal"
												key-field="name"
												show-field="name"
												:data="processPageListUrl"
												v-model="req.processId"
												:placeholder="$t('pleaseSelect') + $t('process')"
												:result-format="
													(res) => {
														return {
															totalRow: res.total,
															list: res.data || [],
														};
													}
												"
											>
											</v-selectpage>
										</FormItem>
										<!-- 大条码 -->
										<FormItem :label="$t('panelNo')" prop="panelNo">
											<Input
												type="textarea"
												:autosize="{ minRows: 1, maxRows: 5 }"
												v-model.trim="req.panelNo"
												:placeholder="$t('pleaseEnter') + $t('panelNo')"
											/>
										</FormItem>
										<FormItem label="UnitInfo 56" prop="unitId56">
											<Input type="textarea" :autosize="{ minRows: 1, maxRows: 5 }" v-model="req.unitId56" />
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
												style="width: 280px"
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
												style="width: 280px"
											></DatePicker>
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
						</i-col>
						<i-col span="12">
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
					<template slot-scope="{ row }" slot="image">
						<Button style="height: 16px" v-if="row.fileFullName" type="primary" size="small" @click="previewImage(row.fileFullName)">{{
							$t("preview")
						}}</Button>
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
		</div>
	</div>
</template>

<script>
import { getpagelistReq, exportReq, processPageListUrl } from "@/api/bill-manage/trackout-capacity";
import { formatDate, getButtonBoolean, renderDate, exportFile } from "@/libs/tools";
// import { processPageListUrl } from "@/api/basis-info/zone-manage";

export default {
	name: "trackout-capacity",
	data() {
		return {
			visible: false,
			poptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			processPageListUrl: processPageListUrl(),
			data: [], // 表格数据
			btnData: [],
			req: {
				processId: "",
				panelNo: "",
				startTime: "",
				endTime: "",
				unitId56: "",
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
				{ title: this.$t("processId"), key: "processId", align: "center", minWidth: 100, ellipsis: true, tooltip: true },
				{ title: this.$t("panelNo"), key: "panelNo", align: "center", minWidth: 100, ellipsis: true, tooltip: true },
				{ title: "unitId56", key: "unitId56", minWidth: 180, ellipsis: true, tooltip: true },
				{ title: this.$t("createDate"), key: "createDate", align: "center", render: renderDate, minWidth: 100, ellipsis: true, tooltip: true },
				{ title: this.$t("dataKey"), key: "dataKey", align: "left", minWidth: 100, ellipsis: true, tooltip: true },
				{ title: this.$t("dataValue"), key: "dataValue", align: "left", minWidth: 140, ellipsis: true, tooltip: true },
			], // 表格数据

			processList: [], //制程
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
		this.poptipModal = false;
		next();
	},
	methods: {
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
			this.poptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			let { processId, panelNo, startTime, endTime, unitId56 } = this.req;
			this.tableConfig.loading = true;
			let obj = {
				orderField: "panelNo", // 排序字段
				ascending: false, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: { processId, panelNo, startTime: formatDate(startTime), endTime: formatDate(endTime), unitId56 },
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
		},

		// 导出
		exportClick() {
			let { processId, panelNo, startTime, endTime, unitId56 } = this.req;
			let obj = {
				orderField: "panelNo", // 排序字段
				ascending: false, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: { processId, panelNo, startTime: formatDate(startTime), endTime: formatDate(endTime), unitId56 },
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("trackout-capacity")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.$refs.processId.remove();
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
