/* FA报表 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="500" trigger="manual" transfer>
								<Button @click.stop="poptipModal = !poptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<!-- @submit.native.prevent @keyup.native.enter="searchClick" -->
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true">
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
										<!-- SN -->
										<FormItem label="SN" prop="unitId">
											<Input v-model.trim="req.unitId" :placeholder="$t('pleaseEnter') + 'SN'" @keyup.native.enter="searchClick" />
										</FormItem>
										<!-- 线别 -->
										<!-- 线体 -->
										<FormItem :label="$t('line')" prop="lineName">
											<Select
												v-model="req.lineName"
												clearable
												transfer
												filterable
												label-in-value
												multiple
												@on-select="lineSelect"
												:placeholder="`${$t('pleaseSelect')}${$t('line')}`"
											>
												<Option v-for="(item, i) in lineList" :value="item.name" :key="i">{{ item.name }}</Option>
											</Select>
										</FormItem>
										<!-- 机种 -->
										<FormItem :label="$t('model')" prop="modelName">
											<v-selectpage
												class="select-page-style"
												ref="modelName"
												v-if="poptipModal"
												key-field="modelName"
												show-field="modelName"
												:data="modelPageListUrl"
												v-model="req.modelName"
												:placeholder="$t('pleaseSelect') + $t('model')"
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
												@keyup.native.enter="searchClick"
												:placeholder="$t('pleaseEnter') + $t('panelNo')"
											/>
										</FormItem>
										<!-- 不良原因 -->
										<FormItem :label="$t('badCause')" prop="failureReason">
											<v-selectpage
												class="select-page-style"
												v-if="poptipModal"
												multiple
												key-field="name"
												show-field="name"
												:data="defectReasonPageListUrl"
												v-model="req.failureReason"
												:placeholder="$t('pleaseSelect') + $t('badCause')"
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
										<!-- 不良现象 -->
										<FormItem :label="$t('badPhenomenon')" prop="errorCode">
											<v-selectpage
												class="select-page-style"
												v-if="poptipModal"
												multiple
												key-field="name"
												show-field="name"
												:data="defectdescPageListUrl"
												v-model="req.errorCode"
												:placeholder="$t('pleaseSelect') + $t('badPhenomenon')"
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
										<!-- LED Bin Code -->
										<FormItem label="LED Bin Code" prop="ledBinCode">
											<Input v-model.trim="req.ledBinCode" :placeholder="$t('pleaseEnter') + 'LED Bin Code'" @keyup.native.enter="searchClick" />
										</FormItem>
										<!-- 机台编号 -->
										<FormItem :label="$t('machineNumber')" prop="epqId">
											<v-selectpage
												class="select-page-style"
												ref="eqpId"
												v-if="poptipModal"
												key-field="enCode"
												show-field="enCode"
												:params="{ category: 'Auto' }"
												:data="eqpPageListUrl"
												v-model="req.epqId"
												:placeholder="$t('pleaseSelect') + $t('machineNumber')"
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
										<!-- 维修设备编号 -->
										<FormItem :label="$t('repair') + $t('eqpCode')" prop="reworkMachineId">
											<Input
												v-model.trim="req.reworkMachineId"
												:placeholder="$t('pleaseEnter') + $t('repair') + $t('eqpCode')"
												@keyup.native.enter="searchClick"
											/>
										</FormItem>
										<!-- 料号 -->
										<FormItem :label="$t('pn')" prop="pn">
											<v-selectpage
												class="select-page-style"
												ref="pn"
												v-if="poptipModal"
												key-field="pn"
												show-field="pn"
												:data="pnPageListUrl"
												v-model="req.pn"
												:placeholder="$t('pleaseSelect') + $t('pn')"
												@values="pnSelectChange"
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
										<!-- 工单 -->
										<FormItem :label="$t('workOrder')" prop="wo">
											<v-selectpage
												multiple
												ref="workOrder"
												v-if="poptipModal"
												class="select-page-style"
												key-field="workOrder"
												show-field="workOrder"
												:data="workerPageListUrl"
												v-model="req.wo"
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
										<!-- 不良站别 -->
										<!-- <FormItem label='不良站别' prop="failureStationName">
                      <Input v-model="req.failureStationName" :placeholder="$t('pleaseEnter') + '不良站别'" @keyup.native.enter="searchClick" />
                    </FormItem> -->
										<!-- 制程 -->
										<FormItem :label="$t('process')" prop="failureStationName">
											<v-selectpage
												class="select-page-style"
												v-if="poptipModal"
												ref="failureStationName"
												multiple
												key-field="name"
												show-field="name"
												:data="processPageListUrl"
												v-model="req.failureStationName"
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
					:span-method="handleSpan"
				>
					<template slot-scope="{ row }" slot="faImage">
						<img class="img_item" @click="imgClick(item)" :src="item" v-for="(item, index) in row.faImage && row.faImage.split(',')" :key="index" />
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
				<Modal draggable v-model="visible" :closable="false"><img class="img-style" :src="imgBase64" /></Modal>
			</Card>
		</div>
	</div>
</template>

<script>
import { getpagelistReq, exportReq, defectdescPageListUrl, defectReasonPageListUrl } from "@/api/bill-manage/fa-report";
import { getButtonBoolean, formatDate, exportFile } from "@/libs/tools";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { pnPageListUrl } from "@/api/basis-info/part-master";
import { modelPageListUrl } from "@/api/basis-info/model-manager";
import { eqpPageListUrl } from "@/api/eqp-manage/eqp-info";
import { processPageListUrl } from "@/api/basis-info/zone-manage";
// import { defectCodePageListUrl } from "@/api/repair-manage/bad-phenomenon";
import { getAreaFloorLineListReq } from "@/api/basis-info/area-floor";

export default {
	name: "fa-report",
	data() {
		return {
			poptipModal: false,
			noRepeatdRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			defectdescPageListUrl: defectdescPageListUrl(),
			defectReasonPageListUrl: defectReasonPageListUrl(),
			workerPageListUrl: workerPageListUrl(),
			pnPageListUrl: pnPageListUrl(),
			modelPageListUrl: modelPageListUrl(),
			eqpPageListUrl: eqpPageListUrl(),
			processPageListUrl: processPageListUrl(),
			req: {
				startTime: "",
				endTime: "",
				unitId: "",
				lineName: [],
				modelName: "",
				errorCode: "",
				ledBinCode: "",
				epqId: "",
				reworkMachineId: "",
				pn: "",
				wo: "",
				failureStationName: "",
				panelNo: "", //大条码
				failureReason: "", // 不良原因描述
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
				{ title: "PROJECTCODE", key: "projectCode", align: "center", width: 150 },
				{ title: "工单", key: "workorder", align: "center", width: 120, tooltip: true },
				{ title: "料号", key: "partId", align: "center", width: 140, tooltip: true },
				{ title: "白夜班", key: "shiftDay", align: "center", width: 150, tooltip: true },
				{ title: "Failure time", key: "failureTime", align: "center", width: 150, tooltip: true },
				{ title: "进FA时间", key: "labCheckIn", align: "center", width: 150, tooltip: true },
				{ title: "Lab Check-Out", key: "labCheckOut", align: "center", width: 150, tooltip: true },
				{ title: "Config", key: "config", align: "center", width: 150, tooltip: true },
				{ title: "线别", key: "line", align: "center", width: 140, tooltip: true },
				{ title: this.$t("panelNo"), key: "panelNo", align: "center", width: 150, tooltip: true },
				{ title: "UnitId", key: "unitId", align: "center", width: 140, tooltip: true },
				{ title: "CarrierNo", key: "carrierNo", align: "center", width: 140, tooltip: true },
				{
					title: "不良站别",
					key: "failureStationName",
					align: "center",
					width: 150,
					tooltip: true,
				},
				{
					title: "PCB wash record",
					key: "pcbWashRecord",
					align: "center",
					width: 150,
					tooltip: true,
				},
				{
					title: "Failure Sympton",
					key: "failureSympton",
					align: "center",
					width: 150,
					tooltip: true,
				},
				{
					title: "Failure Reason",
					key: "failureReason",
					align: "center",
					width: 150,
					tooltip: true,
				},
				{
					title: "Failure Location",
					key: "failureLocation",
					align: "center",
					width: 150,
					tooltip: true,
				},
				{ title: "FA Image", slot: "faImage", align: "center", width: 150, tooltip: true },
				{ title: "EQPNAME", key: "eqpName", align: "center", width: 150, tooltip: true },
				{
					title: "Retest Sympton",
					key: "retestSympton",
					align: "center",
					width: 150,
					tooltip: true,
				},
				{ title: "FA STEP", key: "faStep", align: "center", width: 150, tooltip: true },
				{
					title: "Duty department",
					key: "dutyDepartment",
					align: "center",
					width: 150,
					tooltip: true,
				},
				{ title: "FA mothed", key: "repairMothed", align: "center", width: 150, tooltip: true },
				{ title: "x-Ray Result", key: "xRay", align: "center", width: 150, tooltip: true },
				{
					title: "Rework machine ID",
					key: "reworkMachineId",
					align: "center",
					width: 150,
					tooltip: true,
				},
				{ title: "Scrap", key: "scrap", align: "center", width: 150, tooltip: true },
				{ title: "Scrap reason", key: "scrapReason", align: "center", width: 150, tooltip: true },
				{ title: "Scrap Duty Department", key: "scrapDuty", align: "center", width: 150, tooltip: true },
				{
					title: "FA Employee",
					key: "repairEmployee",
					align: "center",
					width: 150,
					tooltip: true,
				},
				// { title: "Repair complete", key: "repairComplete", align: "center", width: 150, tooltip: true },
			], // 表格数据
			cc: [],
			visible: false,
			imgBase64: "",
			lineList: "",
		};
	},
	computed: {
		selectpageSize() {
			let length = this.req.wo.split(",").length;
			return length > 10 ? length : 10;
		},
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		this.getLineList();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.poptipModal = false;
		next();
	},
	methods: {
		imgClick(url) {
			this.imgBase64 = url;
			this.visible = true;
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
			this.poptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			let {
				startTime,
				endTime,
				unitId,
				lineName,
				modelName,
				errorCode,
				ledBinCode,
				epqId,
				reworkMachineId,
				pn,
				wo,
				failureStationName,
				panelNo, //大条码
				failureReason, // 不良原因描述
			} = this.req;
			if (
				(startTime && endTime) ||
				unitId ||
				lineName ||
				modelName ||
				errorCode ||
				ledBinCode ||
				epqId ||
				reworkMachineId ||
				pn ||
				wo ||
				failureStationName ||
				panelNo ||
				failureReason
			) {
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						this.tableConfig.loading = true;

						let obj = {
							orderField: "unitId", // 排序字段
							ascending: true, // 是否升序
							pageSize: this.req.pageSize, // 分页大小
							pageIndex: this.req.pageIndex, // 当前页码
							data: {
								startTime: formatDate(startTime),
								endTime: formatDate(endTime),
								unitId,
								lineName: lineName?.join(","),
								modelName,
								errorCode,
								ledBinCode,
								epqId,
								reworkMachineId,
								pn,
								wo,
								failureStationName,
								failureReason,
								panelNo,
							},
						};
						getpagelistReq(obj)
							.then((res) => {
								this.tableConfig.loading = false;
								if (res.code === 200) {
									let { data, pageSize, pageIndex, total, totalPage } = res.result;
									this.data =
										data.filter((element) => {
											return element.cc === null;
										}) || [];
									this.cc = data[0].cc || [];
									this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
									this.poptipModal = false;
								}
							})
							.catch(() => (this.tableConfig.loading = false));
					}
				});
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
		},
		handleSpan({ rowIndex, columnIndex }) {
			let cc = this.cc;

			const columnList =
				columnIndex === 1 ||
				columnIndex === 2 ||
				columnIndex === 3 ||
				columnIndex === 4 ||
				columnIndex === 5 ||
				columnIndex === 6 ||
				columnIndex === 7 ||
				columnIndex === 8 ||
				columnIndex === 9 ||
				columnIndex === 10 ||
				columnIndex === 11 ||
				columnIndex === 12 ||
				columnIndex === 13 ||
				columnIndex === 14 ||
				columnIndex === 15 ||
				columnIndex === 16 ||
				columnIndex === 32 ||
				columnIndex === 33 ||
				columnIndex === 34 ||
				columnIndex === 35 ||
				columnIndex === 36;

			for (let i = 0; i < cc.length; i++) {
				for (let o = 0; o < cc[i].bb; o++) {
					if (rowIndex === cc[i].aa - 1 && columnList) {
						return {
							rowspan: cc[i].bb,
							colspan: 1,
						};
					}
					if (rowIndex === cc[i].aa + o - 1 && columnList) {
						return {
							rowspan: 0,
							colspan: 0,
						};
					}
				}
			}
		},
		// 导出
		exportClick() {
			let {
				startTime,
				endTime,
				unitId,
				lineName,
				modelName,
				errorCode,
				ledBinCode,
				epqId,
				reworkMachineId,
				pn,
				wo,
				failureStationName,
				failureReason,
				panelNo,
			} = this.req;
			if (
				(startTime && endTime) ||
				unitId ||
				lineName ||
				modelName ||
				errorCode ||
				ledBinCode ||
				epqId ||
				reworkMachineId ||
				pn ||
				wo ||
				failureStationName ||
				failureReason ||
				panelNo
			) {
				let obj = {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					unitId,
					lineName: lineName?.join(","),
					modelName,
					errorCode,
					ledBinCode,
					epqId,
					reworkMachineId,
					pn,
					wo,
					failureStationName,
					failureReason,
					panelNo,
				};
				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("fa-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
		},
		// 获取线体数据
		async getLineList() {
			const obj = {
				category: 4,
				systemFlag: this.$store.state.systemFlag,
				enabled: 1,
			};
			await getAreaFloorLineListReq(obj).then(async (res) => {
				if (res.code === 200) {
					this.lineList = res.result || [];
				}
			});
		},
		// 获取线体数据
		lineSelect(data) {
			this.req.lineName = data.label;
		},
		// 料号改变触发
		pnSelectChange(data) {
			this.req.pn = data.length ? data[0].pn : "";
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.searchClick();
			this.$nextTick(() => {
				this.poptipModal = true;
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
<style lang="less" scoped>
.img_item {
	width: 30px;
	height: 30px;
	margin-left: 3px;
	cursor: pointer;
}
</style>
