/* 预警邮箱设定 */
<template>
	<div class="page-style">
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
									<Form ref="searchReq" :model="req" :label-width="50" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 群组类型 -->
										<FormItem label="群组类型" prop="grouP_TYPE">
											<Select v-model.tirm="req.grouP_TYPE" transfer :placeholder="$t('pleaseSelect') + '群组类型'" clearable>
												<Option v-for="(item, index) in groupTypeList" :key="index" :value="item">{{ item }}</Option>
											</Select>
										</FormItem>
										<!-- 群组名称 -->
										<FormItem label="群组类型" prop="grouP_NAME">
											<Input v-model.trim="req.grouP_NAME" :placeholder="$t('pleaseEnter') + '群组名称'" clearable />
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
			<!-- <MaverickAddModify :drawerFlag="drawerFlag" :isAdd="isAdd" :selectObj="selectObj" :drawerTitle="drawerTitle"/> -->
			<MaverickAddModify :drawerFlag.sync="drawerFlag" :isAdd="isAdd" :selectObj="selectObj" :drawerTitle="drawerTitle" @pageLoad="pageLoad" />
		</div>
	</div>
</template>

<script>
import { getpagelistReq, deleteReq } from "@/api/bill-manage/maverick-email-setting.js";
import { formatDate, getButtonBoolean, exportFile, commaSplitString, limitStrLength } from "@/libs/tools";
import MaverickAddModify from "./maverick-email-setting/maverick-add-modify.vue";
export default {
	name: "maverick-email-setting",
	components: { MaverickAddModify },
	data() {
		return {
			searchPoptipModal: false,
			drawerFlag: false,
			isAdd: true,
			selectObj: {}, //选中值
			drawerTitle: "新增",
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			groupTypeList: ["FACA", "EarlyWarning", "MaverickSYLWarning"], //群组类型
			req: {
				grouP_TYPE: "",
				grouP_NAME: "",
				...this.$config.pageConfig,
			}, //查询数据
			columns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "群组类型", key: "grouP_TYPE", align: "center", tooltip: true, width: 150 },
				{ title: "群组名称", key: "grouP_NAME", align: "center", tooltip: true, width: 80 },
				{ title: "机种", key: "grouP_MODEL", align: "center", tooltip: true, width: 80 },
				{ title: "线体", key: "grouP_LINE", align: "center", tooltip: true, width: 100 },
				{ title: "站点", key: "grouP_STATION", align: "center", tooltip: true, width: 100 },
				{ title: "DEFECTCODE", key: "defectcode", align: "center", tooltip: true, minWidth: 100 },
				{ title: "邮箱群组", key: "emaiL_GROUP", align: "center", minWidth: 250 },
				{ title: "目标上限", key: "grouP_GOAL", align: "center", width: 100 },
				{ title: "目标下限", key: "grouP_TARGET", align: "center", width: 100 },
				{ title: "群组信息", key: "grouP_INFO", align: "center", width: 120 },
			], // 表格数据
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
			this.selectObj = null;
			this.req.pageIndex = 1;
			this.pageLoad();
			this.searchPoptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			let { grouP_TYPE, grouP_NAME } = this.req;
			this.tableConfig.loading = true;
			let obj = {
				orderField: "id", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					grouP_TYPE,
					grouP_NAME,
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
				.catch(() => (this.tableConfig.loading = false))
				.finally(() => {
					this.searchPoptipModal = false;
				});
		},
		// 点击新增按钮触发
		addClick() {
			this.isAdd = true;
			this.drawerFlag = true;
			this.drawerTitle = this.$t("add");
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				this.drawerFlag = true;
				this.drawerTitle = this.$t("edit");
				this.isAdd = false;
			} else this.$Msg.warning(this.$t("oneData"));
		},
		//删除
		deleteClick() {
			this.$Modal.confirm({
				title: "确认要删除该数据吗?",
				onOk: () => {
					deleteReq({ id: this.selectObj.id }).then((res) => {
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
		// 导出
		exportClick() {
			let { panel, unitId, workOrder } = this.req;
			if (panel || unitId || workOrder) {
				if (limitStrLength(panel) || limitStrLength(unitId) || limitStrLength(workOrder)) {
					this.$Msg.error("查询条件超出最大长度2000!");
					return;
				}
				const obj = {
					panel: commaSplitString(this.req.panel).join(),
					unitId: commaSplitString(this.req.unitId).join(),
					workOrder: this.req.workOrder,
				};

				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("material-query")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning(this.$t("pleaseEnter") + this.$t("selectQuery"));
			}
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.searchPoptipModal = false;
			this.$nextTick(() => {
				this.searchPoptipModal = true;
			});
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
