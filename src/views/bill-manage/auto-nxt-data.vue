/*SN 打件资料 */
<template>
	<div class="page-style" style="height: 100%">
		<Drawer v-model="modalFlag" title="SN 打件资料信息补录" width="650" :mask-closable="false" :before-close="cancelClick">
			<div style="height: calc(100% - 300px)">
				<Input
					v-model="submitData.unitId"
					type="textarea"
					:autosize="{ minRows: 5, maxRows: 10 }"
					placeholder="相同工单一次最多100SN（多个以英文逗号或空格分隔）"
					clearable
				/>
				<div class="drawer-footer">
					<Button style="margin-right: 8px" @click="cancelClick">{{ $t("cancel") }}</Button>
					<Button type="primary" @click="submitClick">{{ $t("ok") }}</Button>
				</div>
				<List header="信息展示列" border v-if="resultList.length > 0" class="info-list">
					<ListItem v-for="(item, index) in resultList" :key="index" :style="{ color: item.state == 'NG' ? 'red' : '' }">{{ item.msg }}</ListItem>
				</List>
			</div>
		</Drawer>
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
										<!-- UnitId -->
										<FormItem label="unitId" prop="unitId">
											<Input v-model="req.unitId" :placeholder="$t('pleaseEnter') + 'unitId'" />
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
							<button-custom :btnData="btnData" @on-add-click="addClick"></button-custom>
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
import { getlistReq, addReq } from "@/api/bill-manage/auto-nxt-data";
import { formatDate, getButtonBoolean, renderDate, commaSplitString } from "@/libs/tools";
export default {
	name: "auto-nxt-data",
	data() {
		return {
			searchPoptipModal: false,
			drawerFlag: false,
			noRepeatRefresh: true,
			modalFlag: false,
			tableConfig: { ...this.$config.tableConfig },
			data: [],
			btnData: [],
			submitData: { unitId: "" },
			resultList: [], //提交结果集
			req: {
				startTime: "",
				endTime: "",
				unitId: "",
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
				{ title: "操作账号", key: "createid", align: "center", minWidth: 180, tooltip: true },
				{ title: "操作时间", key: "createdate", align: "center", minWidth: 100, tooltip: true, render: renderDate },
				{ title: "补录小板码", key: "adD_PANEL_NO", align: "center", minWidth: 140, tooltip: true },
				{ title: "模板小板码", key: "copY_PANEL_NO", align: "center", minWidth: 140, tooltip: true },
				{ title: "补录的脚位数", key: "refdeS_COUNT", align: "center", minWidth: 80, tooltip: true },
				{ title: "补录的发生", key: "copY_TYPE", align: "center", minWidth: 100, tooltip: true },
			],
			// 验证实体
			ruleValidate: {},
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
			this.tableConfig.loading = false;
			const { startTime, endTime, unitId } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;

					const obj = {
						orderField: "createdate", // 排序字段
						ascending: true, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							startTime: formatDate(startTime),
							endTime: formatDate(endTime),
							unitId,
						},
					};
					getlistReq(obj)
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
		addClick() {
			this.modalFlag = true;
		},
		//提交
		submitClick() {
			const obj = {
				unitId: commaSplitString(this.submitData.unitId).join(),
				userId: window.sessionStorage.getItem("userName"),
			};
			addReq(obj).then((res) => {
				if (res.code === 200) {
					this.$Msg.success("提交成功");
					this.searchClick();
					this.cancelClick();
				} else {
					this.$Msg.error(`提交失败,${res.msg}`);
					this.modalFlag = true;
				}
				this.resultList = res?.result || [];
			});
		},
		//关闭弹框
		cancelClick() {
			this.modalFlag = false;
			this.submitData.unitId = "";
			this.resultList = [];
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.$refs.workOrder.remove();
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
<style style="less" scoped>
:deep(.ivu-list-header) {
	font-weight: bold;
	background: #33767c;
	color: #fff;
}
.info-list {
	margin-top: 10px;
	height: calc(100% - 100px);
	overflow: auto;
}
</style>
