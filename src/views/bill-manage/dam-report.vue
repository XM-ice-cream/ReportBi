/* Dam 点胶看板 */
<template>
	<div class="page-style dam-report">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="340" trigger="manual">
						<Button @click.stop="poptipModal = !poptipModal">
							<Icon type="ios-funnel" />
						</Button>
						<div class="poptip-style-content" slot="content">
							<Form class="poptip-style-content" ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent>
								<!-- 开始日期 -->
								<FormItem :label="$t('startTime')" prop="startTime">
									<DatePicker
										transfer
										v-model="req.startTime"
										type="datetime"
										:options="$config.datetimeOptions"
										:placeholder="$t('pleaseSelect') + $t('startTime')"
									></DatePicker>
								</FormItem>
								<!-- 结束日期 -->
								<FormItem :label="$t('endTime')" prop="endTime">
									<DatePicker
										transfer
										v-model="req.endTime"
										type="datetime"
										:options="$config.datetimeOptions"
										:placeholder="$t('pleaseSelect') + $t('endTime')"
									></DatePicker>
								</FormItem>
								<!-- 制程 -->
								<FormItem :label="$t('process')" prop="stepName">
									<v-selectpage
										class="select-page-style"
										ref="stepName"
										v-if="poptipModal"
										key-field="name"
										show-field="name"
										:data="processPageListUrl"
										v-model="req.stepName"
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
								<!-- 线体 -->
								<FormItem :label="$t('line')" prop="lineName">
									<!-- <Input type="text" v-model="req.lineName" clearable /> -->
									<Select v-model="req.lineName" filterable clearable :placeholder="$t('pleaseSelect') + $t('line')">
										<Option v-for="(item, index) in lineList" :value="item.name" :key="index">{{ item.name }}</Option>
									</Select>
								</FormItem>
								<!-- 料号 -->
								<FormItem :label="$t('pn')" prop="pn">
									<v-selectpage
										ref="pn"
										class="select-page-style"
										v-if="poptipModal"
										key-field="id"
										show-field="pn"
										:data="pnPageListUrl"
										v-model="req.pn"
										:placeholder="$t('pleaseSelect') + $t('pn')"
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
								<!-- 设备 -->
								<FormItem :label="$t('equipment')" prop="eqpId">
									<v-selectpage
										class="select-page-style"
										ref="eqpId"
										v-if="poptipModal"
										key-field="enCode"
										show-field="enCode"
										:data="eqpPageListUrl"
										v-model="req.eqpId"
										:placeholder="$t('pleaseSelect') + $t('equipment')"
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
								<!-- 工单ID -->
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

								<div class="poptip-style-button">
									<Button @click="resetClick">{{ $t("reset") }}</Button>
									<Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
								</div>
							</Form>
						</div>
					</Poptip>
				</div>
				<!-- 图表 -->
				<div class="dam-charts">
					<!-- 柱状图 -->
					<div class="left-chart">
						<BarDam ref="barDam" :data="barData" index="BarDam" />
					</div>
					<!-- 饼图 -->
					<div class="right-chart">
						<PieDam ref="pieDam" :data="pieData" index="PieDam" />
					</div>
				</div>
				<div class="export">
					<span @click="exportClick">{{ $t("export") }}</span>
				</div>

				<!-- 页面表格 -->
				<Table border :height="tableHeight" :loading="tableLoading" :columns="columns" :data="data" highlight-row> </Table>
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
import { pnPageListUrl } from "@/api/basis-info/part-master";
import { eqpPageListUrl } from "@/api/eqp-manage/eqp-info";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { processPageListUrl } from "@/api/basis-info/zone-manage";
import { getlistReq, getBarDataReq, getPieDataReq, exportReq, getlinelistReq } from "@/api/bill-manage/dam-report";
import { formatDate, exportFile } from "@/libs/tools";
import PieDam from "@/components/echarts/pie-dam";
import BarDam from "@/components/echarts/bar-dam";

