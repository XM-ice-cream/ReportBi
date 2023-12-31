/* KeyParts预警配置 */
<template>
	<div class="page-style">
		<!-- 右侧抽屉 Form表单 -->
		<Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
			<Form ref="submitData" :model="submitData" :label-width="120" @submit.native.prevent>
				<!-- 机种 -->
				<FormItem :label="$t('modelName')" prop="modelName">
					<Input v-model="submitData.modelName" :placeholder="$t('pleaseEnter') + $t('modelName')" />
				</FormItem>
				<!-- 站点 -->
				<FormItem label="站点" prop="stationName">
					<Input v-model="submitData.stationName" :placeholder="$t('pleaseEnter') + '站点'" />
				</FormItem>
				<!-- 脚位 -->
				<FormItem label="脚位" prop="infoCode">
					<Input v-model="submitData.infoCode" :placeholder="$t('pleaseEnter') + '脚位'" />
				</FormItem>
				<!-- 预警值-->
				<FormItem label="预警值" prop="alertValue">
					<InputNumber v-model.trim="submitData.alertValue" :placeholder="$t('pleaseEnter') + '预警值'" />
				</FormItem>
				<!-- Enabled-->
				<FormItem :label="$t('enabled')" prop="enabled">
					<i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
						<span slot="open">{{ $t("open") }}</span>
						<span slot="close">{{ $t("close") }}</span>
					</i-switch>
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
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
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
										<!-- 机种 -->
										<FormItem :label="$t('modelName')" prop="modelName">
											<Input v-model="req.modelName" :placeholder="$t('pleaseEnter') + $t('modelName')" />
										</FormItem>
										<!-- 站点 -->
										<FormItem label="站点" prop="stationName">
											<Input v-model="req.stationName" :placeholder="$t('pleaseEnter') + '站点'" />
										</FormItem>
										<!-- 脚位 -->
										<FormItem label="脚位" prop="infoCode">
											<Input v-model.trim="req.infoCode" :placeholder="$t('pleaseEnter') + '脚位'" />
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
							<button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick" @on-delete-click="deleteClick"></button-custom>
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
import { getpagelistReq, addReq, modifyReq, deleteReq } from "@/api/bill-manage/key-part-warning";
import { getButtonBoolean, formatDate, renderDate, renderIsEnabled } from "@/libs/tools";
import { errorType } from "@/libs/tools";

export default {
	name: "key-part-warning",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			drawerFlag: false,
			drawerTitle: "新增",
			isAdd: false,
			selectObj: null, // 表格选中数据
			data: [], // 表格数据
			btnData: [],
			req: {
				startTime: "",
				endTime: "",
				modelName: "", //机种
				stationName: "",
				infoCode: "",
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
				{ title: "机种", key: "modelName", align: "center", minWidth: 140, tooltip: true },
				{ title: "站点", key: "stationName", align: "center", minWidth: 140, tooltip: true },
				{ title: "脚位", key: "infoCode", align: "center", minWidth: 140, tooltip: true },
				{ title: "预警值", key: "alertValue", align: "center", minWidth: 140, tooltip: true },
				{ title: "创建人", key: "createUserName", align: "center", minWidth: 120, tooltip: true },
				{ title: "创建时间", key: "createDate", align: "center", render: renderDate, minWidth: 120, tooltip: true },
				{ title: "修改人", key: "modifyUserName", align: "center", minWidth: 120, tooltip: true },
				{ title: "修改时间", key: "modifyDate", align: "center", render: renderDate, minWidth: 120, tooltip: true },
				{ title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled, width: 80 },
			], // 表格数据
			submitData: {
				modelName: "", //机种名称
				stationName: "", //站点
				infoCode: "", //脚位
				alertValue: 0, //预警值
				enabled: 1, //是否有效
				id: "",
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
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			const { startTime, endTime, modelName, stationName, infoCode } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					let obj = {
						orderField: "modelName", // 排序字段
						ascending: true, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							startTime: formatDate(startTime),
							endTime: formatDate(endTime),
							modelName,
							infoCode,
							stationName,
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
		//提交
		submitClick(isClose = false) {
			this.$refs.submitData.validate((validate) => {
				if (validate) {
					const { modelName, stationName, infoCode, alertValue, enabled, id } = this.submitData;
					const obj = {
						modelName,
						stationName,
						infoCode,
						alertValue,
						enabled,
						id,
					};
					const requestApi = this.isAdd ? addReq : modifyReq;
					requestApi(obj).then((res) => {
						if (res.code === 200) {
							this.$Msg.success(`${this.drawerTitle}${this.$t("success")}`);
							this.pageLoad();
							if (isClose) this.cancelClick();
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
					});
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
				let { modelName, stationName, infoCode, alertValue, enabled, id } = this.selectObj;
				this.submitData = {
					modelName,
					stationName,
					infoCode,
					alertValue,
					enabled,
					id,
				};
				this.isAdd = false;
				this.drawerFlag = true;
				this.drawerTitle = this.$t("edit");
			} else this.$Msg.warning(this.$t("oneData"));
		},
		//删除
		deleteClick() {
			if (this.selectObj) {
				this.$Modal.confirm({
					title: "确认要删除该数据吗?",
					onOk: () => {
						deleteReq({ id: this.selectObj.id }).then((res) => {
							if (res.code === 200) {
								this.$Msg.success("删除成功");
								this.pageLoad();
							}
						});
					},
				});
			} else this.$Msg.warning(this.$t("oneData"));
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
			this.$refs.submitData.resetFields();
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
