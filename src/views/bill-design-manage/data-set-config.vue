/* 数据集 配置*/
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
										<!-- 数据集编码 -->
										<FormItem :label="$t('setCode')" prop="datasetCode">
											<Input v-model="req.datasetCode" :placeholder="$t('pleaseEnter') + $t('setCode')" />
										</FormItem>
										<!-- 数据集名称 -->
										<FormItem :label="$t('setName')" prop="datasetName">
											<Input v-model="req.datasetName" :placeholder="$t('pleaseEnter') + $t('setCode')" />
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
						</i-col>
						<i-col span="18" style="text-align: right">
							<button-custom
								:btnData="btnData"
								@on-upload-click="uploadClick"
								@on-add-click="addClick"
								@on-edit-click="editClick"
								@on-delete-click="deleteClick"
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
					@on-row-dblclick="editClick"
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
		<!-- 数据集配置 新增与编辑 -->
		<DataSetConfigAddEdit ref="datasetconfigaddedit" :modalFlag.sync="modalFlag" :isAdd="isAdd" />
		<!-- 数据集上传excel -->
		<DataSetConfigUpload ref="datasetconfigupload" :modalFlag.sync="modalFlagUpload" />
	</div>
</template>

<script>
import { getButtonBoolean, renderIsEnabled, renderDate } from "@/libs/tools";
import DataSetConfigAddEdit from "./datasetconfig/data-set-config-add-edit.vue";
import DataSetConfigUpload from "./datasetconfig/data-set-config-upload.vue";

import { getpagelistReq, deleteReq } from "@/api/bill-design-manage/data-set-config.js";

export default {
	components: { DataSetConfigAddEdit, DataSetConfigUpload },
	name: "dateset-config",
	data() {
		return {
			btnData: [],
			isAdd: true, //新增编辑
			modalFlag: false,
			searchPoptipModal: false,
			modalFlagUpload: false,
			submitData: {},
			selectObj: {}, //选中值
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [],
			req: {
				setCode: "",
				setName: "",
				sourceCode: "",
				...this.$config.pageConfig,
			}, //查询数据
			columns: [
				{
					type: "index",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: this.$t("setName"), key: "datasetName", align: "center", tooltip: true, minWidth: 150 },
				{ title: this.$t("setCode"), key: "datasetCode", align: "center", tooltip: true, minWidth: 150 },
				{ title: this.$t("createUser"), key: "createUserName", minWidth: 100, align: "center", tooltip: true },
				{ title: this.$t("createDate"), key: "createDate", minWidth: 150, render: renderDate, align: "center", tooltip: true },
				{ title: this.$t("modifyUser"), key: "modifyUserName", minWidth: 100, align: "center", tooltip: true },
				{
					title: this.$t("modifyDate"),
					key: "modifyDate",
					minWidth: 150,
					align: "center",
					render: renderDate,
					tooltip: true,
				},
				{ title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled, width: 80 },
			], // 表格数据
			// 验证实体
			ruleValidate: {},
		};
	},
	activated() {
		this.tableConfig.loading = false;
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
			this.selectObj = {};
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			let { datasetName, datasetCode } = this.req;
			this.tableConfig.loading = true;
			let obj = {
				orderField: "datasetCode", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					datasetName,
					datasetCode,
					enabled: 1,
				},
			};
			getpagelistReq(obj)
				.then((res) => {
					if (res.code === 200) {
						if (res.code === 200) {
							let { data, pageSize, pageIndex, total, totalPage } = res.result;
							this.data = data || [];
							this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
							this.searchPoptipModal = false;
						}
					}
				})
				.finally(() => (this.tableConfig.loading = false));
		},

		// 新增按钮
		addClick() {
			this.modalFlag = true;
			this.isAdd = true;
			this.$refs.datasetconfigaddedit.pageLoad({});
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				this.modalFlag = true;
				this.isAdd = false;
				this.$refs.datasetconfigaddedit.pageLoad(this.selectObj);
			} else this.$Msg.warning(this.$t("oneData"));
		},
		//删除
		deleteClick() {
			if (this.selectObj) {
				this.$Modal.confirm({
					title: "确认要删除该数据吗?",
					onOk: () => {
						const obj = { ...this.selectObj };
						deleteReq(obj).then((res) => {
							if (res.code === 200) {
								this.$Msg.success("删除成功");
								this.pageLoad();
							}
						});
					},
					//   onCancel: () => this.clearGraphData(),
				});
			} else this.$Msg.warning(this.$t("oneData"));
		},

		cancelClick() {
			this.$refs.submitReq.resetFields(); //清除表单红色提示
		},

		// 某一行高亮时触发
		currentClick(currentRow) {
			this.selectObj = currentRow;
		},
		//删除选择的数据
		selectClick(selection) {
			this.selectArr = selection;
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
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
		uploadClick() {
			this.modalFlagUpload = true;
		},
	},
};
</script>
<style lang="less" scope></style>
<style></style>
