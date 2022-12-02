/* 数据源 */
<template>
	<div class="page-style">
		<!-- 左侧抽屉 -->
		<Modal v-model="drawerFlag" :title="drawerTitle" width="1000" :mask-closable="false" :closable="true" :before-close="cancelClick">
			<Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="100" :label-colon="true">
				<Row :gutter="10">
					<Col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
						<!-- 数据源类型 -->
						<FormItem :label="$t('dataSourceType')" prop="sourceType">
							<Select v-model="submitData.sourceType" clearable :placeholder="$t('pleaseSelect') + $t('status')" transfer>
								<Option v-for="(item, i) in dataSourceTypeList" :value="item.detailName" :key="i">
									{{ item.detailName }}
								</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
						<!-- 数据源编码 -->
						<FormItem :label="$t('dataSourceCode')" prop="sourceCode">
							<Input v-model.trim="submitData.sourceCode" :placeholder="$t('pleaseEnter') + $t('dataSourceCode')" v-if="this.isAdd" />
							<span v-else>{{ submitData.sourceCode }}</span>
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
						<!-- 数据源名称 -->
						<FormItem :label="$t('dataSourceName')" prop="sourceName">
							<Input v-model.trim="submitData.sourceName" :placeholder="$t('pleaseEnter') + $t('dataSourceName')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 数据源描述 -->
						<FormItem :label="$t('dataSourceDesc')" prop="sourceDesc">
							<Input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" v-model.trim="submitData.sourceDesc" :placeholder="$t('pleaseEnter') + $t('dataSourceDesc')" />
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="10" v-if="submitData.sourceType === 'http'">
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 请求路径 -->
						<FormItem :label="$t('httpAddress')" prop="httpAddress">
							<Input v-model.trim="submitData.httpAddress" :placeholder="$t('pleaseEnter') + $t('httpAddress')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 请求方式 -->
						<FormItem :label="$t('httpWay')" prop="httpWay">
							<Input v-model.trim="submitData.httpWay" :placeholder="$t('pleaseEnter') + $t('httpWay')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 请求头 -->
						<FormItem :label="$t('httpHeader')" prop="httpHeader">
							<Input v-model.trim="submitData.httpHeader" :placeholder="$t('pleaseEnter') + $t('httpHeader')" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 请求体 -->
						<FormItem :label="$t('httpBody')" prop="httpBody">
							<Input v-model.trim="submitData.httpBody" :placeholder="$t('pleaseEnter') + $t('httpBody')" />
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="10" v-else>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 请求路径 -->
						<FormItem label="连接串" prop="sourceConnect">
							<Input type="password" v-model.trim="submitData.sourceConnect" :placeholder="$t('pleaseEnter') + '连接串'" />
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
				<Button size="small" @click="testClick" class="testBtn">测试</Button>
				<Button size="small" @click="submitClick(false)" style="padding: 5px 16px">保存</Button>
				<Button size="small" @click="submitClick(true)">保存并跳转至数据集</Button>
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
										<!-- 数据源编码 -->
										<FormItem :label="$t('dataSourceCode')" prop="sourceCode">
											<Input v-model="req.sourceCode" :placeholder="$t('pleaseEnter') + $t('dataSourceCode')" @on-search="searchClick" />
										</FormItem>
										<!-- 数据源名称 -->
										<FormItem :label="$t('dataSourceName')" prop="sourceName">
											<Input v-model="req.sourceName" :placeholder="$t('pleaseEnter') + $t('dataSourceName')" @on-search="searchClick" />
										</FormItem>
										<!-- 数据源类型 -->
										<FormItem :label="$t('dataSourceType')" prop="sourceType">
											<Select v-model="req.sourceType" clearable :placeholder="$t('pleaseSelect') + $t('sourceType')" transfer>
												<Option v-for="(item, i) in dataSourceTypeList" :value="item.detailCode" :key="i">
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
							<button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick" @on-delete-click="deleteClick"></button-custom>
						</i-col>
					</Row>
				</div>
				<Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick" @on-selection-change="selectClick"></Table>
				<page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
			</Card>
		</div>
	</div>
</template>

