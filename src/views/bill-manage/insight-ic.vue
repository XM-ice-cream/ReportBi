/* Insight IC */
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
										<!-- 客户机种 -->
										<FormItem label="客户机种" prop="customerModelName">
											<Input v-model.trim="req.customerModelName" :placeholder="$t('pleaseEnter') + '客户机种'" />
										</FormItem>
										<!-- IC 脚位 -->
										<FormItem label="IC 脚位" prop="refdes">
											<Input v-model.trim="req.refdes" :placeholder="$t('pleaseEnter') + 'IC 脚位'" />
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
							<button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick" @on-import-click="importClick"></button-custom>
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
		<!-- 新增 、编辑 -->
		<AddModify :drawerFlag.sync="drawerFlag" :isAdd="isAdd" :drawerTitle="drawerTitle" :selectObj="selectObj" @pageLoad="pageLoad" />
		<!-- 批量导入 -->
		<Modal v-model="modalFlag" title="批量导入" @on-cancel="cancelClick">
			<upload-custom
				class="upload-con"
				:uploadUrl="uploadUrl"
				:uploadHeight="33"
				uploadIcon="ios-cloud-upload-outline"
				:uploadFormat="['xlsx']"
				@upload-success="uploadSuccess"
			>
				<div slot="button">
					<Button type="success">{{ $t("clickUpload") }}</Button>
				</div>
			</upload-custom>
		</Modal>
	</div>
</template>

<script>
import { getpagelistReq, attendanceInsightUploadUrl } from "@/api/bill-manage/insight-ic.js";
import { getButtonBoolean, formatDate, renderDate } from "@/libs/tools";
import AddModify from "./insight-ic/add-modify.vue";
import UploadCustom from "@/components/upload-custom";

export default {
	name: "insight-ic",
	components: { AddModify, UploadCustom },
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			uploadUrl: attendanceInsightUploadUrl(),
			drawerFlag: false,
			modalFlag: false, //批量上传
			drawerTitle: "新增",
			isAdd: false,
			selectObj: null, // 表格选中数据
			data: [], // 表格数据
			btnData: [],
			req: {
				modelName: "",
				customerModelName: "",
				refdes: "",
				startTime: "",
				endTime: "",
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
				{ title: "客户机种", key: "customerModelName", align: "center", minWidth: 140, tooltip: true },
				{ title: "IC脚位", key: "refdes", align: "center", minWidth: 140, tooltip: true },
				{ title: "创建人", key: "createUserName", align: "center", minWidth: 120, tooltip: true },
				{ title: "创建时间", key: "createDate", align: "center", render: renderDate, minWidth: 120, tooltip: true },
				{ title: "修改人", key: "modifyUserName", align: "center", minWidth: 120, tooltip: true },
				{ title: "修改时间", key: "modifyDate", align: "center", render: renderDate, minWidth: 120, tooltip: true },
			], // 表格数据
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
			const { startTime, endTime, modelName, customerModelName, refdes } = this.req;
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
							customerModelName,
							refdes,
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
		uploadSuccess() {
			this.searchClick(); //刷新
			this.$Msg.success(`${this.$t("import")}${this.$t("success")}`);
			//关闭弹框
			this.modalFlag = false;
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
