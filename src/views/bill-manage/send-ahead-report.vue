/* SendAheadReport */
<template>
	<div class="page-style">
		<!-- 右侧抽屉 Form表单 -->
		<Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
			<Form ref="submitData" :model="submitData" :rules="ruleValidate" :label-width="120" :label-colon="true" @submit.native.prevent>
				<!-- 工单 -->
				<FormItem label="工单" prop="wo">
					<Input v-model="submitData.wo" :placeholder="$t('pleaseEnter') + '工单'" />
				</FormItem>
				<!-- 料号 -->
				<FormItem label="料号" prop="ipn">
					<Input v-model="submitData.ipn" :placeholder="$t('pleaseEnter') + '料号'" disabled />
				</FormItem>
				<!-- 仓位 -->
				<FormItem label="仓位" prop="wareHouse">
					<Input v-model="submitData.wareHouse" :placeholder="$t('pleaseEnter') + '仓位'" disabled />
				</FormItem>
				<!-- 工厂 -->
				<FormItem label="工厂" prop="factory">
					<Input v-model="submitData.factory" :placeholder="$t('pleaseEnter') + '工厂'" disabled />
				</FormItem>
				<!-- LC -->
				<FormItem label="LC" prop="lc">
					<Input v-model="submitData.lc" :placeholder="$t('pleaseEnter') + 'LC'" disabled />
				</FormItem>
				<!-- DC -->
				<FormItem label="DC" prop="dc">
					<Input v-model="submitData.dc" :placeholder="$t('pleaseEnter') + 'DC'" disabled />
				</FormItem>

				<!-- 按钮 -->
				<FormItem>
					<drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
				</FormItem>
			</Form>
		</Drawer>
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
									{{ $t("selectQuery") }}
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
										<FormItem label="工单" prop="wo">
											<Input v-model="req.wo" :placeholder="$t('pleaseEnter') + '工单'" />
										</FormItem>
										<!-- 脚位 -->
										<FormItem label="脚位" prop="location">
											<Input v-model="req.location" :placeholder="$t('pleaseEnter') + '脚位'" />
										</FormItem>
										<!-- LC -->
										<FormItem label="LC" prop="lc">
											<Input v-model="req.lc" :placeholder="$t('pleaseEnter') + 'LC'" />
										</FormItem>
										<!-- DC -->
										<FormItem label="DC" prop="dc">
											<Input v-model="req.dc" :placeholder="$t('pleaseEnter') + 'DC'" />
										</FormItem>
										<!-- 料号 -->
										<FormItem label="料号" prop="ipn">
											<Input v-model="req.ipn" :placeholder="$t('pleaseEnter') + '料号'" />
										</FormItem>
										<!-- 组 -->
										<FormItem label="组" prop="groupID">
											<Input v-model="req.groupID" :placeholder="$t('pleaseEnter') + '组'" />
										</FormItem>
										<!-- 状态 -->
										<FormItem label="状态" prop="status">
											<Select v-model="req.status" clearable filterable :placeholder="$t('pleaseSelect') + '状态'" transfer>
												<Option v-for="(item, i) in statusList" :value="item.detailName" :key="i">
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
							<button-custom
								:btnData="btnData"
								@on-hold-click="holdClick"
								@on-unhold-click="unholdClick"
								@on-group-click="groupClick"
								@on-export-click="exportClick"
							></button-custom>
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
					@on-current-change="currentClick"
					@on-selection-change="selectClick"
				>
					<!-- 操作 -->
					<template slot-scope="{ row }" slot="operator">
						<div class="tableBtn" @click="lcwo(row)">LC-WO</div>
					</template></Table
				>
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
		<!-- HOLD/UNHOLD -->
		<Modal v-model="modalFlag" :title="isHold ? 'HOLD' : 'UNHOLD'" width="800" :mask="false" :mask-closable="false" @on-cancel="modalFlag = false">
			<Input v-model="mark" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }" placeholder="Please Input introduction" />
			<template #footer>
				<Button @click="modalFlag = false">关闭</Button>
				<Button @click="modalSubmitClick">提交</Button>
			</template>
		</Modal>
		<!-- 组 -->
		<Modal v-model="groupModalFlag" title="Group" width="800" :mask="false" :mask-closable="false" @on-cancel="groupModalFlag = false">
			Group:<Input type="text" disabled placeholder="格式：YYYYMMDD-01(例如：20221228-01)" />
			<span>tips:GROUP编码系统自动生成</span>
			<template #footer>
				<Button @click="groupModalFlag = false">关闭</Button>
				<Button @click="groupSubmitClick">提交</Button>
			</template>
		</Modal>
	</div>
