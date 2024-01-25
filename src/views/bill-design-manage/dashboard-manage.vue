/* 仪表板管理 */
<template>
	<div class="page-style dashboard-manage">
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
						<!-- 仪表板名称 -->
						<FormItem label="仪表板名称" prop="name">
							<Input v-model.trim="submitData.name" :placeholder="$t('pleaseEnter') + '仪表板名称'" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 数据集 -->
						<FormItem label="数据集" prop="datasetId">
							<Select v-model="submitData.datasetId" clearable :placeholder="$t('pleaseSelect') + '数据集'" transfer filterable cleabler>
								<Option v-for="(item, i) in datasetList" :value="item.datasetId" :label="item.datasetName" :key="i"></Option>
							</Select>
						</FormItem>
					</Col>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 仪表板描述 -->
						<FormItem label="仪表板描述" prop="remark">
							<Input
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 5 }"
								v-model.trim="submitData.remark"
								:placeholder="$t('pleaseEnter') + '仪表板描述'"
							/>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<!-- 按钮 -->
			<div slot="footer">
				<Button size="small" @click="cancelClick">取消</Button>
				<Button size="small" @click="submitClick(false)">保存</Button>
			</div>
		</Modal>
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Form ref="searchReq" :model="req" inline :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
						<!-- 名称 -->
						<FormItem label="名称" prop="name">
							<Input v-model="req.name" :placeholder="$t('pleaseEnter') + '名称'" />
						</FormItem>
						<!-- 数据集 -->
						<FormItem label="数据集" prop="datasetId">
							<Select
								v-model="req.datasetId"
								clearable
								:placeholder="$t('pleaseSelect') + '数据集'"
								transfer
								filterable
								cleabler
								@on-change="searchClick"
								style="width: 200px"
							>
								<Option v-for="(item, i) in datasetList" :value="item.datasetId" :label="item.datasetName" :key="i"></Option>
							</Select>
						</FormItem>
						<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
					</Form>
				</div>
				<!-- 仪表板 -->
				<div class="dashboard-card">
					<div class="cardCell add-dashboard-cell" @click="addClick"><Icon type="md-add" /> 新增仪表板</div>
					<template v-for="item in data">
						<div class="cardCell" title="点击查看" @click="preview(item.reportCode, item.reportName)">
							<span class="title">
								<span class="name" :title="item.dashboardName">
									{{ item.dashboardName }}<Tag color="green" class="tag-dataset">TD-01</Tag>
									<span style="float: right">
										<i
											class="iconfont icon-menu-like-active menu-like"
											title="取消收藏"
											style="color: #ffb300; font-size: 20px"
											v-if="collectList.map((item) => item.collect).includes(item.reportCode)"
											@click.stop="deleteCollectList(item.reportCode)"
										></i>

										<i
											class="iconfont icon-menu-like menu-like"
											title="加入收藏"
											style="color: #ffb300; font-size: 20px"
											v-else
											@click.stop="addCollectList(item)"
										></i>
									</span>
								</span>
								<span class="remark">
									{{ item.remark }}
								</span>
							</span>

							<Row :gutter="24">
								<Col :xl="24" :xxl="24">
									<div class="box">
										数据集名称
										<span class="value"> JX N21X BOM ByRefdes </span>
									</div>
								</Col>
								<Col :xl="24" :xxl="12">
									<div class="box">
										创建人员
										<span class="value" :title="formatDate(item.createDate)"> 陈新明 </span>
									</div>
								</Col>
								<Col :xl="24" :xxl="12">
									<div class="box">
										创建时间
										<span class="value" :title="formatDate(item.createDate)"> {{ formatDate(item.createDate, "yyyy-MM-dd") }}</span>
									</div>
								</Col>
								<Col :xl="24" :xxl="12">
									<div class="box">
										修改人员
										<span class="value" :title="formatDate(item.createDate)"> 陈新明 </span>
									</div>
								</Col>

								<Col :xl="24" :xxl="12">
									<div class="box">
										修改时间
										<span class="value" :title="formatDate(item.modifyDate)">{{ formatDate(item.modifyDate, "yyyy-MM-dd") }}</span>
									</div>
								</Col>
							</Row>
							<div class="operator-btn">
								<Button>删除</Button>
								<Button @click.native.stop="editClick(item)">编辑</Button>
							</div>
						</div>
					</template>
				</div>
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
import { formatDate } from "@/libs/tools";
import { getpagelistReq as datasetconfigReq } from "@/api/bill-design-manage/data-set-config.js";
import { getCollectReq, addCollectReq, deleteCollectReq } from "@/api/bill-design-manage/workbook-manage.js";

