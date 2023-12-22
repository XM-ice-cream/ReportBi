/* 数据集 */
<template>
	<div class="page-style data-set">
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
										<!-- id -->
										<FormItem :label="$t('id')" prop="id">
											<Input v-model="req.id" :placeholder="$t('pleaseEnter') + $t('code')" @on-search="searchClick" />
										</FormItem>
                                        <!-- 标题 -->
										<FormItem :label="$t('title')" prop="title">
											<Input v-model="req.title" :placeholder="$t('pleaseEnter') + $t('title')" @on-search="searchClick" />
										</FormItem>
										<!-- 内容 -->
										<FormItem :label="$t('content')" prop="content">
											<Input v-model="req.content" :placeholder="$t('pleaseEnter') + $t('content')" @on-search="searchClick" />
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
							<button-custom :btnData="btnData"  @on-edit-click="editClick" @on-delete-click="deleteClick"></button-custom>
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
					<template slot="operation" slot-scope="{ row }">
						<div class="operator">
							<p @click="preview(row)">文章预览</p>
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
	</div>
</template>

<script>
import { getpagelistReq ,deleteArticle} from "@/api/bill-design-manage/article-manage.js";
import { getButtonBoolean, renderIsEnabled } from "@/libs/tools";

export default {
	name: "articlemanage",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			categoryList: [], // 类别下拉框
			selectObj: null, //表格选中
			selectArr: [], //表格多选
			dataSet: {},
			isAdd: true, //新增编辑
			submitData: {},
			req: {
                id:"",
				title: "",
				content: "",
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
				{ title: this.$t("id"), key: "id", align: "center", tooltip: true },
				{ title: this.$t("title"), key: "title", align: "center", tooltip: true },
				{ title: this.$t("content"), key: "content", align: "start", tooltip: true },
				{ title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled },
				{ title: "操作", slot: "operation", align: "center", width: 80 },
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
			this.tableConfig.loading = true;
			const { id, title, content } = this.req;
			let obj = {
				orderField: "title", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					id,
					title,
					content,
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
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
                const { id, title } = this.selectObj;
                const href = this.skipUrl('edit',id, title);
                window.open(href, "_self");
			} else this.$Msg.warning(this.$t("oneData"));
		},
		// 文章预览
		preview(data) {
			this.selectObj = { ...data };
			const { id, title } = data;
			const href = this.skipUrl('preview',id, title);
			window.open(href, "_blank");
		},
        skipUrl(key,id, title) {
            let router = {
                preview:"/bill-article-manage/article-preview",
                edit:"/bill-article-manage/articleadd"
            };
			const { href } = this.$router.resolve({
				path: router[key],
				query: { id, title },
			});
			return href;
		},
		cancelClick() {
			this.$refs.submitReq.resetFields(); //清除表单红色提示
		},
		//删除
		deleteClick() {
			const deleteData = this.selectArr.length > 0 ? this.selectArr : this.selectObj ? [{ ...this.selectObj }] : [];
			if (deleteData.length == 0) {
				this.$Msg.error("无选中删除数据");
				return;
			}
			this.$Modal.confirm({
				title: "确认要删除该数据吗?",
				onOk: () => {
					const deleteArr = deleteData.map((o) => o.id);
					deleteArticle({ ids: deleteArr }).then((res) => {
						if (res.code === 200) {
							this.$Msg.success("删除成功");
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
<style lang="less" scope></style>
<style>
.ivu-btn > .ivu-icon {
	font-size: 12px;
	line-height: 0.5;
}
.ace-jsoneditor.ace_editor {
	min-height: 21rem;
}
</style>