</template>

<script>
import { getpagelistReq, holdReq, groupReq, lclinkwoReq, exportReq } from "@/api/bill-manage/send-ahead-report";
import { getButtonBoolean, formatDate, exportFile } from "@/libs/tools";
import { errorType } from "@/libs/tools";
import { getlistReq as getDataItemReq } from "@/api/system-manager/data-item";

export default {
	name: "send-ahead-report",
	components: {},
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			modalFlag: false, //批量上传
			drawerFlag: false,
			groupModalFlag: false,
			drawerTitle: "LC-WO",
			isHold: false,
			selectObj: null, // 表格选中数据
			data: [], // 表格数据
			btnData: [],
			statusList: [], // 部门下拉框
			selectArr: [],
			mark: "", //hold/unhold备注
			req: {
				startTime: "",
				endTime: "",
				wo: "",
				location: "",
				lc: "",
				dc: "",
				ipn: "",
				groupID: "",
				status: "",
				...this.$config.pageConfig,
			}, //查询数据
			columns: [
				{
					type: "selection",
					width: 60,
					align: "center",
					fixed: "left",
				},
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
					fixed: "left",
				},
				{ title: "Operator", slot: "operator", align: "center", minWidth: 100, tooltip: true, fixed: "left" },
				{ title: "status", key: "status", align: "center", minWidth: 100, tooltip: true, fixed: "left" },
				{ title: "机种", key: "project", align: "center", minWidth: 100, tooltip: true, fixed: "left" },
				{ title: "脚位", key: "location", align: "center", minWidth: 100, tooltip: true, fixed: "left" },
				{ title: "工单", key: "wo", align: "center", minWidth: 100, tooltip: true, fixed: "left" },
				{ title: "料号", key: "ipn", align: "center", minWidth: 100, tooltip: true, fixed: "left" },
				{ title: "LC", key: "lc", align: "center", minWidth: 100, tooltip: true, fixed: "left" },
				{ title: "DC", key: "dc", align: "center", minWidth: 100, tooltip: true, fixed: "left" },
				{ title: "分组标识", key: "groupID", align: "center", minWidth: 100, tooltip: true, fixed: "left" },
				{ title: "记第几周", key: "week", align: "center", minWidth: 100, tooltip: true, fixed: "left" },
				{ title: "仓位", key: "wareHouse", align: "center", tooltip: true, width: 80 },
				{ title: "工厂", key: "factory", align: "center", minWidth: 100, tooltip: true },
				{ title: "ReelID", key: "reel", align: "center", minWidth: 200, tooltip: true },
				{ title: "预警值", key: "dppmLimit", align: "center", minWidth: 200, tooltip: true },
				{ title: "Fail数量", key: "failQty", align: "center", minWidth: 200, tooltip: true },
				{ title: "投入数量", key: "inputQty", align: "center", minWidth: 200, tooltip: true },
				{ title: "产出数量", key: "outputQty", align: "center", minWidth: 200, tooltip: true },
				{ title: "MP_DPPM", key: "mP_DPPM", align: "center", minWidth: 200, tooltip: true },
				{ title: "udfInspection", key: "udfInspection", align: "center", minWidth: 200, tooltip: true },
				{ title: "panelDFU", key: "panelDFU", align: "center", minWidth: 200, tooltip: true },
				{ title: "postMoldFct", key: "postMoldFct", align: "center", minWidth: 200, tooltip: true },
				{ title: "burnIn", key: "burnIn", align: "center", minWidth: 200, tooltip: true },
				{ title: "wifiBtCal", key: "wifiBtCal", align: "center", minWidth: 200, tooltip: true },
				{ title: "cellCal", key: "cellCal", align: "center", minWidth: 200, tooltip: true },
				{ title: "cellTest", key: "cellTest", align: "center", minWidth: 200, tooltip: true },
				{ title: "sCond", key: "sCond", align: "center", minWidth: 200, tooltip: true },
				{ title: "aCond", key: "aCond", align: "center", minWidth: 200, tooltip: true },
				{ title: "t269Cond", key: "t269Cond", align: "center", minWidth: 200, tooltip: true },
				{ title: "wifiBtTest", key: "wifiBtTest", align: "center", minWidth: 200, tooltip: true },
				{ title: "wifiAssoc", key: "wifiAssoc", align: "center", minWidth: 200, tooltip: true },
				{ title: "gateKeeper", key: "gateKeeper", align: "center", minWidth: 200, tooltip: true },
				{ title: "备注", key: "remark", align: "center", minWidth: 200, tooltip: true },
			], // 表格数据
			submitData: {
				wo: "",
				wareHouse: "",
				lc: "",
				dc: "",
				ipn: "",
				factory: "",
			},
			ruleValidate: {
				wo: [{ required: true, message: "工单必填", trigger: "blur" }],
			},
		};
	},
	mounted() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		this.tableConfig.loading = false;
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
			this.selectObj = null;
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			const { startTime, endTime, wo, location, lc, dc, ipn, groupID, status } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					let obj = {
						orderField: "wo", // 排序字段
						ascending: false, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							startTime: formatDate(startTime),
							endTime: formatDate(endTime),
							wo,
							location,
							lc,
							dc,
							ipn,
							groupID,
							status,
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
		},
		// 导出
		exportClick() {
			let { startTime, endTime, wo, location, lc, dc, ipn, groupID, status } = this.req;
			let obj = {
				startTime: formatDate(startTime),
				endTime: formatDate(endTime),
				wo,
				location,
				lc,
				dc,
				ipn,
				groupID,
				status,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("send-ahead-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		//删除选择的数据
		selectClick(selection) {
			this.selectArr = selection;
		},
		lcwo(row) {
			this.drawerFlag = true;
			this.submitData = { ...row };
		},

		//提交
		submitClick(isClose = false) {
			this.$refs.submitData.validate((validate) => {
				if (validate) {
					const { id, wo } = this.submitData;
					const obj = {
						id,
						wo,
					};
					lclinkwoReq(obj).then((res) => {
						if (res.code === 200) {
							this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
							this.pageLoad();
							if (isClose) this.cancelClick();
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
					});
				}
			});
		},
		groupSubmitClick() {
			const data = this.selectArr.map((item) => {
				return { id: item.id };
			});
			groupReq(data).then((res) => {
				if (res.code === 200) {
					this.$Message.success("提交成功");
					this.pageLoad();
					this.groupModalFlag = false;
				} else {
					this.$Message.error(`提交失败, ${res.message}`);
				}
			});
		},
		modalSubmitClick() {
			const data = this.selectArr.map((item) => {
				let { factory, wareHouse, dc, lc, ipn, hold_flag, unhold_reasondesc, hold_reasoncode, hold_reasondesc } = item;

				hold_flag = this.isHold ? "Y" : "N";
				if (this.isHold) {
					hold_reasondesc = this.mark;
				} else {
					unhold_reasondesc = this.mark;
				}
				return {
					plant_code: factory,
					warehouse_code: wareHouse,
					date_code: dc,
					lot_code: lc,
					pn: ipn,
					hold_flag,
					unhold_reasondesc,
					hold_reasoncode,
					hold_reasondesc,
				};
			});
			holdReq(data).then((res) => {
				if (res.code === 200) {
					this.$Message.success("提交成功");
					this.pageLoad();
					this.modalFlag = false;
				} else {
					this.$Message.error(`提交失败, ${res.message}`);
				}
			});
		},
		// 点击新增按钮触发
		holdClick() {
			if (this.selectArr.length > 0) {
				this.mark = "";
				this.isHold = true;
				this.modalFlag = true;
			} else this.$Msg.warning(this.$t("oneData"));
		},
		// 点击编辑按钮触发
		unholdClick() {
			if (this.selectArr.length > 0) {
				this.mark = "";
				this.isHold = false;
				this.modalFlag = true;
			} else this.$Msg.warning(this.$t("oneData"));
		},
		groupClick() {
			if (this.selectArr.length > 0) {
				this.groupModalFlag = true;
			} else this.$Msg.warning(this.$t("oneData"));
		},
		// 获取业务数据
		async getDataItemData() {
			this.statusList = await this.getDataItemDetailList("SendAheadStatus");
		},
		// 获取数据字典数据
		async getDataItemDetailList(itemCode) {
			let arr = [];
			await getDataItemReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) {
					arr = res.result || [];
				}
			});
			return arr;
		},
		// 某一行高亮时触发
		currentClick(currentRow) {
			this.selectObj = currentRow;
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
		},
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
			this.modalFlag = false;
			this.$refs.submitData.resetFields();
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
<style scoped lang="less">
.tableBtn {
	display: inline-block;
	padding: 0.2rem;
	color: #1890ff;
	background: #f5f5f5;

	border-radius: 0.2rem;
	box-shadow: 0px 2px 3px #ccc;
	cursor: pointer;
	&:active {
		background: #40e49f;
		color: #fff;
		box-shadow: none;
	}
}
</style>
