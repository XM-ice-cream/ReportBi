/* MPE FACA */
<template>
	<div class="page-style">
		<!-- 右侧抽屉 Form表单 -->
		<Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
			<Form ref="submitReq" :model="submitData" :label-width="90" :label-colon="true" @submit.native.prevent>
				<FormItem label="FA回复信息" prop="fA_REASON">
					<Input v-model="submitData.fA_REASON" :placeholder="$t('pleaseEnter') + 'FA回复信息'" clearable />
				</FormItem>
				<FormItem label="CA回复信息" prop="cA_REASON">
					<Input v-model="submitData.cA_REASON" :placeholder="$t('pleaseEnter') + 'CA回复信息'" clearable />
				</FormItem>
				<FormItem label="Q回复原因" prop="q_REASON">
					<Input v-model="submitData.q_REASON" :placeholder="$t('pleaseEnter') + 'Q回复原因'" clearable />
				</FormItem>
				<!-- 按钮 -->
				<FormItem>
					<drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
				</FormItem>
			</Form>
		</Drawer>
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
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" :rules="ruleValidate" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 起始时间 -->
										<FormItem :label="$t('startTime')" prop="startTime">
											<DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
										</FormItem>
										<!-- 结束时间 -->
										<FormItem :label="$t('endTime')" prop="endTime">
											<DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
										</FormItem>
										<!-- 创建时间 -->
										<FormItem :label="$t('createTime')" prop="createdate">
											<DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('createTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.createdate"></DatePicker>
										</FormItem>
										<!-- UnitId -->
										<FormItem label="UnitId" prop="unitId">
											<Input v-model.trim="req.unitId" clearable />
										</FormItem>
										<!-- Error_Item -->
										<FormItem label="Erro_Item " prop="erro_Item">
											<Input v-model.trim="req.erro_Item" clearable />
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
							<button-custom :btnData="btnData" @on-edit-click="editClick"></button-custom>
						</i-col>
					</Row>
				</div>
				<Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data" @on-current-change="currentClick"> </Table>
			</Card>
		</div>
	</div>
</template>

<script>
import { getlistReq, modifyReq } from "@/api/bill-manage/mpe-faca";
import { getButtonBoolean, renderDate, formatDate } from "@/libs/tools";

export default {
	components: {},
	name: "mpe-faca",
	data() {
		return {
			searchPoptipModal: false,
			drawerFlag: false,
			drawerTitle: "",
			btnData: [],
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			submitData: {},
			req: {
				unitId: "",
				createdate: "",
				endTime: "",
				startTime: "",
				erro_Item: "",
			}, //查询数据
			columns: [
				{ type: "index", fixed: "left", width: 50, align: "center" },
				{ title: "UnitId", key: "unitId", align: "center", minWidth: 150, tooltip: true },
				{ title: "Station", key: "station", align: "center", minWidth: 100, tooltip: true },
				{ title: "检测项字段", key: "errO_ITEM", align: "center", minWidth: 150, tooltip: true },
				{ title: "创建时间", key: "createdate", align: "center", minWidth: 150, tooltip: true, render: renderDate },
				{ title: "FA回复信息", key: "fA_REASON", align: "center", minWidth: 100, tooltip: true },
				{ title: "FA回复人员", key: "fA_USER", align: "center", minWidth: 100, tooltip: true },
				{ title: "FA回复时间", key: "fA_CREATEDATE", align: "center", minWidth: 110, tooltip: true, render: renderDate },
				{ title: "CA回复信息", key: "cA_REASON", align: "center", minWidth: 90, tooltip: true },
				{ title: "CA回复人员", key: "cA_USER", align: "center", minWidth: 90, tooltip: true },
				{ title: "CA回复时间", key: "cA_CREATEDATE", align: "center", minWidth: 110, tooltip: true, render: renderDate },
				{ title: "Q回复原因", key: "q_REASON", align: "center", minWidth: 90, tooltip: true },
				{ title: "Q回复人员", key: "q_USER", align: "center", minWidth: 90, tooltip: true },
				{ title: "Q回复时间", key: "q_CREATEDATE", align: "center", minWidth: 110, tooltip: true, render: renderDate },
			], // 表格数据
			selectObj: null, //表格选中数据
			// 验证实体
			ruleValidate: {
				unitId: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "unitId",
					},
				],
			},
		};
	},
	activated() {
		this.autoSize();
		this.tableConfig.loading = false;
		window.addEventListener("resize", () => this.autoSize);
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
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					const { unitId, erro_Item, createdate, startTime, endTime } = this.req;
					let obj = {
						unitId,
						erro_Item,
						createdate: formatDate(createdate),
						startTime: formatDate(startTime),
						endTime: formatDate(endTime),
					};
					getlistReq(obj)
						.then((res) => {
							this.tableConfig.loading = false;
							if (res.code === 200) {
								this.data = res?.result || [];
							}
						})
						.catch(() => (this.tableConfig.loading = false));
					this.searchPoptipModal = false;
				}
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				this.submitData = { ...this.selectObj };
				this.drawerFlag = true;
				this.drawerTitle = this.$t("edit");
			} else this.$Msg.warning(this.$t("oneData"));
		},
		// 某一行高亮时触发
		currentClick(currentRow) {
			this.selectObj = currentRow;
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 120 - 60;
		},

		// ==================弹框
		//提交
		submitClick(isClose = false) {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					let obj = { ...this.submitData };
					modifyReq(obj).then((res) => {
						if (res.code === 200) {
							this.selectObj = null;
							this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
							this.pageLoad();
							if (isClose) this.cancelClick();
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
					});
				}
			});
		},
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
			this.$refs.submitReq.resetFields(); //清除表单红色提示
		},
	},
	mounted() {
		// this.pageLoad();
	},
};
</script>
<style scoped></style>
