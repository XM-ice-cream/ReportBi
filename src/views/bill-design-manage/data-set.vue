/* 数据集 */
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
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 数据集编码 -->
										<FormItem :label="$t('setCode')" prop="setCode">
											<Input v-model="req.setCode" :placeholder="$t('pleaseEnter') + $t('setCode')" @on-search="searchClick" />
										</FormItem>
										<!-- 数据集名称 -->
										<FormItem :label="$t('setName')" prop="setName">
											<Input v-model="req.setName" :placeholder="$t('pleaseEnter') + $t('setName')" @on-search="searchClick" />
										</FormItem>
										<!-- 数据源 -->
										<FormItem :label="$t('dataSource')" prop="sourceCode">
											<Select v-model="req.sourceCode" clearable :placeholder="$t('pleaseSelect') + $t('dataSource')" transfer>
												<Option v-for="item in sourceList" :key="item.sourceName" :label="item.sourceName" :value="item.sourceCode" />
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
						<i-col span="18" style="text-align: right">
							<Dropdown size="small" @on-click="addClick">
								<Button type="primary" custom-icon="iconfont icon-add"
									>新增
									<Icon type="ios-arrow-down"></Icon>
								</Button>
								<DropdownMenu slot="list" size="small" style="text-align: left">
									<DropdownItem name="sql">SQL</DropdownItem>
									<DropdownItem name="http">HTTP</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							<button-custom :btnData="btnData" @on-edit-click="editClick" @on-delete-click="deleteClick"></button-custom>
						</i-col>
					</Row>
				</div>
				<Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick" @on-selection-change="selectClick">
					<template slot="operation" slot-scope="{ row }">
						<span @click="dataview(row)" class="tableBtn">数据预览</span>
					</template>
				</Table>
				<page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
			</Card>
		</div>
		<!-- 数据预览 -->
		<data-view ref="DataView" :visib.sync="dialogCaseResult" />
		<!-- 新增编辑组件 -->
		<edit-view-set ref="EditDataSet" :dataSet="dataSet" :visib.sync="dialogVisibleSetDataSet" @refreshList="pageLoad" />
	</div>
</template>

<script>
import { getpagelistReq, getAllDatasourceReq, deleteDatacollectReq } from "@/api/bill-design-manage/data-set.js";
import { getButtonBoolean, renderIsEnabled } from "@/libs/tools";
import dataView from "./dataset/data-view.vue";
import EditViewSet from "./dataset/edit-view-set.vue";

export default {
	components: { dataView, EditViewSet },
	name: "dataset",
	data() {
		return {
			searchPoptipModal: false,
			dialogCaseResult: false,
			dialogVisibleSetDataSet: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			categoryList: [], // 类别下拉框
			selectObj: null, //表格选中
			selectArr: [], //表格多选
			sourceList: [],
			dataSet: {},
			isAdd: true, //新增编辑
			submitData: {},
			req: {
				setCode: "",
				setName: "",
				sourceCode: "",
				...this.$config.pageConfig,
			}, //查询数据
			columns: [
				{
					type: "selection",
					width: 60,
					align: "center",
				},
				{
					type: "index",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: this.$t("setCode"), key: "setCode", align: "center", tooltip: true },
				{ title: this.$t("setName"), key: "setName", align: "center", tooltip: true },
				{ title: this.$t("dataSetDesc"), key: "setDesc", align: "center", tooltip: true },
				{ title: this.$t("dataSource"), key: "sourceName", align: "center", tooltip: true },
				{ title: this.$t("sourceType"), key: "setType", align: "center", tooltip: true },
				{ title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled },
				{ title: "操作", slot: "operation", align: "center", width: "80" },
			], // 表格数据
			// 验证实体
			ruleValidate: {
				sourceCode: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("dataSourceCode"),
						trigger: "change",
					},
				],
			},
		};
	},
	activated() {
		console.log(this.$route.query.sourceCode);
		if (this.$route.query.sourceCode) {
			this.req.sourceCode = this.$route.query.sourceCode;
		}
		this.pageLoad();
		this.autoSize();
		this.getDataSourceList();
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
			this.tableConfig.loading = true;
			const { sourceCode, setCode, setName } = this.req;
			let obj = {
				orderField: "setCode", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					sourceCode,
					setCode,
					setName,
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
		},
		//获取数据源下拉框
		getDataSourceList() {
			const obj = { sourceType: "" };
			getAllDatasourceReq(obj).then((res) => {
				const { code, result } = res;
				if (code !== 200) return;
				this.sourceList = result;
			});
		},
		// 新增按钮
		addClick(type) {
			this.dialogVisibleSetDataSet = true;
			this.dataSet = {};
			this.isAdd = true;
			this.$refs.EditDataSet.addOrEditDataSet(this.dataSet, type, this.isAdd);
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				this.dataSet = this.selectObj;
				const type = this.selectObj.setType;
				this.dialogVisibleSetDataSet = true;
				this.isAdd = false;
				// this.submitData = {
				//   ...this.selectObj
				// };
				this.$refs.EditDataSet.addOrEditDataSet(this.dataSet, type, this.isAdd);
			} else this.$Msg.warning(this.$t("oneData"));
		},
		//提交 isClose = false
		submitClick() {
			//   this.$refs.submitReq.validate((validate) => {
			//     if (validate) {
			//       const href =
			//         this.submitData.component === "Main"
			//           ? `/${this.submitData.name}`
			//           : this.submitData.name;
			//       const apis = this.submitData.apis.join(",");
			//       let obj = { ...this.submitData, href, apis };
			//       // 添加上传文件参数并上传文件
			//       this.uploadFile()
			//   let request = this.isAdd ? addReq(obj) : modifyReq(obj);
			//   request.then((res) => {
			//     if (res.code === 200) {
			//       this.selectObj = null;
			//       this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
			//       this.getLeftMenu();
			//       if (isClose) {
			//         this.treeCancel();
			//         this.cancelClick();
			//       }
			//     } else
			//       this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
			//   });
			//     }
			//   });
		},
		//数据预览
		dataview(data) {
			this.dialogCaseResult = true;
			this.$refs.DataView.dataViewPreview(data.setName, JSON.parse(data.caseResult));
		},
		cancelClick() {
			this.$refs.submitReq.resetFields(); //清除表单红色提示
		},
		//删除
		deleteClick() {
			const deleteData = this.selectArr.length > 0 ? this.selectArr : this.selectObj ? [{ ...this.selectObj }] : [];
			if (deleteData.length == 0) {
				this.$Message.error("无选中删除数据");
				return;
			}
			this.$Modal.confirm({
				title: "确认要删除该数据吗?",
				onOk: () => {
					const deleteArr = deleteData.map((o) => o.setCode);
					deleteDatacollectReq({ setCode: deleteArr }).then((res) => {
						if (res.code === 200) {
							this.$Message.success("删除成功");
							this.pageLoad();
						}
					});
				},
			});
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
<style lang="less" scope>
.tableBtn {
	display: inline-block;
	padding: 0.4rem;
	color: #181da1;
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
<style>
.ivu-btn > .ivu-icon {
	font-size: 12px;
	line-height: 0.5;
}
.ace-jsoneditor.ace_editor {
	min-height: 21rem;
}
</style>
