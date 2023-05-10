/* 烘烤温度报表 */
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
									<Form
										ref="searchReq"
										:model="req"
										:label-width="80"
										:label-colon="true"
										:rules="ruleValidate"
										@submit.native.prevent
										@keyup.native.enter="searchClick"
									>
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
										<FormItem :label="$t('workOrder')" prop="workorder">
											<v-selectpage
												class="select-page-style"
												key-field="workOrder"
												show-field="workOrder"
												ref="workOrder"
												:data="workerPageListUrl"
												v-model="req.workorder"
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

										<!-- 料号 -->
										<FormItem :label="$t('pn')" prop="partName">
											<Input v-model="req.partName" :placeholder="$t('pleaseEnter') + $t('pn')" />
										</FormItem>
										<!-- Config -->
										<FormItem label="Config" prop="buildConfig">
											<Input v-model="req.buildConfig" :placeholder="$t('pleaseEnter') + 'Config'" />
										</FormItem>
										<!-- 设备ID -->
										<FormItem label="设备ID" prop="eqpID">
											<Input v-model="req.eqpID" :placeholder="$t('pleaseEnter') + '设备ID'" />
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
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
					<template #qty="{ row }">
						<div @click="show(row, 1)" style="color: blue; cursor: pointer">
							{{ row.qty }}
						</div>
					</template>
					<template #panelNoQty="{ row }">
						<Poptip title="PanelNo 条码" :content="panelNos" placement="right-start">
							<div @click="show(row, 2)" style="color: blue; cursor: pointer">
								{{ row.panelNoQty }}
							</div>
						</Poptip>
					</template>
				</Table>
			</Card>
			<FlowInfo :drawerFlag.sync="drawerFlag" :selectObj="selectObj" />
		</div>
	</div>
</template>

<script>
import { getlistReq, getpanelNolistReq } from "@/api/bill-manage/bake-temprature-report";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { formatDate, getButtonBoolean, renderDate } from "@/libs/tools";
import FlowInfo from "./bake-temprature-report/flow-info.vue";
export default {
	name: "bake-temprature-report",
	data() {
		return {
			workerPageListUrl: workerPageListUrl(),
			searchPoptipModal: false,
			drawerFlag: false,
			noRepeatRefresh: true,
			tableConfig: { ...this.$config.tableConfig },
			data: [],
			btnData: [],
			panelNos: null, //条码list
			selectObj: {},
			req: {
				startTime: "",
				endTime: "",
				partName: "",
				workorder: "",
				buildConfig: "",
				eqpID: "",
				...this.$config.pageConfig,
			},
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
				{ title: "日期类型", key: "datecode", align: "center", minWidth: 180, tooltip: true },
				{ title: "班别", key: "shift", align: "center", minWidth: 100, tooltip: true },
				{ title: "料号", key: "partName", align: "center", minWidth: 140, tooltip: true },
				{ title: "站点", key: "curprocessname", align: "center", minWidth: 140, tooltip: true },
				{ title: "数量", slot: "qty", align: "center", minWidth: 80, tooltip: true },
				{ title: "大板数量", slot: "panelNoQty", align: "center", minWidth: 100, tooltip: true },
				{ title: "工单", key: "workorder", align: "center", minWidth: 140, tooltip: true },
				{ title: "Config", key: "buildConfig", align: "center", minWidth: 100, tooltip: true },
				{ title: "设备ID", key: "eqpID", align: "center", minWidth: 140, tooltip: true },
				{ title: "Magazine", key: "magazine", minWidth: 160, tooltip: true },
				{ title: "Carrier", key: "carrier", align: "center", minWidth: 160, tooltip: true },
				{ title: "程序名称", key: "programName", align: "center", minWidth: 100, tooltip: true },
				{ title: "烘烤温度", key: "bakingTemprature", align: "center", minWidth: 100, tooltip: true },
				{ title: "烘烤时长", key: "bakingTotalMin", align: "center", minWidth: 100, tooltip: true },
				{ title: "烘烤开始时间", key: "bakingStartTime", align: "center", minWidth: 140, tooltip: true, render: renderDate },
				{ title: "烘烤结束时间", key: "bakingEndTime", align: "center", minWidth: 140, tooltip: true, render: renderDate },
				{ title: "备注", key: "reMark", align: "center", minWidth: 180, tooltip: true },
				{ title: "人员", key: "createusername", align: "center", minWidth: 100, tooltip: true },
			],
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
		// 点击搜索按钮触发
		searchClick() {
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			const { startTime, endTime, workorder, partName, buildConfig, eqpID } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					const obj = {
						startTime: formatDate(startTime),
						endTime: formatDate(endTime),
						workorder,
						partName,
						buildConfig,
						eqpID,
					};
					getlistReq(obj)
						.then((res) => {
							this.tableConfig.loading = false;
							if (res.code === 200) {
								this.data = res.result || [];
							}
						})
						.catch(() => (this.tableConfig.loading = false));
					this.searchPoptipModal = false;
				}
			});
		},
		//1-展示流程卡信息 及 2-panelNo信息
		show(row, type) {
			this.selectObj = { ...row };
			if (type === 1) {
				this.drawerFlag = true;
			}
			if (type === 2) {
				this.panelNos = "";
				let { datecode, partName, workorder, curprocessname, eqpID } = row;
				const startTime = datecode.split("-")[0];
				const endTime = datecode.split("-")[1];
				const obj = {
					startTime: formatDate(`${startTime.substr(0, 4)}-${startTime.substr(4, 2)}-${startTime.substr(6, 2)} ${startTime.substr(8, 2)}:00:00`),
					endTime: formatDate(`${endTime.substr(0, 4)}-${endTime.substr(4, 2)}-${endTime.substr(6, 2)} ${endTime.substr(8, 2)}:00:00`),
					partName,
					workorder,
					curprocessname,
					eqpID,
				};
				getpanelNolistReq(obj).then((res) => {
					if (res.code === 200) {
						res?.result.forEach((item, index) => {
							this.panelNos += `${index + 1}. ${item} \r\n`;
						}) || [];
					}
				});
			}
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.$refs.workOrder.remove();
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 130;
		},
	},
	components: { FlowInfo },
};
</script>
<style style="less" scoped>
:deep(.ivu-poptip-body-content-inner) {
	color: #515a6e;
	white-space: pre-line;
	padding: 5px;
	text-align: left;
}
</style>
