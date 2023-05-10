/* 测试良率报表 */
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
										@submit.native.prevent
										@keyup.native.enter="searchClick"
										:rules="ruleValidate"
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
												@on-change="changeSelectPage('modelName')"
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
												@on-change="changeSelectPage('modelName')"
											></DatePicker>
										</FormItem>
										<!-- 机种名称 -->
										<FormItem :label="$t('modelName')" prop="modelName">
											<v-selectpage
												class="select-page-style"
												key-field="name"
												show-field="name"
												v-model="req.modelName"
												ref="modelName"
												v-if="isModelName && searchPoptipModal"
												:data="modelPageListUrl"
												:placeholder="$t('pleaseEnter') + $t('modelName')"
												:params="{ startTime: formatDate(req.startTime), endTime: formatDate(req.endTime) }"
												:result-format="
													(res) => {
														return {
															totalRow: res.total,
															list: res.data || [],
														};
													}
												"
												@values="changeSelectPage('projectVersion')"
											>
											</v-selectpage>
										</FormItem>
										<!-- 测试阶段 -->
										<FormItem label="ProjectVersion" prop="projectVersion">
											<v-selectpage
												class="select-page-style"
												key-field="name"
												show-field="name"
												v-model="req.projectVersion"
												ref="projectVersion"
												multiple
												v-if="isProjectVersion && searchPoptipModal"
												:data="projectVersionPageListUrl"
												:placeholder="$t('pleaseEnter') + 'ProjectVersion'"
												:params="{ startTime: formatDate(req.startTime), endTime: formatDate(req.endTime), modelName: req.modelName }"
												:result-format="
													(res) => {
														return {
															totalRow: res.total,
															list: res.data || [],
														};
													}
												"
												@values="changeSelectPage('buildType')"
											>
											</v-selectpage>
										</FormItem>
										<!-- BuildType -->
										<FormItem label="BuildType" prop="buildType">
											<v-selectpage
												class="select-page-style"
												key-field="name"
												show-field="name"
												v-model="req.buildType"
												ref="buildType"
												multiple
												v-if="isBuildType && searchPoptipModal"
												:data="buildTypePageListUrl"
												:placeholder="$t('pleaseEnter') + 'BuildType'"
												:params="{
													startTime: formatDate(req.startTime),
													endTime: formatDate(req.endTime),
													modelName: req.modelName,
													projectVersion: req.projectVersion,
												}"
												:result-format="
													(res) => {
														return {
															totalRow: res.total,
															list: res.data || [],
														};
													}
												"
												@values="changeSelectPage('buildConfig')"
											>
											</v-selectpage>
										</FormItem>
										<!-- Config -->
										<FormItem :label="$t('buildConfig')" prop="buildConfig">
											<v-selectpage
												class="select-page-style"
												key-field="name"
												show-field="name"
												v-model="req.buildConfig"
												ref="buildConfig"
												multiple
												v-if="isBuildConfig && searchPoptipModal"
												:data="configPageListUrl"
												:placeholder="$t('pleaseEnter') + $t('buildConfig')"
												:params="{
													startTime: formatDate(req.startTime),
													endTime: formatDate(req.endTime),
													modelName: req.modelName,
													projectVersion: req.projectVersion,
													buildType: req.buildType,
												}"
												:result-format="
													(res) => {
														return {
															totalRow: res.total,
															list: res.data || [],
														};
													}
												"
												@values="changeSelectPage('workOrder')"
											>
											</v-selectpage>
										</FormItem>
										<!-- WorkOrder -->
										<FormItem :label="$t('workOrder')" prop="workOrder">
											<v-selectpage
												class="select-page-style"
												key-field="name"
												show-field="name"
												v-model="req.workOrder"
												ref="workOrder"
												multiple
												v-if="isWorkOrder && searchPoptipModal"
												:data="workorderPageListUrl"
												:placeholder="$t('pleaseEnter') + $t('workOrder')"
												:params="{
													startTime: formatDate(req.startTime),
													endTime: formatDate(req.endTime),
													modelName: req.modelName,
													projectVersion: req.projectVersion,
													buildType: req.buildType,
													config: req.buildConfig,
												}"
												:result-format="
													(res) => {
														return {
															totalRow: res.total,
															list: res.data || [],
														};
													}
												"
												@values="changeSelectPage('processName')"
											>
											</v-selectpage>
										</FormItem>
										<!-- 制程 -->
										<FormItem :label="$t('processName')" prop="processName">
											<v-selectpage
												class="select-page-style"
												key-field="name"
												show-field="name"
												v-model="req.processName"
												ref="processName"
												multiple
												v-if="isProcessName && searchPoptipModal"
												:data="processPageListUrl"
												:placeholder="$t('pleaseEnter') + $t('processName')"
												:params="{
													startTime: formatDate(req.startTime),
													endTime: formatDate(req.endTime),
													modelName: req.modelName,
													projectVersion: req.projectVersion,
													buildType: req.buildType,
													config: req.buildConfig,
												}"
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
import {
	getpagelistReq,
	exportReq,
	modelPageListUrl,
	configPageListUrl,
	processPageListUrl,
	projectVersionPageListUrl,
	buildTypePageListUrl,
	workorderPageListUrl,
} from "@/api/bill-manage/test-yield-report";
import { getButtonBoolean, formatDate, exportFile } from "@/libs/tools";