<script>
import { getpagelistReq, insertDataSourceReq, deleteDataSourceReq, modifyDataSourceReq, testConnection } from "@/api/bill-design-manage/data-source.js";
import { getButtonBoolean, renderIsEnabled } from "@/libs/tools";
import { getlistReq } from "@/api/system-manager/data-item";

export default {
	name: "datasource",
	data() {
		return {
			searchPoptipModal: false,
			isConnectSuccess: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			drawerTitle: this.$t("add"),
			btnData: [],
			isAdd: true,
			selectObj: null, //表格选中
			selectArr: [], //表格多选
			dataSourceTypeList: [],
			submitData: {
				sourceCode: "",
				sourceName: "",
				sourceDesc: "",
				sourceType: "",
				sourceConnect: "",
				httpAddress: "",
				httpWay: "POST",
				httpHeader: '{"Content-Type":"application/json;charset=UTF-8"}',
				httpBody: "",
				enabled: 1,
			},
			drawerFlag: false,
			req: {
				sourceCode: "",
				sourceName: "",
				sourceDesc: "",
				sourceType: "",
				sourceConnect: "",
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
				{ title: this.$t("dataSourceCode"), key: "sourceCode", align: "center", tooltip: true },
				{ title: this.$t("dataSourceName"), key: "sourceName", align: "center", tooltip: true },
				{ title: this.$t("dataSourceDesc"), key: "sourceDesc", align: "center", tooltip: true },
				{ title: this.$t("dataSourceType"), key: "sourceType", align: "center", tooltip: true },
				{ title: this.$t("enabled"), key: "enabled", align: "center", tooltip: true, render: renderIsEnabled },
			], // 表格数据
			// 验证实体
			ruleValidate: {
				sourceType: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("dataSourceType"),
						trigger: "change",
					},
				],
				sourceCode: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("dataSourceCode"),
					},
				],
				sourceName: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("dataSourceName"),
					},
				],
			},
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		this.getDataItemData();
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
				orderField: "sourceCode", // 排序字段
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
			this.isConnectSuccess = false;
			this.drawerFlag = true;
			this.isAdd = true;
			this.drawerTitle = this.$t("add");
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				// let { sourceCode, sourceConnect, sourceDesc, sourceName, sourceType } = this.selectObj;
				this.isConnectSuccess = false;
				this.submitData = { ...this.selectObj };
				this.drawerFlag = true;
				this.isAdd = false;
				this.drawerTitle = this.$t("edit");
			} else this.$Msg.warning(this.$t("oneData"));
		},
		//提交
		submitClick(isSkip = false) {
			//测试连接失败
			if (!this.isConnectSuccess) {
				this.$Message.error("未测试或测试连接失败,请确认！");
				return;
			}
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					let obj = { ...this.submitData };
					let request = this.isAdd ? insertDataSourceReq(obj) : modifyDataSourceReq(obj);
					request.then((res) => {
						if (res.code === 200) {
							this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
							//跳转至数据集
							if (isSkip) {
								this.$router.push({ name: "dataset", query: { sourceCode: this.submitData.sourceCode } });
							}
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
				this.$Message.error("无选中删除数据");
				return;
			}
			this.$Modal.confirm({
				title: "确认要删除该数据吗?",
				onOk: () => {
					const deleteArr = deleteData.map((o) => o.sourceCode);
					deleteDataSourceReq({ sourceCode: deleteArr }).then((res) => {
						if (res.code === 200) {
							this.$Message.success("删除成功");
							this.pageLoad();
						}
					});
				},
				//   onCancel: () => this.clearGraphData(),
			});
		},
		//测试连接
		testClick() {
			//   const { sourceCode, sourceName, sourceDesc, sourceType, sourceConnect } = this.submitData;
			//   console.log(sourceCode, sourceName, sourceDesc, sourceType, sourceConnect);
			const obj = { ...this.submitData };
			testConnection(obj).then((res) => {
				if (res.code === 200) {
					this.$Message.success("连接成功");
					this.isConnectSuccess = true;
					return;
				}
				this.$Message.error("数据源连接失败");
				this.isConnectSuccess = false;
			});
		},
		// 获取数据字典数据
		async getDataItemData() {
			this.dataSourceTypeList = await this.getDataItemDetailList("dataSource");
		},
		async getDataItemDetailList(itemCode) {
			let arr = [];
			await getlistReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
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
