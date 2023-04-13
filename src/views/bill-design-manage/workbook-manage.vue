/* 工作簿管理 */
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
										<!-- 工作簿编码 -->
										<FormItem :label="$t('workBookCode')" prop="workBookCode">
											<Input v-model="req.workBookCode" :placeholder="$t('pleaseEnter') + $t('workBookCode')" @on-search="searchClick" cleabler />
										</FormItem>
										<!-- 工作簿名称 -->
										<FormItem :label="$t('workBookName')" prop="workBookName">
											<Input v-model="req.workBookName" :placeholder="$t('pleaseEnter') + $t('workBookName')" @on-search="searchClick" cleabler />
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
								@on-add-click="addClick"
								@on-edit-click="editClick"
								@on-delete-click="deleteClick"
								@on-copy-click="copyClick"
							></button-custom>
						</i-col>
					</Row>
				</div>
				<Table
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
					@on-current-change="currentClick"
					@on-selection-change="selectClick"
					@on-row-dblclick="editClick"
				>
					<template slot="datasetId" slot-scope="{ row }">
						<span>{{ dataSetIdName[row.datasetId] }}</span>
					</template>
					<template slot="operator" slot-scope="{ row }">
						<Button class="tableBtn" type="text" @click="preview(row)">预览</Button>
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
			</Card>
		</div>
		<!-- 工作簿新增/编辑 -->
		<WorkbookDesign :modelFlag.sync="modelFlag" :workbookIsAdd="isAdd" :workbookSelectObj="selectObj" />
	</div>
</template>

<script>
import { getpagelistReq, deleteReq } from "@/api/bill-design-manage/workbook-manage.js";
import { getButtonBoolean, renderIsEnabled, renderDate } from "@/libs/tools";
import { getDataSetListReq } from "@/api/bill-design-manage/data-set-config.js";
import WorkbookDesign from "./workbook-manage/workbook-design.vue";
export default {
	components: { WorkbookDesign },
	name: "workbook-manage",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据

			btnData: [],
			datasetList: [], //获取所有数据集
			isAdd: true,
			selectObj: {}, //表格选中
			dataSetIdName: {},
			submitData: {
				id: "",
				remark: "",
				workBookName: "",
				workBookCode: "",
				datasetId: "",
				desc: "", //描述
				enabled: 1, //是否有效
			},
			modelFlag: false,
			req: {
				workBookName: "",
				workBookCode: "",
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
				{ title: this.$t("workBookName"), key: "workBookName", align: "center", tooltip: true, minWidth: 80 },
				{ title: this.$t("workBookCode"), key: "workBookCode", align: "center", tooltip: true, minWidth: 80 },
				{ title: this.$t("setName"), slot: "datasetId", align: "center", tooltip: true, minWidth: 80 },
				{ title: this.$t("createUser"), key: "createUserName", minWidth: 80, align: "center", tooltip: true },
				{ title: this.$t("createDate"), key: "createDate", minWidth: 125, render: renderDate, align: "center", tooltip: true },
				{ title: this.$t("modifyUser"), key: "modifyUserName", minWidth: 80, align: "center", tooltip: true },
				{
					title: this.$t("modifyDate"),
					key: "modifyDate",
					minWidth: 125,
					align: "center",
					render: renderDate,
					tooltip: true,
				},
				{ title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled, width: 80 },
				{ title: "操作", slot: "operator", align: "center", width: 80 },
			], // 表格数据
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		this.getDataSetList();
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
			const { workBookName, workBookCode } = this.req;
			let obj = {
				orderField: "id", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					workBookName,
					workBookCode,
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
		// 点击新增按钮触发
		addClick() {
			this.modelFlag = true;
			this.isAdd = true;
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				this.modelFlag = true;
				this.isAdd = false;
			} else this.$Msg.warning(this.$t("oneData"));
		},
		//复制
		copyClick() {
			if (this.selectObj) {
				this.modelFlag = true;
				this.isAdd = "copy";
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

		//获取所有数据集
		getDataSetList() {
			this.dataSetIdName = {};
			getDataSetListReq().then((res) => {
				if (res.code === 200) {
					this.datasetList = res?.result || [];
					this.datasetList.forEach((item) => {
						this.dataSetIdName[item.id] = item.datasetName;
					});
					this.dataSetIdName = JSON.parse(JSON.stringify(this.dataSetIdName));
				}
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
		//设计
		design(data) {
			this.selectObj = { ...data };
			const { workBookName, workBookCode, datasetId } = data;
			const href = this.skipUrl("workbookDesign", workBookCode, workBookName, datasetId);
			window.open(href, "_blank");
		},
		// 预览
		preview(data) {
			this.selectObj = { ...data };
			const { id } = data;
			const href = this.skipUrl("workbookPreview", id);
			window.open(href, "_blank");
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
		skipUrl(key, id) {
			const obj = {
				workbookPreview: "/bill-design-manage/workbook-preview",
				workbookDesign: "/bill-design-manage/workbook-design",
			};
			const { href } = this.$router.resolve({
				path: obj[key],
				query: { id },
			});
			return href;
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
