/* 工作簿管理 */
<template>
	<div class="page-style">
		<!-- 左侧抽屉 -->
		<Modal v-model="drawerFlag" :title="drawerTitle" width="1000" :mask-closable="false" :closable="true" :before-close="cancelClick">
			<Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="100" :label-colon="true">
				<Row :gutter="10">
					<Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
						<!-- 工作簿名称 -->
						<FormItem :label="$t('workBookName')" prop="workBookName">
							<Input v-model.trim="submitData.workBookName" :placeholder="$t('pleaseEnter') + $t('workBookName')" cleabler />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
						<!-- 工作簿编码 -->
						<FormItem :label="$t('workBookCode')" prop="workBookCode">
							<Input v-model.trim="submitData.workBookCode" :placeholder="$t('pleaseEnter') + $t('workBookCode')" cleabler />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
						<!-- 数据集 -->
						<FormItem :label="$t('setName')" prop="datasetId">
							<Select v-model="submitData.datasetId" filterable clearable :placeholder="$t('pleaseSelect') + $t('setName')">
								<Option v-for="(item, index) in datasetList" :value="item.id" :key="index">{{ item.datasetName }}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
						<!-- 描述 -->
						<FormItem :label="$t('description')" prop="des">
							<Input v-model.trim="submitData.des" :placeholder="$t('pleaseEnter') + $t('description')" cleabler />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
						<!-- 备注 -->
						<FormItem :label="$t('remark')" prop="remark">
							<Input v-model.trim="submitData.remark" :placeholder="$t('pleaseEnter') + $t('remark')" cleabler />
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
				<Button size="small" @click="submitClick">确定</Button>
			</div>
		</Modal>
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
							<button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick" @on-delete-click="deleteClick"></button-custom>
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
				>
					<template slot="datasetId" slot-scope="{ row }">
						<span>{{ dataSetIdName[row.datasetId] }}</span>
					</template>
					<template slot="operator" slot-scope="{ row }">
						<Button class="tableBtn" type="text" @click="design(row)">设计</Button>&nbsp;
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
	</div>
</template>

<script>
import { getpagelistReq, addReq, deleteReq, modifyReq } from "@/api/bill-design-manage/workbook-manage.js";
import { getButtonBoolean, renderIsEnabled } from "@/libs/tools";
import { getDataSetListReq } from "@/api/bill-design-manage/data-set-config.js";
export default {
	components: {},
	name: "workbook-manage",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			drawerTitle: this.$t("add"),
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
			drawerFlag: false,
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
				{ title: this.$t("workBookName"), key: "workBookName", align: "center", tooltip: true },
				{ title: this.$t("workBookCode"), key: "workBookCode", align: "center", tooltip: true },
				{ title: this.$t("setName"), slot: "datasetId", align: "center", tooltip: true },
				{ title: "备注", key: "remark", align: "center", tooltip: true },
				{ title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled, width: 80 },
				{ title: this.$t("operator"), slot: "operator", align: "center", width: "100" },
			], // 表格数据
			// 验证实体
			ruleValidate: {
				workBookName: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("workBookName"),
					},
				],
				workBookCode: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("workBookCode"),
					},
				],
			},
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
			this.drawerFlag = true;
			this.isAdd = true;
			this.drawerTitle = this.$t("add");
		},
		// 点击编辑按钮触发
		editClick() {
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
					let request = this.isAdd ? addReq(obj) : modifyReq(obj);
					request.then((res) => {
						if (res.code === 200) {
							this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
							this.pageLoad(); //刷新表格
							this.cancelClick();
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")}${res.message}`);
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
			if (this.selectObj) {
				this.$Modal.confirm({
					title: "确认要删除该数据吗?",
					onOk: () => {
						const obj = { ...this.selectObj };
						deleteReq(obj).then((res) => {
							if (res.code === 200) {
								this.$Message.success("删除成功");
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
			const { workBookName, workBookCode, datasetId } = data;
			const href = this.skipUrl("workbookPreview", workBookCode, workBookName, datasetId);
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
		skipUrl(key, workBookCode, workBookName, datasetId) {
			const obj = {
				workbookPreview: "/bill-design-manage/workbook-preview",
				workbookDesign: "/bill-design-manage/workbook-design",
			};
			const { href } = this.$router.resolve({
				path: obj[key],
				query: { workBookCode, workBookName, datasetId },
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
