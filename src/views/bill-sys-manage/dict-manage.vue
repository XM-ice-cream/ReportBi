/* 数据源 */
<template>
	<div class="page-style">
		<!-- 左侧抽屉 -->
		<Modal
			v-model="treeFlag"
			draggable
			scrollable
			width="800"
			:title="drawerTitle"
			:mask-closable="false"
			:closable="true"
			:before-close="cancelClick"
			:reset-drag-position="true"
		>
			<Form ref="submitTreeReq" :model="treesubmitData" :rules="ruleValidate" :label-width="100">
				
				<!-- 父节点 -->
				<Row>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem :label="$t('parentId')" prop="parentId">
							<!-- 选择父节点 -->
							<Select v-model="treesubmitData.parentId" clearable :placeholder="$t('pleaseSelect') + $t('parentId')" transfer>
								<Option v-for="(item, i) in parentList" :value="item.value" :key="i" >
									{{ item.key }}
								</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="10">
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 项目名 -->
						<FormItem :label="$t('itemName')" prop="itemName">
							<Input v-model.trim="treesubmitData.itemName" :placeholder="$t('pleaseEnter') + $t('itemName')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 项目值 -->
						<FormItem :label="$t('itemCode')" prop="itemCode">
							<Input v-model.trim="treesubmitData.itemCode" :placeholder="$t('pleaseEnter') + $t('itemCode')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 排序吗 -->
						<FormItem :label="$t('sortCode')" prop="sortCode">
							<Input v-model.trim="treesubmitData.sortCode" :placeholder="$t('pleaseEnter') + $t('sortCode')" />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<!-- 按钮 -->
			<div slot="footer">
				<Button size="small" @click="cancelTreeClick">取消</Button>
				<Button size="small" @click="submitTreeClick">保存</Button>
			</div>
		</Modal>
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
						<!-- 项目名 -->
						<FormItem :label="$t('itemName')" prop="detailName">
							<Input v-model.trim="submitData.detailName" :placeholder="$t('pleaseEnter') + $t('itemName')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 项目值 -->
						<FormItem :label="$t('itemCode')" prop="detailCode">
							<Input v-model.trim="submitData.detailCode" :placeholder="$t('pleaseEnter') + $t('itemCode')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 排序吗 -->
						<FormItem :label="$t('sortCode')" prop="sortCode">
							<Input v-model.trim="submitData.sortCode" :placeholder="$t('pleaseEnter') + $t('sortCode')" />
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
			<Row>
				<Col class="leftTree" :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
					<Card :bordered="true" dis-hover class="card-style" overflow = auto>
						<template>
							<Tree :data="treedata" @on-contextmenu="handleContextMenu" @on-select-change="nodeClick">
								<template #contextMenu>
									<DropdownItem @click.native="handleContextMenuAdd">新增</DropdownItem>
									<DropdownItem @click.native="handleContextMenuEdit">编辑</DropdownItem>
									<DropdownItem @click.native="handleContextMenuDelete" style="color: #ed4014">删除</DropdownItem>
								</template>
							</Tree>
						</template>
					</Card>
				</Col>
				<Col :xs="19" :sm="19" :md="19" :lg="19" :xl="19">
					<Card :bordered="false" dis-hover class="card-style">
						<div slot="title">
							<Row>
								<i-col span="4">
									<label>{{this.req.currentTitle}} / {{this.req.currentCode}}</label>
								</i-col>
								<i-col span="20">
									<button-custom :btnData="btnData"  @on-add-click="addClick" @on-edit-click="editClick" @on-delete-click="deleteClick"></button-custom>
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
				</Col>
			</Row>
		</div>
	</div>
</template>

<script>
import {
	getpagelistReq,
	insertDictDetailReq,
	deleteDictDetailReq,
	modifyDictDetailReq,
	insertDictReq,
	modifyDictReq,
	getTreeData
} from "@/api/bill-design-manage/dict-manage.js";
import { getButtonBoolean, renderIsEnabled } from "@/libs/tools";
// 获取数据字典
//import { getlistReq } from "@/api/system-manager/data-item";

