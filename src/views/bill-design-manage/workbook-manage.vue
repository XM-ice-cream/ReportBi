/* 工作簿管理 */
<template>
	<div class="page-style workbook-manage">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<!-- 返回按钮 -->
							<Button @click="turnBack">
								<Icon custom="iconfont icon-arrows_left" />
							</Button>
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
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
					<template slot="opt1" slot-scope="{ row }">
						<span>{{ opt1List[row.opt1] }}</span>
					</template>
					<template slot="opt2" slot-scope="{ row }">
						<Tag :color="opt2Color[row.opt2]" type="dot" v-if="row.opt2">{{ opt2List[row.opt2] }}</Tag>
					</template>
					<template slot="operator" slot-scope="{ row }">
						<div class="operator">
							<p @click="preview(row)">预览</p>
							<span></span>
							<p>
								<i class="iconfont icon-menu-like menu-like" title="加入收藏"></i>
								<i class="iconfont icon-menu-like-active menu-like" title="取消收藏"></i>
							</p>
						</div>
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
import { getpagelistReq, deleteReq, getCollectReq, modifyCollectReq } from "@/api/bill-design-manage/workbook-manage.js";
import { getButtonBoolean, renderIsEnabled, renderDate } from "@/libs/tools";
import { getDataSetListReq } from "@/api/bill-design-manage/data-set-config.js";
import WorkbookDesign from "./workbook-manage/workbook-design.vue";
import { getlistReq as getDataItemReq } from "@/api/system-manager/data-item";

export default {
	components: { WorkbookDesign },
	name: "workbook-manage",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			opt1List: {},
			opt2List: {},
			btnData: [],
			datasetList: [], //获取所有数据集
			isAdd: true,
			selectObj: {}, //表格选中
			collectObj: {}, //收藏工作簿
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
				nodeId: "",
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
				{ title: "类别", slot: "opt2", align: "center", tooltip: true, width: 120 },
				{ title: "厂区", slot: "opt1", align: "center", tooltip: true, minWidth: 80 },
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
				{ title: "操作", slot: "operator", align: "center", width: 120 },
			], // 表格数据
		};
	},
	watch: {
		modelFlag(newVal) {
			console.log("监听2：", newVal);
		},
	},
	mounted() {
		const { nodeId, authorityBtn } = JSON.parse(window.localStorage.getItem("previewBiPermission"));
		//按钮权限
		this.btnData = authorityBtn?.map((item) => {
			const name = item.name?.split("-")[1] || item.name;
			return { ...item, name, title: this.btnToChinese(name) };
		});
		this.req = { ...this.req, nodeId, authorityBtn };
		this.getDataItemData();
		this.pageLoad();
		this.autoSize();
		this.getDataSetList();
		this.getCollectList(); //获取用户收藏数
		window.addEventListener("resize", () => this.autoSize());
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
			const { workBookName, workBookCode, nodeId } = this.req;
			let obj = {
				orderField: "createDate", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					workBookName,
					workBookCode,
					nodeId,
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
		//获取用户收藏
		getCollectList() {
			const obj = { type: "BI" };
			getCollectReq(obj).then((res) => {
				if (res.code == 200) {
					this.collectObj = { ...res.result };
				}
			});
		},
		//返回
		turnBack() {
			this.$router.push({
				name: "preview-bi",
			});
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
		//按钮对应中文
		btnToChinese(name) {
			const obj = {
				add: "新增",
				edit: "编辑",
				delete: "删除",
				copy: "复制",
			};
			return obj[name];
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
		async getDataItemData() {
			const color = [
				"primary",
				"success",
				"warning",
				"#00346c",
				"#08b9c6",
				"#ffa2d3",
				"#722ed1",
				"#1890ff",
				"#13c7d3",
				"#52c41a",
				"#fbb414",
				"#fb8c59",
				"#fb541c",
				"#eb2faf",
			];
			this.opt2Color = {};
			this.opt1List = await this.getDataItemDetailList("biTemplateFactory");
			this.opt2List = await this.getDataItemDetailList("biTemplateModel");
			Object.keys(this.opt2List).forEach((item, index) => (this.opt2Color[item] = color[index]));
		},

		// 获取数据字典数据
		async getDataItemDetailList(itemCode) {
			let obj = {};
			await getDataItemReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) {
					res.result.forEach((item) => {
						const { detailName, detailCode } = item;
						obj[detailCode] = detailName;
					}) || [];
				}
			});
			return obj;
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
<style>
.workbook-manage .ivu-table .ivu-tag-dot {
	width: 100px;
	position: relative;
}
.workbook-manage .ivu-table .ivu-tag-dot-inner {
	float: left;
	top: 7px;
}
</style>

<style scoped lang="less">
:deep(.ivu-tag-text) {
	color: #515a6e;
	display: inline-block;
}
</style>
