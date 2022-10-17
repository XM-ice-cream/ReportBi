/* 产能报表 制程设定 */
<template>
	<div class="page-style">
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
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" :rules="rulesValidate" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 当前流程 -->
										<FormItem label="当前流程" prop="routID">
											<v-selectpage
												class="select-page-style"
												key-field="id"
												ref="routID"
												show-field="name"
												:data="wfPageListUrl"
												v-model="req.routID"
												:placeholder="$t('pleaseSelect') + '当前流程'"
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
							<button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick"></button-custom>
						</i-col>
					</Row>
				</div>
				<Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick"></Table>
			</Card>
		</div>
		<!-- 新增 、编辑 -->
		<AddModify :drawerFlag.sync="drawerFlag" :isAdd="isAdd" :drawerTitle="drawerTitle" :selectObj="selectObj" @pageLoad="pageLoad" />
	</div>
</template>

<script>
import { getlistReq } from "@/api/bill-manage/processname-setting";
import { getButtonBoolean, renderState, formatDate, renderDate, renderIsEnabled } from "@/libs/tools";
import AddModify from "./processname-setting/add-modify.vue";
import { wfPageListUrl } from "@/api/basis-info/wf-route";

export default {
	name: "processname-setting",
	components: { AddModify },
	data() {
		return {
			wfPageListUrl: wfPageListUrl(),
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			drawerFlag: false,
			modalFlag: false, //批量上传
			drawerTitle: "新增",
			isAdd: false,
			selectObj: null, // 表格选中数据
			data: [], // 表格数据
			btnData: [],
			req: {
				routID: "",
			}, //查询数据
			columns: [
				{
					type: "expand",
					width: 30,
					align: "center",
					render: (h, params) => {
						return h(
							"div",
							{
								style: {
									padding: "5px 0 5px 30px",
									backgroundColor: "#fff",
								},
							},
							[
								h("Table", {
									props: {
										border: true,
										columns: this.columns1,
										data: this.data[params.index].processes || [],
										tablekey: 0,
									},
								}),
							]
						);
					},
				},
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
				},
				{ title: "流程", key: "routeID", align: "center", minWidth: 140, tooltip: true },
				// { title: "创建人", key: "createUserName", align: "center", minWidth: 120, tooltip: true },
				// { title: "创建时间", key: "createDate", align: "center", render: renderDate, minWidth: 120, tooltip: true },
				// { title: "修改人", key: "modifyUserName", align: "center", minWidth: 120, tooltip: true },
				// { title: "修改时间", key: "modifyDate", align: "center", render: renderDate, minWidth: 120, tooltip: true },
			], // 表格数据
			columns1: [
				{
					type: "index",
					width: 50,
					align: "center",
					fixed: "left",
					indexMethod: (row) => {
						return row._index + 1;
					},
				},
				{
					title: this.$t("name"),
					key: "processName",
					minWidth: 120,
					tooltip: true,
					align: "center",
				},
				{
					title: "必过站",
					key: "isrequested",
					minWidth: 120,
					tooltip: true,
					align: "center",
					render: (h, params) => {
						let { isrequested } = params.row;
						// repairId ? "#27ce88" : "#cccc00"
						let color = "";
						let name = "";
						if (isrequested) {
							name = "是";
							color = "#27ce88";
						} else {
							name = "否";
							color = "#c0c7c4";
						}
						return renderState(h, color, `${name}`);
					},
				},
			],
			rulesValidate: {
				routID: [
					{
						required: true,
						message: `${this.$t("pleaseSelect")}当前流程`,
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
		this.tableConfig.loading = false;
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
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			const { routID } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					getlistReq({ routID })
						.then((res) => {
							this.tableConfig.loading = false;
							if (res.code === 200) {
								this.data = [res.result] || [];
							}
						})
						.catch(() => (this.tableConfig.loading = false));
					this.searchPoptipModal = false;
				}
			});
		},
		// 点击新增按钮触发
		addClick() {
			this.isAdd = true;
			this.drawerFlag = true;
			this.drawerTitle = this.$t("add");
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				this.isAdd = false;
				this.drawerFlag = true;
				this.drawerTitle = this.$t("edit");
			} else this.$Msg.warning(this.$t("oneData"));
		},
		// 右侧弹窗打开
		importClick() {
			this.modalFlag = true;
		},
		// 某一行高亮时触发
		currentClick(currentRow) {
			this.selectObj = currentRow;
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.$refs.routID.remove();
		},
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
			this.modalFlag = false;
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 120 - 60;
		},
	},
};
</script>
