/* Serin查询 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="12">
							<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="350" trigger="manual">
								<Button type="primary" icon="ios-search" @click.stop="poptipModal = !poptipModal">
									{{ $t("selectQuery") }}
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent>
										<!-- 起始时间 -->
										<FormItem :label="$t('startTime')" prop="startTime">
											<DatePicker
												transfer
												type="datetime"
												:placeholder="$t('pleaseSelect') + $t('startTime')"
												format="yyyy-MM-dd HH:mm:ss"
												:options="$config.datetimeOptions"
												v-model="req.startTime"
											>
											</DatePicker>
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
											>
											</DatePicker>
										</FormItem>
										<!-- 工单 -->
										<FormItem :label="$t('workOrder')" prop="workOrder">
											<v-selectpage
												ref="workOrder"
												class="select-page-style"
												v-if="poptipModal"
												key-field="workOrder"
												show-field="workOrder"
												:data="workerPageListUrl"
												v-model="req.workOrder"
												:placeholder="$t('pleaseSelect') + $t('workOrder')"
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
										<!-- 线体 -->
										<FormItem :label="$t('line')" prop="line">
											<Select v-model="req.line" clearable filterable :placeholder="`${$t('pleaseEnter')}${$t('line')}`">
												<Option v-for="(item, i) in lineList" :value="item.name" :key="i">{{ item.name }}</Option>
											</Select>
										</FormItem>
										<!-- 站点 -->
										<FormItem :label="$t('stepName')" prop="station">
											<Input type="text" v-model="req.station" @on-keyup.enter="searchClick" clearable />
										</FormItem>
										<!-- Config -->
										<FormItem label="Config" prop="config">
											<Input type="text" v-model="req.config" @on-keyup.enter="searchClick" clearable />
										</FormItem>
										<!-- Barcode -->
										<FormItem :label="$t('bigBoardCode')" prop="barcode">
											<Input
												type="text"
												v-model.trim="req.barcode"
												@on-keyup.enter="searchClick"
												clearable
												:placeholder="$t('pleaseEnter') + $t('bigBoardCode') + $t('multiple,separated')"
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
					<template slot-scope="{ row }" slot="sendFlag">
						<span style="color: #43e36c" v-if="row.sendFlag === 'Y'">是</span>
						<span style="color: #ec808d" v-else>否</span>
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/serin-query";
import { initTreeList, renderDate, formatDate, getButtonBoolean, exportFile, commaSplitString } from "@/libs/tools";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { getlisttreeauthReq } from "@/api/basis-info/area-floor";
import { eqpPageListUrl } from "@/api/eqp-manage/eqp-info";

export default {
	name: "serin-query",
	data() {
		return {
			workerPageListUrl: workerPageListUrl(),
			eqpPageListUrl: eqpPageListUrl(),
			poptipModal: false,
			noRepeatRefresh: false, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			req: {
				startTime: "",
				endTime: "",
				workOrder: "", // 工单
				config: "", //Config
				line: "", // 线体
				barcode: "", // 大板码
				station: "", // 站点
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
				{ title: this.$t("workOrder"), key: "workOrder", align: "center" },
				{ title: this.$t("model"), key: "project", align: "center" },
				{ title: this.$t("eqpId"), key: "eq_Id", align: "center", tooltip: true },
				{ title: "Config", key: "config", align: "center", tooltip: true },
				{ title: "APN", key: "apn", align: "center", tooltip: true },
				{ title: this.$t("line"), key: "line", align: "center", tooltip: true },
				{ title: this.$t("stationName"), key: "station", align: "center" },
				{ title: this.$t("bigBoardCode"), key: "barCode", align: "center", tooltip: true },
				{ title: this.$t("rev"), key: "rev", align: "center" },
				{ title: this.$t("totalResult"), key: "total_Result", align: "center" },
				{ title: this.$t("serinState"), key: "state", align: "center" },
				{ title: this.$t("sendFlag"), key: "sendFlag", align: "center", width: 70, slot: "sendFlag" },
				{ title: this.$t("startTime"), key: "startTime", width: 125, align: "center", render: renderDate },
				{ title: this.$t("fileCreateTime"), key: "file_CreateTime", width: 125, align: "center", render: renderDate },
			], // 表格数据
			data: [], // 表格数据
			btnData: [],
			lineList: [], // 线体数据
		};
	},
	mounted() {
		this.pageLoad();
	},
	activated() {
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		this.getLineListData();
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.poptipModal = false;
		next();
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			const { startTime, endTime, workOrder, line, config, barcode, station } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					let obj = {
						orderField: "BarCode", // 排序字段
						ascending: this.req.ascending, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							startTime: formatDate(startTime),
							endTime: formatDate(endTime),
							workOrder,
							line,
							config,
							barcode: commaSplitString(barcode).join(),
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
				}
			});
		},
		// 获取线体数据
		getLineListData() {
			const obj = {
				userId: this.$store.state.id,
				systemFlag: this.$store.state.systemFlag,
				enabled: 1,
			};
			getlisttreeauthReq(obj).then((res) => {
				if (res.code === 200) {
					let arr = [];
					initTreeList(arr, res.result || []);
					this.lineList = arr.filter((o) => o.category === 4);
				}
			});
		},
		// 制程选择操作
		processInput(value) {
			if (!value) {
				this.req.station = "";
			}
		},
		// serin导出
		exportClick() {
			if (!this.req.startTime || !this.req.endTime) return this.$Msg.warning(`${this.$t("pleaseSelect")}${this.$t("timeHorizon")}`);
			const { workOrder, startTime, endTime, station, barcode, line, config } = this.req;
			const obj = {
				workOrder,
				startTime: formatDate(startTime),
				endTime: formatDate(endTime),
				line,
				config,
				barcode: commaSplitString(barcode).join(),
				station,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("serin-query")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		// 点击搜索按钮触发
		searchClick() {
			this.poptipModal = false;
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.$refs.workOrder.remove();
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