export default {
	name: "test-yield-report",
	data() {
		return {
			searchPoptipModal: false,
			isModelName: true,
			isBuildConfig: true,
			isProcessName: true,
			isProjectVersion: true,
			isBuildType: true,
			isWorkOrder: true,
			formatDate: formatDate,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			modelPageListUrl: modelPageListUrl(),
			configPageListUrl: configPageListUrl(),
			processPageListUrl: processPageListUrl(),
			projectVersionPageListUrl: projectVersionPageListUrl(),
			buildTypePageListUrl: buildTypePageListUrl(),
			workorderPageListUrl: workorderPageListUrl(),
			data: [], // 表格数据
			btnData: [],
			categoryList: [], // 类别下拉框
			modelPageList: [], //机种下拉框
			configPageList: [], //config下拉框
			processPageList: [], //站点下拉框
			projectVersionPageList: [], //projectVersion下拉框
			buildTypePageList: [], //buildType下拉框
			req: {
				startTime: "",
				endTime: "",
				modelName: "", //机种
				buildConfig: "", //config
				processName: "", //制程
				projectVersion: "", //projectVersion
				buildType: "", //buildType
				workOrder: "",
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
				{ title: "Station", key: "station", align: "center", minWidth: 200, tooltip: true },
				{ title: "Input", key: "input", align: "center", minWidth: 100, tooltip: true },
				{ title: "PASS_1A", key: "pass_1A", align: "center", minWidth: 60 },
				{ title: "FAIL_1A", key: "fail_1A", align: "center", minWidth: 60 },
				{ title: "PASS_2A", key: "pass_2A", align: "center", minWidth: 60 },
				{ title: "FAIL_2A", key: "fail_2A", align: "center", minWidth: 60 },
				{ title: "PASS_3A", key: "pass_3A", align: "center", minWidth: 60 },
				{ title: "FAIL_3A", key: "fail_3A", align: "center", minWidth: 60 },
				{ title: "FPYR", key: "fpyr", align: "center", minWidth: 100 },
				{ title: "EngineeringYield", key: "engineeringYield", align: "center", minWidth: 100 },
				{ title: "RetestRate", key: "retestRate", align: "center", minWidth: 100 },
			], // 表格数据
			ruleValidate: {
				startTime: [
					{
						required: true,
						message: "请选择开始时间",
					},
				],
				endTime: [
					{
						required: true,
						message: "请选择结束时间",
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
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			let { startTime, endTime, modelName, buildConfig, processName, projectVersion, buildType, workOrder } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					let obj = {
						orderField: "station", // 排序字段
						ascending: true, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							startTime: formatDate(startTime),
							endTime: formatDate(endTime),
							modelName,
							buildConfig,
							processName,
							projectVersion,
							buildType,
							workOrder,
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
			let { startTime, endTime, modelName, buildConfig, processName, projectVersion, buildType, workOrder } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					let obj = {
						startTime: formatDate(startTime),
						endTime: formatDate(endTime),
						modelName,
						buildConfig,
						processName,
						projectVersion,
						buildType,
						workOrder,
					};
					exportReq(obj).then((res) => {
						let blob = new Blob([res], { type: "application/vnd.ms-excel" });
						const fileName = `${this.$t("test-yield-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
						exportFile(blob, fileName);
					});
				}
			});
		},
		//联动下拉框
		changeSelectPage(type) {
			switch (type) {
				case "modelName":
					this.isModelName = false;
					break;
				case "buildConfig":
					this.isBuildConfig = false;
					break;
				case "processName":
					this.isProcessName = false;
					break;
				case "projectVersion":
					this.isProjectVersion = false;
					break;
				case "buildType":
					this.isBuildType = false;
					break;
				case "workOrder":
					this.isWorkOrder = false;
					break;
				default:
					break;
			}

			this.$nextTick(() => {
				this.isModelName = true;
				this.isBuildConfig = true;
				this.isProcessName = true;
				this.isProjectVersion = true;
				this.isBuildType = true;
				this.isWorkOrder = true;
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.searchPoptipModal = false;
			this.$refs.searchReq.resetFields();
			this.$refs.modelName.remove();
			this.$refs.buildConfig.remove();
			this.$refs.processName.remove();
			this.$refs.projectVersion.remove();
			this.$refs.buildType.remove();
			//   this.searchClick()
			this.$nextTick(() => {
				this.searchPoptipModal = true;
			});
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
