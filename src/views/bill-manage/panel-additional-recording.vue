/*PANEL 打件资料 */
<template>
	<div class="page-style">
		<Drawer v-model="modalFlag" title="PANEL 打件资料信息补录" width="650" :mask-closable="false" :before-close="cancelClick">
			<div style="height: calc(100% - 300px)">
				<Form
					ref="submitReq"
					:model="submitData"
					:label-width="100"
					:label-colon="false"
					class="form-content"
					@submit.native.prevent
					:rules="ruleValidate"
				>
					<!-- 补录的大板码 -->
					<FormItem label="Add PanelNo" prop="panelno">
						<Input
							type="textarea"
							ref="input"
							v-model="submitData.panelno"
							clearable
							size="default"
							placeholder="请输入补录的panelNo(最多10个,以空格分割)"
							:autosize="{ minRows: 3, maxRows: 5 }"
						></Input>
					</FormItem>
					<!-- B/T面 -->
					<FormItem label="B/T面" prop="bt">
						<RadioGroup v-model="submitData.bt" type="button" button-style="solid">
							<Radio label="B">B面</Radio>
							<Radio label="T">T面</Radio>
						</RadioGroup>
					</FormItem>
					<!-- 大板码模板 -->
					<FormItem label="Copy PanelNo" prop="templetepanelno">
						<Input type="text" v-model="submitData.templetepanelno" clearable size="default" placeholder="请输入panelNo模板"></Input>
					</FormItem>
					<!-- 按钮 -->
					<FormItem>
						<Button type="primary" ghost @click="reset()" size="small" style="margin-right: 10px; padding: 0 21px">{{ $t("reset") }}</Button>
						<Button type="primary" @click="submitClick()" size="small" style="margin-right: 10px; padding: 0 21px">{{ $t("submit") }}</Button>
					</FormItem>
				</Form>
				<!-- 提交记录 -->
				<div class="log-box">
					<div class="title">提交记录 :</div>
					<div class="log-content">
						<Alert v-for="(item, index) in tipMsg" :key="index">
							<div v-for="(mItem, mIndex) in item.message" v-if="mItem">
								<div v-if="mIndex == 0" class="subtitle">{{ mItem }}</div>
								<div v-else :class="mItem.indexOf('NG') == -1 ? 'success' : 'error'">{{ mIndex }}. {{ mItem }}</div>
							</div>
						</Alert>
					</div>
				</div>
				<div class="declare">
					<Alert type="warning">
						<p>
							说明：<br />
							1.一次最多补录10个panelNo【必须是工单相同】;<br />
							2.用做模板panelNo,可自动抓取或者手动输入【必须工单相同】;<br />
							3.补录时超过RID剩余量不可操作;<br />
							4.Watch补B面、Audio补T/B面。
						</p>
					</Alert>
				</div>
			</div>
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
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 起始时间 -->
										<FormItem :label="$t('startTime')" prop="startTime">
											<DatePicker
												transfer
												type="datetime"
												:placeholder="$t('pleaseSelect') + $t('startTime')"
												format="yyyy-MM-dd HH:mm:ss"
												:options="$config.datetimeOptions"
												v-model="req.startTime"
											></DatePicker>
										</FormItem>
										<!-- 结束时间 -->
										<FormItem :label="$t('endTime')" prop="endTime">
											<DatePicker
												transfer
												type="datetime"
												:placeholder="$t('pleaseSelect') + $t('endTime')"
												format="yyyy-MM-dd HH:mm:ss"
												:options="$config.datetimeOptions"
												v-model="req.endTime"
											></DatePicker>
										</FormItem>
										<!-- PanelNo -->
										<FormItem label="PanelNo" prop="panelno">
											<Input v-model="req.panelno" :placeholder="$t('pleaseEnter') + 'PanelNo'" />
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()" size="mini">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick()" size="mini">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
						</i-col>
						<i-col span="18">
							<button-custom :btnData="btnData" @on-add-click="addClick"></button-custom>
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
import { addReq, getlistReq } from "@/api/bill-manage/panel-additional-recording";
import { inputSelectContent, renderDate, getButtonBoolean, formatDate } from "@/libs/tools";
export default {
	name: "panel-additional-recording",
	data() {
		return {
			searchPoptipModal: false,
			drawerFlag: false,
			noRepeatRefresh: true,
			modalFlag: false,
			tableConfig: { ...this.$config.tableConfig },
			btnData: [],
			tipMsg: [],
			data: [],
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
				{ title: "操作账号", key: "createid", align: "center", minWidth: 180, tooltip: true },
				{ title: "操作时间", key: "createdate", align: "center", minWidth: 100, tooltip: true, render: renderDate },
				{ title: "补录小板码", key: "adD_PANEL_NO", align: "center", minWidth: 140, tooltip: true },
				{ title: "模板小板码", key: "copY_PANEL_NO", align: "center", minWidth: 140, tooltip: true },
				{ title: "补录的脚位数", key: "refdeS_COUNT", align: "center", minWidth: 80, tooltip: true },
				{ title: "补录的发生", key: "copY_TYPE", align: "center", minWidth: 100, tooltip: true },
			],
			submitData: {
				panelno: "", //大板码
				bt: "B",
				templetepanelno: "", //大板码模板
			},
			req: {
				startTime: "",
				endTime: "",
				panelno: "",
				...this.$config.pageConfig,
			},
			// 验证实体
			ruleValidate: {
				panelno: [
					{
						required: true,
						message: "请输入大板码",
					},
				],
			},
		};
	},
	methods: {
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			const { startTime, endTime, panelno } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;

					const obj = {
						orderField: "createdate", // 排序字段
						ascending: true, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							startTime: formatDate(startTime),
							endTime: formatDate(endTime),
							panelno,
						},
					};
					getlistReq(obj)
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
				}
			});
		},
		addClick() {
			this.modalFlag = true;
		},
		submitClick() {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					const { panelno, templetepanelno, bt } = this.submitData;
					const obj = {
						userId: sessionStorage.getItem("userName"),
						panelno,
						templetepanelno,
						bt,
					};
					addReq(obj).then((res) => {
						if (res.code == 200) {
							res.message = res.message.split(";");
							this.tipMsg.unshift(res);
							this.resetClick();
						}
					});
				}
			});
		},
		//关闭弹框
		cancelClick() {
			this.modalFlag = false;
			this.submitData.panelno = "";
			this.tipMsg = [];
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.submitReq.resetFields();
			inputSelectContent(this.$refs.input);
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 130 - 50;
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
	mounted() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		inputSelectContent(this.$refs.input);
	},
};
</script>
<style lang="less" scoped>
#panel-additional-recording {
	.ivu-row {
		width: 98%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -100%);
	}
	/deep/.ivu-form .ivu-FormItem-label {
		font-size: 21px;
	}

	/deep/ textarea.ivu-input,
	.ivu-input,
	.ivu-btn {
		margin-right: 16px;
	}
	/deep/.ivu-FormItem-content {
		font-size: 18px;
	}
	/deep/.ivu-FormItem {
		margin-bottom: 25px;
	}
}
.form-content {
	width: 50%;
	height: 50%;
	float: left;
	position: relative;
	.declare {
		position: absolute;
		bottom: -20px;
		width: 100%;
	}
}
.log-box {
	width: 100%;
	height: 300px;
	background: #f7feff;
	border: 1px solid #27ce88;
	padding: 10px;
	margin: 10px 0;
	border-radius: 10px;
	overflow: auto;
	.title {
		font-size: 16px;
		font-weight: bold;
		padding-bottom: 10px;
		color: #484848;
	}
	.log-content {
		height: calc(100% - 45px);
		padding: 10px;
		overflow-x: hidden;
		overflow-y: auto;
		.subtitle {
			font-size: 14px;
			&:before {
				content: "";
				display: inline-block;
				width: 0;
				height: 0;
				border: 8px solid transparent;
				border-left: 11px solid #2cc7a0;
				position: relative;
				top: 2px;
				left: 0px;
			}
		}
		.success {
			color: #484848;
			padding: 5px;
		}
		.error {
			color: #ff2323;
			padding: 5px;
		}
	}
}
:deep(.ivu-alert-info) {
	background-color: #fff;
}
</style>
