/* 数据源 */
<template>
	<div class="page-style">
		<!-- 左侧抽屉 -->
		<Modal
			v-model="drawerFlag"
			draggable
			scrollable
			width="800"
			:title="drawerTitle"
			:mask-closable="false"
			:closable="true"
			:before-close="cancelClick"
			:reset-drag-position="true"
		>
			<Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="100">
				<Row :gutter="10">
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 账号 -->
						<FormItem :label="$t('account')" prop="account">
							<Input v-model.trim="submitData.account" :placeholder="$t('pleaseEnter') + $t('account')" v-if="this.isAdd" />
							<span v-else>{{ submitData.account }}</span>
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 名称 -->
						<FormItem :label="$t('userName')" prop="name">
							<Input v-model.trim="submitData.name" :placeholder="$t('pleaseEnter') + $t('userName')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 简拼 -->
						<FormItem :label="$t('simpleSpelling')" prop="simpleSpelling">
							<Input v-model.trim="submitData.simpleSpelling" :placeholder="$t('pleaseEnter') + $t('simpleSpelling')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 电话 -->
						<FormItem :label="$t('phone')" prop="phone">
							<Input v-model.trim="submitData.phone" :placeholder="$t('pleaseEnter') + $t('phone')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 邮箱 -->
						<FormItem :label="$t('email')" prop="email">
							<Input v-model.trim="submitData.email" :placeholder="$t('pleaseEnter') + $t('email')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 角色 -->
						<FormItem :label="$t('roleIds')" prop="roleIds">
							<Input v-model.trim="submitData.roleIds" :placeholder="$t('pleaseEnter') + $t('roleIds')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 公司 -->
						<FormItem :label="$t('company')" prop="companyIds">
							<Input v-model.trim="submitData.companyIds" :placeholder="$t('pleaseEnter') + $t('company')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 部门 -->
						<FormItem :label="$t('department')" prop="departmentIds">
							<Input v-model.trim="submitData.departmentIds" :placeholder="$t('pleaseEnter') + $t('department')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 备注 -->
						<FormItem :label="$t('remark')" prop="remark">
							<Input v-model.trim="submitData.remark" :placeholder="$t('pleaseEnter') + $t('remark')" />
						</FormItem>
					</Col>
				</Row>
				<!-- 是否有效 -->
				<Row>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 是否有效 -->
						<FormItem :label="$t('isAdministrator')" prop="isAdministrator">
							<i-switch size="large" v-model="submitData.isAdministrator" :true-value="1" :false-value="0">
								<span slot="open">{{ $t("open") }}</span>
								<span slot="close">{{ $t("close") }}</span>
							</i-switch>
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 是否有效 -->
						<FormItem :label="$t('enabled')" prop="enabled">
							<i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
								<span slot="open">{{ $t("open") }}</span>
								<span slot="close">{{ $t("close") }}</span>
							</i-switch>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<!-- 按钮 -->
			<div slot="footer">
				<Button size="small" @click="cancelClick">取消</Button>
				<Button size="small" @click="submitClick">保存</Button>
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
									<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 账号（工号） -->
										<FormItem :label="$t('account')" prop="account">
											<Input v-model="req.account" :placeholder="$t('pleaseEnter') + $t('account')" @on-search="searchClick" />
										</FormItem>
										<!-- 用户名 -->
										<FormItem :label="$t('userName')" prop="name">
											<Input v-model="req.name" :placeholder="$t('pleaseEnter') + $t('name')" @on-search="searchClick" />
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
							<button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick" @on-delete-click="deleteClick"></button-custom>
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
	insertUserReq,
	deleteUserReq,
	modifyUserReq
} from "@/api/bill-design-manage/menu-manage.js";
import { getButtonBoolean, renderIsEnabled } from "@/libs/tools";
// 获取数据字典
//import { getlistReq } from "@/api/system-manager/data-item";

export default {
	name: "menumanage",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			drawerTitle: this.$t("add"),
			btnData: [],
			isAdd: true,
			selectObj: null, //表格选中
			selectArr: [], //表格多选
			submitData: {
				account: "",
				name: "",
				simpleSpelling: "",
				phone: "",
				email: "",
				roleIds: "",
				companyIds: "",
				departmentIds: "",
                remark:"",
                isAdministrator:0,
				enabled: 1
			},
			drawerFlag: false,
			req: {
				account: "",
				name: "",
				...this.$config.pageConfig
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
				{ title: this.$t("account"), key: "account", align: "center", tooltip: true },
				{ title: this.$t("userName"), key: "name", align: "center", tooltip: true },
				{ title: this.$t("simpleSpelling"), key: "simpleSpelling", align: "center", tooltip: true },
				{ title: this.$t("email"), key: "email", align: "center", tooltip: true },
				{ title: this.$t("phone"), key: "phone", align: "center", tooltip: true },
				{ title: this.$t("remark"), key: "remark", align: "center", tooltip: true },
				{ title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled }
			], // 表格数据
			// 验证实体
			ruleValidate: {
				account: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("account"),
						trigger: "change",
					},
				],
				name: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("userName"),
					},
				]
			},
		};
	},
	activated() {
        console.log("初始化查询数据！");
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
			const { sourceCode, sourceName, sourceType } = this.req;
			let obj = {
				orderField: "account", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					sourceCode,
					sourceName,
					sourceType,
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
			this.drawerFlag = true;
			this.isAdd = true;
			this.drawerTitle = this.$t("add");
		},
		// 点击编辑按钮触发
		editClick() {
			console.log('处罚编辑');
			if (this.selectObj) {
				this.submitData = { ...this.selectObj };
				this.drawerFlag = true;
				this.isAdd = false;
				this.drawerTitle = this.$t("edit");
			} else this.$Msg.warning(this.$t("oneData"));
		},
		//提交
		submitClick() {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					let obj = { ...this.submitData };
					let request = this.isAdd ? insertUserReq(obj) : modifyUserReq(obj);
					request.then((res) => {
						if (res.code === 200) {
							this.$Msg.success(`${this.drawerTitle}${this.$t("success")}`);
							//跳转至数据集
							// if (isSkip) {
							// 	this.$router.push({ name: "dataset", query: { sourceCode: this.submitData.sourceCode } });
							// }
							this.pageLoad(); //刷新表格
							this.cancelClick();
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")}` + res.message);
					});
				}
			});
		},
		cancelClick() {
			this.drawerFlag = false;
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
					deleteUserReq({ multiId: deleteArr }).then((res) => {
						if (res.code === 200) {
							this.$Msg.success("删除成功");
							this.pageLoad();
						}
					});
				},
				//   onCancel: () => this.clearGraphData(),
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
		}
	}
};
</script>
<style lang="less" scope>
.testBtn {
	padding: 5px 16px;
	color: #fff;
	background: #f7a428;
	border: 1px solid #f7a428;
	border-radius: 0;
}
.testBtn:hover {
	padding: 5px 16px;
	color: #fff;
	background: #e6a23c;
	border: 1px solid #e6a23c;
	border-radius: 0;
}
</style>
