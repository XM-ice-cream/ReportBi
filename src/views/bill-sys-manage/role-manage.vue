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
						<!-- 角色ID -->
						<FormItem :label="$t('roleId')" prop="roleId">
							<Input v-model.trim="submitData.roleId" :placeholder="$t('pleaseEnter') + $t('roleId')" v-if="this.isAdd" />
							<span v-else>{{ submitData.roleId }}</span>
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 角色名称 -->
						<FormItem :label="$t('roleName')" prop="roleName">
							<Input v-model.trim="submitData.roleName" :placeholder="$t('pleaseEnter') + $t('roleName')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 菜单/按钮id -->
						<FormItem :label="$t('menu')" prop="simpleSpelling">
							<Tree :data="treeData" show-checkbox></Tree>
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
										<!-- 觉得ID -->
										<FormItem :label="$t('roleId')" prop="roleId">
											<Input v-model="req.roleId" :placeholder="$t('pleaseEnter') + $t('roleId')" @on-search="searchClick" />
										</FormItem>
										<!-- 角色名称 -->
										<FormItem :label="$t('roleName')" prop="roleName">
											<Input v-model="req.roleName" :placeholder="$t('pleaseEnter') + $t('roleName')" @on-search="searchClick" />
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
	insertRoleReq,
	deleteRoleReq,
	modifyRoleReq,
	getMenuTree
} from "@/api/bill-design-manage/role-manage.js";
import { getButtonBoolean, renderIsEnabled } from "@/libs/tools";
// 获取数据字典
//import { getlistReq } from "@/api/system-manager/data-item";

export default {
	name: "rolemanage",
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
			treeData: [],
			submitData: {
				roleId: "",
				roleName: "",
				menuButtonId: "",
				remark: "",
				enabled: 1
			},
			drawerFlag: false,
			req: {
				roleId: "",
				roleName: "",
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
				{ title: this.$t("roleId"), key: "roleId", align: "center", tooltip: true },
				{ title: this.$t("roleName"), key: "roleName", align: "center", tooltip: true },
				{ title: this.$t("menu"), key: "menuButtonId", align: "center", tooltip: true },
				{ title: this.$t("remark"), key: "remark", align: "center", tooltip: true },
				{ title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled }
			], // 表格数据
			// 验证实体
			ruleValidate: {
				roleId: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("roleId"),
						trigger: "change",
					},
				],
				roleName: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("roleName"),
					},
				]
			},
		};
	},
	activated() {
        console.log("初始化查询数据！");
		this.getTree();
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
		getTree(){
			getMenuTree()
				.then((res)=>{
						if(res.code === 200){
							this.treeData = res.result;
						}else{
							this.$Msg.error("获取菜单信息失败");
						}
					}
				).catch(() => (this.$Msg.error("获取菜单信息失败")));
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
			var children = this.treeData;
			while(children.length > 0){
				let child = [];
				children.forEach(item => {
						if(item.hasOwnProperty('indeterminate')){
							item.indeterminate = false;
						}
						if(item.hasOwnProperty('checked')){
							item.checked = false;
						}
						if(item.children.length>0){
							child = [...child,...item.children];
						} 
					}
				)
				children = child;
			}

			this.drawerFlag = true;
			this.isAdd = true;
			this.drawerTitle = this.$t("add");
		},
		// 点击编辑按钮触发
		editClick() {
			console.log('处罚编辑');
			if (this.selectObj) {
				this.submitData = { ...this.selectObj };
				// 权限回显
				let authArr = this.submitData.menuButtonId.split(',');
				var children = this.treeData;
				while(children.length > 0){
					let child = [];//不用用var 他会提升变量为全局变量 用let
					children.forEach(item => {
							let index = authArr.indexOf(item.id);
							//hasOwnProperty 这是啥 获取key吗
							//百度结果：hasOwnProperty(propertyName)方法 是用来检测属性是否为对象的自有属性，如果是，返回true，否者false; 参数propertyName指要检测的属性名我明白的 有这个key 就为false,没有key 就过 明白了
							// item.indeterminate = !item.hasOwnProperty('indetermnshinate'); //这句话啥意思 我这里的逻辑是重置树节点的选中状态，全部改为未选中，因为节点的这两个参数可能没有，所以我就判断是否包含这两个参数，如果有就
							// item.checked = !item.hasOwnProperty('checked');
							if(item.hasOwnProperty('indeterminate')){
								item.indeterminate = false;
							}
							if(item.hasOwnProperty('checked')){
								item.checked = false;
							} //好像有点bug 这里的逻辑感觉有点奇怪 代码写的有些乱
							if(index != -1){
								if(authArr[index+1] == '0'){
									if(item.hasOwnProperty('indeterminate')){
										item.indeterminate = true;
									}else{
										Vue.set(item, 'indeterminate', true);
									}
								}else{
									if(item.hasOwnProperty('indeterminate')){
										item.indeterminate = false;
									}else{
										Vue.set(item, 'indeterminate', false);
									}
									if(item.hasOwnProperty('checked')){
										item.checked = true;
									}else{
										Vue.set(item, 'checked', true);
									}
								}
							}
							if(item.children.length>0){
								child = [...child,...item.children];
							} 
						}
					)
					children = child;	
				}
				this.$forceUpdate();//这个没用吗
this.treeData = JSON.parse(JSON.stringify(this.treeData))
				this.drawerFlag = true;
				this.isAdd = false;
				this.drawerTitle = this.$t("edit");
			} else this.$Msg.warning(this.$t("oneData"));
		},
		//提交
		submitClick() {
			// 获取tree中的节点checked  和   indeterminate  
			this.submitData.menuButtonId = '';
			var children = this.treeData;
			while(children.length > 0){
				var child = [];
				children.forEach(item => {
						if(item.hasOwnProperty('indeterminate') && item.indeterminate  || item.checked ){
							const menuButtonId = this.submitData.menuButtonId;
							this.submitData.menuButtonId = `${menuButtonId},${item.id},${item.indeterminate?'0':'1'}`;
							item.children.length?child = [...child,...item.children]:"";
							// this.submitData.menuButtonId += ',';
							// this.submitData.menuButtonId += item.id;
							// this.submitData.menuButtonId += ',';
							// this.submitData.menuButtonId += item.indeterminate?'0':'1';//
							// if(item.children.length>0){
							// 	child = [...item.children];
							// } 
						}
					}
				)
				children = child;
			}
			this.submitData.menuButtonId = this.submitData.menuButtonId.substring(1);
			console.log(this.submitData.menuButtonId);

			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					let obj = { ...this.submitData };
					console.log(obj);
					let request = this.isAdd ? insertRoleReq(obj) : modifyRoleReq(obj);
					request.then((res) => {
						if (res.code === 200) {
							this.$Msg.success(`${this.drawerTitle}${this.$t("success")}`);
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
					deleteRoleReq({ multiId: deleteArr }).then((res) => {
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
