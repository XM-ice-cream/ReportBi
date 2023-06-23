/* 虚拟SN 报表 */
<template>
	<div class="page-style">
		<Modal v-model="modalFlag" title="Link 扩展SN" @on-ok="submitClick" @on-cancel="cancelClick" :mask-closable="false" :closable="false">
			<Form ref="submitReq" :model="submitData" :label-width="80" @submit.native.prevent @keyup.native.enter="getWorkOrderNumber">
				<!-- 工单 -->
				<FormItem label="工单">
					<Input ref="workorder" v-model.trim="submitData.workorder" :placeholder="$t('pleaseEnter') + '工单'" clearable></Input>
					<span style="color: #bdc0c6; maring-top: 10px">工单输入完成后按Enter(回车)可带出工单数量/对应的条码已使用数量</span>
				</FormItem>
			</Form>
			<div class="workorder-tips" v-if="tips">
				<span> {{ tips.split(",")[0] }}: </span>{{ tips.split(",")[1] }}
			</div>
		</Modal>
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="500" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick" :rules="ruleValidate">
										<!-- 工单 -->
										<FormItem label="工单" prop="workorder">
											<Input v-model.trim="req.workorder" :placeholder="$t('pleaseEnter') + '工单'" clearable></Input>
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
							<button-custom :btnData="btnData" @on-export-click="exportClick" @on-extendsn-click="extendsnClick"></button-custom>
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
				>
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
import { getpagelistReq, exportReq, addReq, getTargetInputNumReq } from "@/api/bill-manage/virtual-sn";
import { getButtonBoolean, formatDate, exportFile, inputSelectContent, renderDate } from "@/libs/tools";
export default {
	name: "virtual-sn",
	data() {
		return {
			tips: "",
			modalFlag: false,
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				workorder: "",
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
				{ title: "使用状态", key: "status", align: "center" },
				{ title: "使用状态code", key: "useD_FLAG", align: "center" },
				{ title: "工单", key: "worK_ORDER", align: "center" },
				{ title: "序号", key: "seriaL_NUMBER", align: "center", width: 125 },
				{ title: "操作人员ID", key: "emP_ID", align: "center" },
				{ title: "操作人员", key: "empno", align: "center" },
				{ title: "操作时间", key: "creatE_TIME", align: "center", render: renderDate },
				{ title: "机种", key: "modelname", align: "center" },
				{ title: "料号", key: "parT_NO", align: "center" },
			], // 表格数据
			// 验证实体
			ruleValidate: {
				workorder: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}工单`,
						trigger: "change",
					},
				],
			},
			submitData: {
				workorder: "",
			},
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
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			let { workorder } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					let obj = {
						orderField: "barcode", // 排序字段
						ascending: true, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							workorder,
						},
					};
					getpagelistReq(obj)
						.then((res) => {
							this.tableConfig.loading = false;
							if (res.code === 200) {
								let { data, pageSize, pageIndex, total, totalPage } = res.result;
								this.data = data || [];
								this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
								this.searchPoptipModal = false;
							}
						})
						.catch(() => (this.tableConfig.loading = false));
				}
			});
		},
		// 导出
		exportClick() {
			let { workorder } = this.req;
			let obj = {
				workorder,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("virtual-sn")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		//扩展SN
		extendsnClick() {
			this.modalFlag = true;
			this.$nextTick(() => {
				//光标聚焦
				inputSelectContent(this.$refs.workorder);
			});
		},
		//提交
		submitClick() {
			const { workorder } = this.submitData;
			if (workorder) {
				addReq({ workorder }).then((res) => {
					if (res.code === 200) {
						this.$Msg.success("提交成功");
						this.cancelClick(); //关闭弹框
					} else {
						this.$Msg.error(res.message);
						this.modalFlag = true;
					}
				});
			} else {
				this.$Msg.error("请输入工单");
			}
		},
		//获取工单投入数及目标数
		getWorkOrderNumber() {
			const { workorder } = this.submitData;
			if (workorder) {
				getTargetInputNumReq({ workorder }).then((res) => {
					if (res.code == 200) {
						this.tips = `${workorder},${res.message}`;
					}
				});
			} else {
				this.$Msg.error("请输入工单");
			}
		},
		//关闭弹框
		cancelClick() {
			this.tips = "";
			this.modalFlag = false;
			this.submitData.workorder = "";
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
<style lang="less" scoped>
.workorder-tips {
	color: orange;
	padding: 10px;
	text-align: center;
	background: oldlace;
	span {
		color: #3f3232;
		font-weight: bold;
		margin-right: 10px;
	}
}
</style>
