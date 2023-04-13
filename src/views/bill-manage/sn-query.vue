/* SN查询报表 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="500" trigger="manual" transfer>
								<Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
									{{ $t("selectQuery") }}
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<FormItem :label="$t('type')" prop="isHistory">
											<RadioGroup v-model="req.isHistory">
												<Radio :label="false">在线信息</Radio>
												<Radio :label="true">历史信息</Radio>
											</RadioGroup>
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
										<!-- 大板序号 -->
										<FormItem :label="$t('panelNo')">
											<Input v-model.trim="req.panelNo" :placeholder="$t('pleaseEnter') + $t('panelNo') + $t('multiple,separated')"></Input>
										</FormItem>
										<!-- UnitId -->
										<FormItem label="UnitId" prop="unitId">
											<Input v-model.trim="req.unitId" :placeholder="$t('pleaseEnter') + 'UnitId' + $t('multiple,separated')" />
										</FormItem>
										<!-- 线别 -->
										<FormItem label="线别" prop="lineName">
											<Input v-model.trim="req.lineName" :placeholder="$t('pleaseEnter') + '线别'" />
										</FormItem>
										<!-- 料号 -->
										<FormItem :label="$t('pn')" prop="pn">
											<Input v-model.trim="req.pn" :placeholder="$t('pleaseEnter') + $t('pn')" />
										</FormItem>
										<!-- 工单 -->
										<FormItem :label="$t('workOrder')" prop="wo">
											<Input v-model.trim="req.wo" :placeholder="$t('pleaseEnter') + $t('workOrder')" />
										</FormItem>
										<!-- unitId56 -->
										<FormItem label="UnitId56" prop="unitId56">
											<Input v-model.trim="req.unitId56" :placeholder="$t('pleaseEnter') + 'UnitId56'" />
										</FormItem>
										<FormItem label="BuildConfig" prop="buildConfig">
											<Input v-model.trim="req.buildConfig" :placeholder="$t('pleaseEnter') + 'BuildConfig'" />
										</FormItem>
										<FormItem :label="$t('stepName')" prop="curprocessname">
											<Input v-model.trim="req.curprocessname" :placeholder="$t('pleaseEnter') + $t('stepName')" />
										</FormItem>
										<!-- 箱号 -->
										<FormItem label="箱号" prop="cartonNo">
											<Input v-model.trim="req.cartonNo" :placeholder="$t('pleaseEnter') + '箱号'" />
										</FormItem>
										<!-- 当前状态 -->
										<FormItem label="当前状态">
											<Select v-model="req.currentStatus" clearable transfer>
												<Option v-for="(item, index) in currentStatusList" :value="item" :key="index">{{ item }}</Option>
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
				>
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/sn-query";
import { getButtonBoolean, formatDate, exportFile, commaSplitString, limitStrLength } from "@/libs/tools";
export default {
	name: "sn-query",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			currentStatusList: ["Hold", "Pass", "Scrap", "DryBox", "Defect"],
			req: {
				startTime: "",
				endTime: "",
				panelNo: "",
				unitId: "",
				lineName: "",
				pn: "",
				wo: "",
				unitId56: "",
				buildConfig: "",
				curprocessname: "",
				isHistory: false,
				cartonNo: "", //箱号
				currentStatus: "", //当前状态
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
				{ title: "工单", key: "workorder", align: "center", width: 120, tooltip: true },
				{ title: "大板序号", key: "panelNo", align: "center", width: 150 },
				{ title: "UnitId", key: "unitId", align: "center", width: 140, tooltip: true },
				{ title: "成品料号名称", key: "partName", align: "center", width: 140, tooltip: true },
				{ title: "流程名称", key: "routeName", align: "center", width: 150 },
				{ title: "线别名称", key: "lineName", align: "center", width: 140, tooltip: true },
				{
					title: "当前制程名称",
					key: "curProcessName",
					align: "center",
					width: 140,
					tooltip: true,
				},
				{
					title: "操作",
					key: "ruleName",
					align: "center",
					width: 100,
					tooltip: true,
				},
				{
					title: "UnitId56",
					key: "unitId56",
					align: "center",
					width: 140,
					tooltip: true,
				},
				{ title: "工作站（设备ID）", key: "eqpId", align: "center", width: 150 },
				{ title: "下个制程名称", key: "nextProcessName", align: "center", width: 150 },
				{ title: "当前状态", key: "currentStatus", align: "center", width: 70 },
				{ title: "进入制程时间", key: "inProcessTime", align: "center", width: 150 },
				{ title: "离开制程时间", key: "outProcessTime", align: "center", width: 150 },
				{ title: "进入生产线时间", key: "inPdLineTime", align: "center", width: 150 },
				{ title: "离开生产线时间", key: "outPdLineTime", align: "center", width: 150 },
				{ title: "栈板号", key: "palletNo", align: "center", width: 150 },
				{ title: "货柜", key: "container", align: "center", width: 150 },
				{ title: "箱号", key: "cartonNo", align: "center", width: 150 },
				{ title: "抽验编号", key: "qcNo", align: "center", width: 150 },
				{ title: "抽验结果", key: "qcResult", align: "center", width: 70 },
				{ title: "重工号", key: "reworkWo", align: "center", width: 150 },
				{ title: "包装盒/袋子", key: "boxNo", align: "center", width: 150 },
				{ title: "穴位", key: "boardNo", align: "center", width: 70 },
				{ title: "载具", key: "carrier", align: "center", width: 150 },
				{ title: "Cover", key: "cover", align: "center", width: 150 },
				{ title: "Base", key: "base", align: "center", width: 150 },
				{ title: "Magazine", key: "magazine", align: "center", width: 150 },
				{ title: "操作动作", key: "action", align: "center", width: 70 },
				{ title: "X板标识", key: "xFlag", align: "center", width: 70 },
				{ title: "当前制程过站成功数量", key: "splitFlag", align: "center", width: 150 },
				{ title: "分板标识", key: "pcbWashRecord", align: "center", width: 70 },
				{ title: "ledBin", key: "ledBin", align: "center", width: 70 },
				{ title: "holdReason", key: "holdReason", align: "center", width: 150 },
				{ title: "processGrade", key: "processGrade", align: "center", width: 150 },
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
		imgClick(url) {
			window.open(url, "_blank");
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			let { startTime, endTime, unitId, lineName, pn, wo, panelNo, unitId56, buildConfig, curprocessname, isHistory, currentStatus, cartonNo } =
				this.req;
			if ((startTime && endTime) || unitId || lineName || pn || wo || panelNo || unitId56 || buildConfig || curprocessname) {
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						if (limitStrLength(panelNo) || limitStrLength(unitId) || limitStrLength(unitId56)) {
							this.$Msg.error("查询条件超出最大长度2000!");
							this.searchPoptipModal = true;
							return;
						}
						this.tableConfig.loading = true;
						let obj = {
							orderField: "INPROCESSTIME", // 排序字段
							ascending: false, // 是否升序
							pageSize: this.req.pageSize, // 分页大小
							pageIndex: this.req.pageIndex, // 当前页码
							data: {
								startTime: formatDate(startTime),
								endTime: formatDate(endTime),
								panelNo: commaSplitString(panelNo).join(),
								unitId: commaSplitString(unitId).join(),
								lineName,
								pn,
								wo,
								unitId56: commaSplitString(unitId56).join(),
								buildConfig,
								curprocessname,
								isHistory,
								currentStatus,
								cartonNo,
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
						this.searchPoptipModal = false;
					}
				});
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
		},
		// 导出
		exportClick() {
			let { startTime, endTime, unitId, lineName, pn, wo, panelNo, unitId56, buildConfig, curprocessname, isHistory, currentStatus, cartonNo } =
				this.req;
			if ((startTime && endTime) || unitId || lineName || pn || wo || panelNo || unitId56 || buildConfig || curprocessname) {
				if (limitStrLength(panelNo) || limitStrLength(unitId) || limitStrLength(unitId56)) {
					this.$Msg.error("查询条件超出最大长度2000!");
					return;
				}
				let obj = {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					panelNo: commaSplitString(panelNo).join(),
					unitId: commaSplitString(unitId).join(),
					lineName,
					pn,
					wo,
					unitId56: commaSplitString(unitId56).join(),
					buildConfig,
					curprocessname,
					isHistory,
					currentStatus,
					cartonNo,
				};
				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("sn-query")}${formatDate(new Date())}.xlsx`; // 自定义文件名
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