export default {
	name: "dam-report",
	components: { PieDam, BarDam },
	data() {
		return {
			pnPageListUrl: pnPageListUrl(),
			eqpPageListUrl: eqpPageListUrl(),
			workerPageListUrl: workerPageListUrl(),
			processPageListUrl: processPageListUrl(),
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			tableHeight: 340,
			tableLoading: false, // table加载动画
			poptipModal: false,
			//   op30Time: null, // 定时器
			data: [], // 表格数据
			columns: [
				{
					type: "index",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: this.$t("dateRange"), key: "dateTime", align: "center", minWidth: 300 },
				{ title: this.$t("eqpId"), key: "eqpId", align: "center", minWidth: 140 },
				{ title: this.$t("lineName"), key: "lineName", align: "center", minWidth: 140 },
				{ title: this.$t("pn"), key: "pn", align: "center", minWidth: 140 },
				{ title: this.$t("stepName"), key: "stepName", align: "center", minWidth: 100 },
				{ title: this.$t("workOrder"), key: "workOrder", align: "center", minWidth: 100 },
				{ title: this.$t("defect"), key: "defect", align: "center", minWidth: 50 },
				{ title: "Pass", key: "pass", align: "center", minWidth: 50 },
				{ title: "Rate", key: "rate", align: "center", minWidth: 50 },
				{ title: this.$t("scrap"), key: "scrap", align: "center", minWidth: 50 },
			],
			req: {
				systemFlag: this.$store.state.systemFlag,
				startTime: "", //开始日期
				endTime: "", //结束日期
				lineName: "", //线体
				pn: "", // 料号
				eqpId: "", // 设备
				workOrder: "", // 工单
				stepName: "", // 制程别
				...this.$config.pageConfig,
			},
			pieData: {
				series: [],
				legend: [],
				title: "",
			}, // 饼图数据
			lineList: [],
			barData: {
				xAxisData: [],
				yAxisData1: [],
				yAxisData2: [],
				title: "",
			}, // 柱状图数据
		};
	},
	deactivated() {
		this.poptipModal = false;
	},
	methods: {
		// 获取列表数据
		pageLoad() {
			if (!this.req.startTime) return this.$Msg.warning("选择开始日期");
			if (!this.req.endTime) return this.$Msg.warning("选择结束日期");
			if (!this.req.stepName) return this.$Msg.warning("请选择制程别");
			this.data = [];
			const { startTime, endTime, lineName, pn, eqpId, workOrder, stepName } = this.req;
			let params = {
				orderField: "workOrder", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					lineName,
					pn,
					eqpId,
					workOrder,
					stepName,
				},
			};
			// 获取表格数据
			getlistReq(params).then((res) => {
				if (res.code === 200) {
					res.result.data.map((o) => {
						this.data.push({ ...o, rate: (o.rate * 100).toFixed(2) + "%" });
					});
					let { pageSize, pageIndex, total, totalPage } = res.result;
					this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
					//   this.data = res.result.data;
				}
			});
			// 柱状图数据
			this.getBarData(params.data);
			// 饼图数据
			this.getPieData(params.data);
		},
		// 获取饼图数据
		getPieData(params = {}) {
			(this.pieData = {
				series: [],
				legend: [],
				title: "",
			}), // 饼图数据
				getPieDataReq(params).then((res) => {
					const data = res.result || [];
					data.map((o) => {
						this.pieData.series.push({ name: o.eqpId, value: (o.rate * 100).toFixed(2) });
						this.pieData.legend.push(o.eqpId);
					});
					this.pieData.title = this.req.stepName;
					this.$nextTick(() => this.$refs.pieDam.initChart());
				});
		},
		// 获取柱状图数据
		getBarData(params = {}) {
			(this.barData = {
				xAxisData: [],
				yAxisData1: [],
				yAxisData2: [],
				title: "",
			}), // 柱状图数据
				getBarDataReq(params).then((res) => {
					const data = res.result || [];
					this.barData.xAxisData = data.map((o) => o.eqpId);
					this.barData.yAxisData1 = data.map((o) => o.pass);
					this.barData.yAxisData2 = data.map((o) => (o.rate * 100).toFixed(2));
					this.barData.title = this.req.stepName;
					this.$nextTick(() => this.$refs.barDam.initChart());
				});
		},
		// 导出
		exportClick() {
			const { startTime, endTime, lineName, pn, eqpId, workOrder, stepName } = this.req;
			let params = {
				orderField: "workOrder", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					lineName,
					pn,
					eqpId,
					workOrder,
					stepName,
				},
			};
			exportReq(params).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("dam-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		// 获取线体数据
		getLineList() {
			const { ascending, pageSize, pageIndex } = this.req;
			const obj = {
				orderField: "name",
				ascending,
				pageSize,
				pageIndex,
				total: 0,
				data: {
					enabled: 0,
					pageSize: 0,
					pageNumber: 0,
					name: "",
					searchKey: "name",
					searchValue: "",
				},
			};
			getlinelistReq(obj).then((res) => {
				if (res.code === 200) {
					this.lineList = res.result.data || {};
				}
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.$refs.workOrder.remove();
			this.$refs.stepName.remove();
			this.$refs.pn.remove();
			this.$refs.eqpId.remove();
		},
		// 点击搜索按钮触发
		searchClick() {
			this.poptipModal = false;
			this.pageLoad();
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
	mounted() {
		this.getLineList();
	},
};
</script>
<style scoped lang="less">
.dam-report {
	width: 100%;
	height: 100%;
	.dam-charts {
		display: flex;
		justify-content: flex-start;
		width: 100%;
		height: 400px;
		overflow: hidden;
		.left-chart {
			width: 50%;
			height: 100%;
		}
		.right-chart {
			width: 50%;
			height: 100%;
		}
	}
}

@media screen and (max-width: 1400px) {
	.card-style .ivu-card-body {
		height: auto;
	}
	.card-style {
		/* height: calc(100%); */
		height: auto;
	}
	.dam-report {
		width: 100%;
		height: 100%;
		.dam-charts {
			display: block;
			height: 800px;
			width: 100%;
			.left-chart {
				width: 100%;
				height: 50%;
			}
			.right-chart {
				width: 100%;
				height: 50%;
			}
		}
	}
}

.export {
	width: 100%;
	overflow: hidden;
	span {
		display: inline-block;
		width: 58px;
		height: 22px;
		float: right;
		text-align: center;
		line-height: 22px;
		background: #35945d;
		color: white;
		border-radius: 3px;
		margin-bottom: 5px;
		cursor: pointer;
	}
}
</style>