export default {
	name: "dictmanage",
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
			treedata:[],
			parentList:[{key:'根节点',value:'0'}],
			contextData: null,		
			submitData: {
				detailCode: "",
				detailName: "",
				sortCode: 1,
                remark:"",
				enabled: 1
			},
			treesubmitData :{
				parentId:"",
				itemCode: "",
				itemName: "",
				sortCode: 1,
                remark:""
			},
			drawerFlag: false,
			treeFlag:false,
			req: {
				currentTitle:"根节点",
				currentCode:"0",
				currentId:"0",
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
				{ title: this.$t("itemName"), key: "detailName", align: "center", tooltip: true },
				{ title: this.$t("itemCode"), key: "detailCode", align: "center", tooltip: true },
				{ title: this.$t("sortCode"), key: "sortCode", align: "center", tooltip: true },
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
		getTree(){
			getTreeData()
			.then(res=>{
				//请规范写法
				if(res.code==200){
					this.treedata = res?.result||[];
				}
				
			}).catch(()=>(this.$Msg.warning("获取左侧树节点数据失败")));
		},
		nodeClick(data,node){
			this.req.currentId = node.id;
			this.req.currentCode = node.code;
			this.req.currentTitle = node.title;
			this.contextData = node;
			this.pageLoad();
		},
		handleContextMenu (data) {
			this.parentList.splice(1,this.parentList.length-1)
			this.parentList.push({key:'当前父节点',value:data.parentId});
			this.parentList.push({key:'当前节点',value:data.id});
			this.contextData = data;
		},
		handleContextMenuAdd () {
			this.treeFlag = true;
			this.isAdd = true;
			this.drawerTitle = this.$t("addTree");
		},
		handleContextMenuEdit () {
			console.log(this.contextData);
			if (this.contextData != null ) {
				this.treesubmitData = this.contextData;
				this.treesubmitData.itemCode = this.contextData.code;
				this.treesubmitData.itemName = this.contextData.title;
				
				this.treeFlag = true;
				this.isAdd = false;
			this.drawerTitle = this.$t("editTree");
			} else this.$Msg.warning(this.$t("ontTree"));
		},
		handleContextMenuDelete () {
			this.$Msg.warning('请联系超级管理员删除！');
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = true;
			let obj = {
				orderField: "sortcode", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					itemId:this.req.currentId
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
					let request = this.isAdd ? insertDictDetailReq(obj) : modifyDictDetailReq(obj);
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
		//提交
		submitTreeClick() {
			this.$refs.submitTreeReq.validate((validate) => {
				if (validate) {
					let obj = { ...this.treesubmitData };
					let request = this.isAdd ? insertDictReq(obj) : modifyDictReq(obj);
					request.then((res) => {
						if (res.code === 200) {
							this.$Msg.success(`${this.drawerTitle}${this.$t("success")}`);
							//跳转至数据集
							// if (isSkip) {
							// 	this.$router.push({ name: "dataset", query: { sourceCode: this.submitData.sourceCode } });
							// }
							this.getTree(); //刷新表格
							this.cancelTreeClick();
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")}` + res.message);
					});
				}
			});
		},
		cancelClick() {
			this.drawerFlag = false;
			this.$refs.submitReq.resetFields(); //清除表单红色提示
		},
		cancelTreeClick() {
			console.log(this.treesubmitData);
			this.treeFlag = false;
			this.$refs.submitTreeReq.resetFields(); //清除表单红色提示
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
					deleteDictDetailReq({ multiId: deleteArr }).then((res) => {
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
.leftTree {
	padding: 5px 5px;
}
.testBtn:hover {
	padding: 5px 16px;
	color: #fff;
	background: #e6a23c;
	border: 1px solid #e6a23c;
	border-radius: 0;
}
</style>
