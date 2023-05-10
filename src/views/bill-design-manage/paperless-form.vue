/* 无纸化 表单*/
<template>
	<div class="page-style">
		<!-- 左侧抽屉 -->
		<Modal v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" :closable="true" :before-close="cancelClick">
			<Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="100" :label-colon="true">
				<!-- 单据编码 -->
				<FormItem label="单据编码">
					<label>{{ submitData.billNumber }}</label>
				</FormItem>
				<!-- 模板ID -->
				<FormItem label="模板名称" prop="templateId">
					<template v-if="!isAdd">
						<label>{{ submitData.templateName }}</label>
					</template>
					<template v-else>
						<Select v-model="submitData.templateId" clearable :placeholder="$t('pleaseSelect') + '模板名称'" transfer>
							<Option v-for="(item, i) in templateList" :value="item.id" :key="i">
								{{ item.name }}
							</Option>
						</Select>
					</template>
				</FormItem>
				<!-- 是否有效 -->
				<FormItem :label="$t('enabled')" prop="enabled">
					<i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
						<span slot="open">{{ $t("open") }}</span>
						<span slot="close">{{ $t("close") }}</span>
					</i-switch>
				</FormItem>
			</Form>
			<!-- 按钮 -->
			<div slot="footer">
				<Button size="small" @click="cancelClick">取消</Button>
				<Button size="small" @click="submitClick()" style="padding: 5px 16px">保存</Button>
			</div>
		</Modal>
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
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 模板名称 -->
										<FormItem label="模板名称" prop="templateId">
											<Select v-model="req.templateId" clearable :placeholder="$t('pleaseSelect') + '模板名称'" transfer>
												<Option v-for="(item, i) in templateList" :value="item.id" :key="i">
													{{ item.name }}
												</Option>
											</Select>
										</FormItem>
										<!-- 单据编码 -->
										<FormItem label="单据编码" prop="billNumber">
											<Input v-model="req.billNumber" :placeholder="$t('pleaseEnter') + '单据编码'" cleabler />
										</FormItem>
										<!-- 状态 -->
										<FormItem label="状态" prop="state">
											<Select v-model="req.state" clearable :placeholder="$t('pleaseSelect') + '状态'" transfer cleabler>
												<Option v-for="(item, i) in stateList" :value="item.detailValue" :key="i">
													{{ item.detailName }}
												</Option>
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
						<div class="operator">
							<p @click="signForm(row)">审核</p>
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
import { getButtonBoolean, renderIsEnabled, renderDate } from "@/libs/tools";
import { getpagelistReq, addReq, modifyReq } from "@/api/bill-design-manage/paperless-form.js";
import { getlistReq } from "@/api/bill-design-manage/paperless-template.js";
export default {
	components: {},
	name: "paperless-form",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			isAdd: true,
			selectObj: {}, //表格选中
			stateList: [
				{ detailValue: "-1", detailName: "保存" },
				{ detailValue: "0", detailName: "待审核" },
				{ detailValue: "1", detailName: "审核中" },
				{ detailValue: "2", detailName: "已审核" },
				{ detailValue: "3", detailName: "驳回" },
			],
			templateList: [], //模板list
			submitData: { templateId: "", billNumber: "", enabled: 1 },
			drawerFlag: false,
			drawerTitle: this.$t("add"),
			req: {
				templateId: "", //模板名称
				billNumber: "", //单据编码
				state: "", //表单状态
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
				{ title: "单据编码", key: "billNumber", align: "center", tooltip: true },
				{ title: "模板编码", key: "templateId", align: "center", tooltip: true },
				{ title: "模板名称", key: "templateName", align: "center", tooltip: true },
				{ title: "创建时间", key: "createDate", align: "center", tooltip: true, render: renderDate },
				{ title: "修改时间", key: "modifyDate", align: "center", tooltip: true, render: renderDate },
				{ title: this.$t("enabled"), key: "enabled", align: "center", width: 70, render: renderIsEnabled },
				{ title: "操作", slot: "operator", align: "center", tooltip: true },
			], // 表格数据
			// 验证实体
			ruleValidate: {},
		};
	},
	mounted() {
		this.getTemplateList();
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
			const { templateId, billNumber, state } = this.req;
			let { orderField, ascending, pageSize, pageIndex } = this.req;
			const obj = {
				orderField, // 排序字段
				ascending, // 是否升序
				pageSize, // 分页大小
				pageIndex, // 当前页码
				data: { templateId, billNumber, state },
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
			this.drawerFlag = true;
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				this.submitData = { ...this.selectObj };
				this.isAdd = false;
				this.drawerFlag = true;
				this.drawerTitle = this.$t("edit");
			} else this.$Msg.warning(this.$t("oneData"));
		},
		//提交
		submitClick() {
			const { templateId, billNumber, enabled, json } = this.submitData;
			let obj = { templateId, billNumber, enabled, state: -1, json }; //-1 代表保存
			//新增 或者编辑时当前模板修改为其他模板时，重新赋值json
			if (this.isAdd || this.submitData.templateId !== this.selectObj.templateId) {
				obj.json = this.templateList.filter((item) => item.id === templateId)[0].json;
			}
			const requestApi = this.isAdd ? addReq(obj) : modifyReq(obj);
			requestApi.then((res) => {
				if (res.code === 200) {
					this.$Msg.success("提交成功！");
					this.cancelClick();
					this.pageLoad();
				} else {
					this.$Msg.error(`提交失败,${res.message}`);
				}
			});
		},
		// 签订表单
		signForm(row) {
			const obj = { billNumber: row.billNumber, templateId: row.templateId };
			window.localStorage.setItem("paperlessRow", JSON.stringify(obj));
			const { href } = this.$router.resolve({
				path: "/bill-design-manage/paperless-preview",
			});
			window.open(href, "_blank");
		},
		//获取模板
		getTemplateList() {
			getlistReq({}).then((res) => {
				if (res.code == 200) this.templateList = res.result || [];
			});
		},

		cancelClick() {
			this.drawerFlag = false;
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
