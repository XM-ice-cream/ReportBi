/* 无纸化 模板 */
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
										<!-- 模板名称 -->
										<FormItem label="模板名称" prop="name">
											<Input v-model="req.name" :placeholder="$t('pleaseEnter') + '模板名称'" cleabler />
										</FormItem>
										<!-- 模板编码 -->
										<FormItem label="模板编码" prop="enCode">
											<Input v-model="req.enCode" :placeholder="$t('pleaseEnter') + '模板编码'" cleabler />
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
				<Table
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
					@on-current-change="currentClick"
				>
					<template slot="operator" slot-scope="{ row }">
						<Button class="tableBtn" type="text" @click="signForm(row)">预览</Button>
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
		<PaperlessDesign ref="paperless-design" :isAdd="isAdd" />
		<!-- <PaperlessPreview ref="paperless-preview" /> -->
	</div>
</template>

<script>
import { getButtonBoolean, renderDate } from "@/libs/tools";
import PaperlessDesign from "./paperless/paperless-design.vue";
import { getpagelistReq } from "@/api/bill-design-manage/paperless-template.js";

export default {
	components: { PaperlessDesign },
	name: "PaperlessTemplate",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			isAdd: true,
			selectObj: {}, //表格选中
			submitData: {},
			drawerFlag: false,
			req: {
				enCode: "",
				name: "",
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
				{ title: "ID", key: "id", align: "center", tooltip: true },
				{ title: "模板名称", key: "name", align: "center", tooltip: true },
				{ title: "模板编码", key: "enCode", align: "center", tooltip: true },
				{ title: "创建时间", key: "createDate", align: "center", tooltip: true, render: renderDate },
				{ title: "修改时间", key: "modifyDate", align: "center", tooltip: true, render: renderDate },
				{ title: "操作", slot: "operator", align: "center", tooltip: true },
			], // 表格数据
			// 验证实体
			ruleValidate: {},
		};
	},
	mounted() {
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
			this.selectObj = null;
			this.req.pageIndex = 1;
			this.pageLoad();
			this.searchPoptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			let { orderField, ascending, pageSize, pageIndex, enCode, name } = this.req;
			const obj = {
				orderField, // 排序字段
				ascending, // 是否升序
				pageSize, // 分页大小
				pageIndex, // 当前页码
				data: { enCode, name, category: 0, status: "" },
			};
			getpagelistReq(obj)
				.then((res) => {
					if (res.code === 200) {
						let data = res.result;
						this.data = data.data || [];
						this.req.pageSize = data.pageSize;
						this.req.pageIndex = data.pageIndex;
						this.req.total = data.total;
						this.req.totalPage = data.totalPage;
						this.req.elapsedMilliseconds = res.elapsedMilliseconds;
					}
				})
				.finally(() => (this.tableConfig.loading = false));
		},
		// 点击新增按钮触发
		addClick() {
			this.isAdd = true;
			this.$refs["paperless-design"].modalFlag = true;
			this.$refs["paperless-design"].sheetData = [{}];
			this.$refs["paperless-design"].formInfo = {};
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				this.submitData = { ...this.selectObj };

				const { json, name, enCode, id } = this.selectObj;
				this.isAdd = false;
				this.$refs["paperless-design"].modalFlag = true;
				this.$refs["paperless-design"].sheetData = JSON.parse(json);
				this.$refs["paperless-design"].formInfo = { name, enCode, id };
			} else this.$Msg.warning(this.$t("oneData"));
		},
		// 签订表单
		signForm(row) {
			const obj = { row };
			window.localStorage.setItem("paperlessRow", JSON.stringify(obj));
			const { href } = this.$router.resolve({
				path: "/bill-design-manage/paperless-preview",
			});
			window.open(href, "_blank");
		},

		cancelClick() {
			this.$refs.submitReq.resetFields(); //清除表单红色提示
		},

		// 某一行高亮时触发
		currentClick(currentRow) {
			this.selectObj = currentRow;
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

<style scoped lang="less">
.tableBtn {
	display: inline-block;
	padding: 3px 10px;
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