export default {
	components: {},
	name: "dashboard-manage",
	data() {
		return {
			datasetList: [], //数据集
			data: [
				{
					dashboardName: "ALL Location",
					remark: "显示所有点信息",
					datasetCode: "TD-01",
					datasetName: "JX N21X BOM ByRefdes",
					datasetId: "3CDD481E600740F0BFBD9EDB0FC91EAF",
					modifyDate: new Date(),
					createDate: new Date(),
				},
				{
					dashboardName: "ALL Partname By Week",
					remark: "所有零件名称（按周）",
					datasetCode: "TD-01",
					datasetName: "JX N21X BOM ByRefdes",
					datasetId: "3CDD481E600740F0BFBD9EDB0FC91EAF",
					modifyDate: new Date(),
					createDate: new Date(),
				},
				{
					dashboardName: "ALL Partname By Week",
					remark: "所有零件名称（按周）",
					datasetCode: "TD-01",
					datasetName: "JX N21X BOM ByRefdes",
					modifyDate: new Date(),
					createDate: new Date(),
				},
				{
					dashboardName: "ALL Partname By Week",
					remark: "所有零件名称（按周）",
					datasetCode: "TD-01",
					datasetName: "JX N21X BOM ByRefdes",
					modifyDate: new Date(),
					createDate: new Date(),
				},
				{
					dashboardName: "ALL Partname By Week",
					remark: "所有零件名称（按周）",
					datasetCode: "TD-01",
					datasetName: "JX N21X BOM ByRefdes",
					modifyDate: new Date(),
					createDate: new Date(),
				},
				{
					dashboardName: "ALL Partname By Week",
					remark: "所有零件名称（按周）",
					datasetCode: "TD-01",
					datasetName: "JX N21X BOM ByRefdes",
					modifyDate: new Date(),
					createDate: new Date(),
				},
			],
			drawerFlag: false,
			collectList: [], //收藏
			formatDate: formatDate,
			pageConfig: { ...this.$config.pageConfig },
			req: { name: "", datasetCode: "", ...this.$config.pageConfig }, //查询数据
			isAdd: false,
			submitData: {},
			drawerTitle: "",
			// 验证实体
			ruleValidate: {
				name: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}仪表板名称`,
					},
				],
				datasetId: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}数据集`,
						trigger: "change",
					},
				],
				remark: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}仪表板描述`,
					},
				],
			},
		};
	},
	mounted() {
		this.getDataSetList(); //获取到所有数据集
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
			const { reportType, reportName, reportCode, remark } = this.req;
			//   this.tableConfig.loading = true;
			let obj = {
				orderField: "reportType", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					reportType,
					reportName,
					reportCode,
					remark,
					codeList: this.roleBtn.toString(),
				},
			};
			getpagelistReq(obj)
				.then((res) => {
					// this.tableConfig.loading = false;
					if (res.code === 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						this.data = data || [];
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
					}
				})
				.catch();
		},
		//新增仪表板
		addClick() {
			this.drawerFlag = true;
			this.isAdd = true; //新增
			this.submitData = {};
			this.drawerTitle = "新增仪表板";
		},
		//编辑仪表板
		editClick(data) {
			// this.drawerFlag = true;
			// this.isAdd = false;
			// this.submitData = { ...data };
			// this.drawerTitle = "编辑仪表板";
			this.$router.push({ name: "dashboard-design" }); //跳转到仪表板设计页面
			window.localStorage.setItem("dashboardObj", JSON.stringify(data));
		},
		cancelClick() {
			this.drawerFlag = false;
			this.$refs.submitReq.resetFields(); //清除表单红色提示
		},
		//提交
		submitClick() {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					let obj = { ...this.submitData };
					// let request = this.isAdd ? insertDataSourceReq(obj) : modifyDataSourceReq(obj);
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
		//获取到所有数据集
		getDataSetList() {
			let obj = {
				orderField: "datasetCode", // 排序字段
				ascending: true, // 是否升序
				pageSize: 1000, // 分页大小
				pageIndex: 1, // 当前页码
				data: {
					enabled: 1,
				},
			};
			datasetconfigReq(obj).then((res) => {
				if (res.code === 200) {
					if (res.code === 200) {
						let { data } = res.result;
						this.datasetList = data || [];
					}
				}
			});
		},
		//获取用户收藏
		getCollectList() {
			const obj = { type: "Dashboard" };
			getCollectReq(obj).then((res) => {
				if (res.code == 200) {
					this.collectList = res.result || [];
				}
			});
		},
		//新增用户收藏
		addCollectList(data) {
			const { reportCode, reportName } = data;
			const obj = { type: "Dashboard", collect: reportCode, name: reportName };
			addCollectReq(obj).then((res) => {
				if (res.code == 200) {
					this.getCollectList();
				}
			});
		},
		//删除用户收藏
		deleteCollectList(data) {
			const id = this.collectList.filter((item) => item.collect === data)[0].id;
			const obj = { id };
			deleteCollectReq(obj).then((res) => {
				if (res.code == 200) {
					this.getCollectList();
				}
			});
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
.dashboard-manage .comment .ivu-card-body {
	background: #f5f7f9;
}
.dashboard-manage .ivu-form-item {
	margin-bottom: 0;
}
.dashboard-manage .ivu-col {
	margin: 5px 0;
	padding-left: 0 !important;
	padding-right: 0 !important;
}
</style>
<style scoped lang="less">
.dashboard-card {
	height: calc(100% - 55px);
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	overflow-y: scroll;
	overflow-x: hidden;
	align-content: flex-start;
	background-color: #f5f7f9;
	padding-bottom: 14px;
	.cardCell {
		width: 23.8%;
		/* background: #ccc; */
		box-shadow: 3px 5px 7px #d0dbf194;
		padding: 20px 20px 0;
		margin-top: 15px;
		margin-left: 15px;
		position: relative;
		background: #fff;
		border-radius: 0px;
		cursor: pointer;
		transition: all 0.2s ease-out;
		border-top: 4px solid #27ce88;
		border-radius: 2px 2px 0 0;
		&:hover {
			transform: translateY(-5px);
			cursor: pointer;
		}
		.title {
			width: 100%;
			height: 3.5rem;
			line-height: 1.4rem;
			display: inline-block;
			font-size: 0.92rem;
			color: #3a3b3ae0;
			font-weight: 600;
			margin-bottom: 10px;
			//标题名
			.name {
				width: 100%;
				overflow: hidden;
				display: inline-block;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #4f6185;
				font-weight: bold;
				.tag-dataset {
					margin-left: 10px;
					font-weight: normal;
				}
			}
			.remark {
				display: inline-block;
				color: #c7c6cc;
				font-size: 12px;
				width: 100%;
				font-weight: normal;
			}
		}
		.operator-btn {
			width: calc(100% + 40px);
			height: 40px;
			margin-left: -20px;
			border-top: 1px solid #f3f3f5;
			margin-top: 20px;
			padding: 5px 0;
			button {
				width: 50%;
				border: none;
				height: 100%;
				color: #27ce88;
				border-radius: 0;
				&:first-child {
					color: #babcc3;
					border-right: 1px solid #f3f3f5;
				}
			}
		}

		.box {
			line-height: 20px;
			padding: 5px 10px;
			color: #7c8994;
			.value {
				display: inline-block;
				width: calc(100% - 4rem);
				text-align: left;
				float: right;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #334670;
				font-weight: bold;
			}
		}
	}
}
.add-dashboard-cell {
	border-top: 0 !important;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 !important;
	color: #b8bbc2 !important;
	background-color: #fff;
	font-size: 16px;
	transition: all 0.3s;

	i {
		font-size: 18px;
		margin-right: 5px;
	}
	&:hover {
		border: 2px solid #27ce88 !important;
		transform: translateY(0px) !important;
		box-shadow: 0px 0px 10px #1e9f6961 inset;
		color: #27ce88 !important;
	}
}
// 适配
@media (min-width: 1280px) {
	.dashboard-card .cardCell {
		width: 31.6%;
	}
}
@media (min-width: 1536px) {
	.dashboard-card .cardCell {
		width: 23.7%;
	}
}
@media (min-width: 1745.45px) {
	.dashboard-card .cardCell {
		width: 23.8%;
	}
}
@media (min-width: 1920px) {
	.dashboard-card .cardCell {
		width: 24%;
	}
}
</style>
