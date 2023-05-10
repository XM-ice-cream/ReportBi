/* Insight物料信息维护 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="4">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="320" trigger="manual">
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="60" :label-colon="true" @submit.native.prevent>
										<div class="poptip-style-button">
											<Button @click="resetClick">{{ $t("reset") }}</Button>
											<Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
										</div>
									</Form>
								</div>
							</Poptip>
						</i-col>
						<i-col span="20">
							<button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick"></button-custom>
						</i-col>
					</Row>
				</div>
				<Table
					:row-class-name="tableRowClassName"
					:border="tableConfig.border"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
					@on-current-change="currentClick"
					@on-sort-change="sortChange"
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
		<!-- 左侧抽屉 -->
		<Drawer v-model="drawerFlag" :title="drawerTitle" width="520" :mask-closable="false" @on-close="cancelClick">
			<!--   设备绑定   -->
			<Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="110" :label-colon="true" @submit.native.prevent>
				<!-- 机种 -->
				<FormItem :label="$t('modelkey')" prop="modelkey">
					<Input clearable v-model.trim="submitData.modelkey" :placeholder="$t('pleaseEnter') + $t('modelkey')" />
				</FormItem>
				<!-- EECODE -->
				<FormItem label="EECODE" prop="EEcode">
					<Input clearable v-model.trim="submitData.EEcode" :placeholder="$t('pleaseEnter') + 'EEcode'" />
				</FormItem>
				<!-- 机种客户代码 -->
				<FormItem :label="$t('modelCustomCode')" prop="modelCustomCode">
					<Input clearable v-model.trim="submitData.modelCustomCode" :placeholder="$t('pleaseEnter') + $t('modelCustomCode')" />
				</FormItem>
				<!-- 厂内料号 -->
				<FormItem :label="$t('pn')" prop="pn">
					<Input clearable v-model.trim="submitData.pn" :placeholder="$t('pleaseEnter') + $t('pn')" />
				</FormItem>
				<!-- INFOCODE -->
				<FormItem label="INFOCODE" prop="infoCode">
					<Input clearable v-model.trim="submitData.infoCode" :placeholder="$t('pleaseEnter') + 'INFOCODE'" />
				</FormItem>
				<!-- 客户料号 -->
				<FormItem :label="$t('customPn')" prop="customPn">
					<Input clearable v-model.trim="submitData.customPn" :placeholder="$t('pleaseEnter') + $t('customPn')" />
				</FormItem>
				<!-- 类型 -->
				<FormItem :label="$t('materType')" prop="materType">
					<Input clearable v-model.trim="submitData.materType" :placeholder="$t('pleaseEnter') + $t('materType')" />
				</FormItem>
				<FormItem>
					<Button class="save-button" type="primary" size="small" @click="addInsightList">
						{{ $t("save") }}
					</Button>
				</FormItem>
				<!-- 抽检箱号表格-->
				<Table :border="true" :max-height="250" :columns="insightColumns" :data="insightData" style="margin-bottom: 16px">
					<template slot-scope="{ row, index }" slot="action">
						<Button type="error" size="small" @click="insightData.splice(index, 1)" icon="iconfont icon-delete"> </Button>
					</template>
				</Table>
				<!-- 按钮 -->
				<FormItem>
					<drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
				</FormItem>
			</Form>
		</Drawer>
	</div>
</template>

<script>
import { getpagelistReq, addReq, modifyReq } from "@/api/bill-manage/insight-maintain";
import { getButtonBoolean, renderDate, errorType } from "@/libs/tools";
import { deepClone } from "@/libs/utils";
export default {
	name: "insight-maintain",
	components: {},
	data() {
		return {
			isAdd: true,
			drawerFlag: false,
			drawerTitle: this.$t("add"),
			searchPoptipModal: false,
			tableConfig: { ...this.$config.tableConfig }, // table配置
			columns: [
				{
					title: this.$t("sort"),
					type: "index",
					width: 50,
					align: "center",
					fixed: "left",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: this.$t("modelkey"), key: "modelkey", align: "center" },
				{ title: "EECODE", key: "EEcode", align: "center" },
				{ title: this.$t("modelCustomCode"), key: "modelCustomCode", align: "center", tooltip: true },
				{ title: this.$t("pn"), key: "pn", width: 100, align: "center" },
				{ title: this.$t("infoCode"), key: "infoCode", align: "center" },
				{ title: this.$t("customPn"), key: "customPn", align: "center" },
				{ title: this.$t("materType"), key: "materType", align: "center" },
				{ title: this.$t("createUser"), key: "createUserName", width: 80, align: "center" },
				{ title: this.$t("createDate"), key: "createDate", width: 125, render: renderDate, align: "center" },
			], // 表格数据
			data: [], // 表格数据
			selectObj: null, // 表格选中数据
			req: {
				workFlowId: "", //流程
				processId: "", //制程
				typeId: "", //载治具类型
				...this.$config.pageConfig,
			},
			submitData: {
				id: "", // id
				modelkey: "", // 机种
				EEcode: "", // EECODE
				modelCustomCode: "", // 机种客户代码
				pn: "", // 厂内料号
				infoCode: "", // INFOCODE
				customPn: "", // 客户料号
				materType: "", // 类型
			},
			errData: [], //错误信息
			btnData: [],
			// insight新增列表配置
			insightColumns: [
				{
					title: this.$t("sort"),
					type: "index",
					width: 50,
					align: "center",
				},
				{
					title: this.$t("modelkey"),
					key: "modelkey",
					align: "center",
				},
				{
					title: "EEcode",
					key: "EEcode",
					align: "center",
				},
				{
					title: this.$t("modelCustomCode"),
					key: "modelCustomCode",
					align: "center",
				},
				{
					title: "操作",
					slot: "action",
					width: 40,
					align: "center",
				},
			],
			insightData: [], // 箱号列表数据
			// 验证实体
			ruleValidate: {
				modelkey: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("modelkey"),
						trigger: "blur",
					},
				],
				EEcode: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "EEcode",
						trigger: "blur",
					},
				],
				modelCustomCode: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("modelCustomCode"),
						trigger: "blur",
					},
				],
				pn: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("pn"),
						trigger: "blur",
					},
				],
				infoCode: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "INFOCODE",
						trigger: "blur",
					},
				],
				customPn: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("customPn"),
						trigger: "blur",
					},
				],
				materType: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("materType"),
						trigger: "blur",
					},
				],
			},
		};
	},
	mounted() {
		this.req.orderField = "id";
		this.pageLoad();
	},
	activated() {
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},
	methods: {
		// 按钮公共方法
		buttonCustomClick(refName, title) {
			this.$refs[refName].drawerTitle = this.$t(title || refName);
			this.$refs[refName].drawerFlag = true;
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = true;
			let {
				orderField,
				ascending,
				pageSize,
				pageIndex,
				workFlowId, //流程id
				processId, //制程id
				typeId, //载治具类型id
			} = this.req;
			let obj = {
				orderField, // 排序字段
				ascending, // 是否升序
				pageSize, // 分页大小
				pageIndex, // 当前页码
				data: { workFlowId, processId, typeId, enabled: -1 },
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
		},
		// 点击新增按钮触发
		addClick() {
			this.drawerFlag = true;
			this.isAdd = true;
			this.drawerTitle = this.$t("add");
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				let { workFlowId, processId, typeId, amount, enabled, id } = this.selectObj;
				this.submitData = {
					workFlowId,
					processId,
					typeId,
					amount,
					enabled,
					id,
				};
				this.drawerFlag = true;
				this.isAdd = false;
				this.drawerTitle = this.$t("edit");
			} else this.$Msg.warning(this.$t("oneData"));
		},
		// 新增菜单、按钮
		submitClick(isClose = false) {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					let request = this.isAdd ? addReq(this.submitData) : modifyReq(this.submitData);
					request.then((res) => {
						if (res.code === 200) {
							this.$Msg.success(`${this.drawerTitle}${this.$t("success")}`);
							this.pageLoad();
							if (isClose) this.cancelClick();
						} else {
							this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
						}
					});
				}
			});
		},
		// 新增数据到弹窗列表
		addInsightList() {
			// this.$refs.submitReq.validate((validate) => {
			//   if (validate) {
			//   }
			// });
			// 判断提交的值是否存在在列表中
			const flag = this.insightData.some((val) => JSON.stringify(val) === JSON.stringify(this.submitData));
			if (flag) {
				this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},保存的数据已存在`);
			} else {
				this.insightData.push(deepClone(this.submitData));
			}
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.req.workFlowId = "";
			this.searchPoptipModal = false;
			this.$nextTick(() => {
				this.searchPoptipModal = true;
			});
			this.pageLoad();
		},
		// 点击搜索按钮触发
		searchClick() {
			this.selectObj = null;
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 弹窗取消
		cancelClick() {
			this.drawerFlag = false;
			this.$refs.submitReq.resetFields(); //清除表单红色提示
			this.errData = [];
		},
		// 自动改变表格高度
		autoSize() {
			let height = document.body.clientHeight - 120;
			this.tableConfig.height = height - 60;
		},
		// 某一行高亮时触发
		currentClick(currentRow) {
			this.selectObj = currentRow;
		},
		// 排序时有效，当点击排序时触发
		sortChange(data) {
			this.req.orderField = data.key.toUpperCase();
			this.req.ascending = data.order === "asc";
			this.pageLoad();
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
		tableRowClassName(row) {
			if (new Date().getTime() > new Date(row.alarmTime).getTime()) {
				return "table_cell_bg_color_red";
			}
		},
	},
};
</script>
<style>
.drawer-button {
	text-align: center;
}
.save-button {
	position: relative;
	left: 50%;
	transform: translateX(-50%);
}
</style>
