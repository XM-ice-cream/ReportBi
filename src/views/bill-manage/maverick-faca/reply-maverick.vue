/* MaverickFaca 回复信息 */
<template>
	<div>
		<!-- 左侧抽屉 -->
		<Drawer class="reply-maverick" v-model="drawerFlag" title="回复列表信息" width="800" :mask-closable="false" @on-close="cancelClick">
			<!-- 页面表格 -->
			<div class="comment">
				<Form ref="submitReq" :model="req" :rules="ruleValidate" :label-width="90" :label-colon="true" @submit.native.prevent>
					<!-- 回复类型 -->
					<FormItem label="回复类型">
						<Label>{{ selectArr[0].status }}</Label>
					</FormItem>
					<!-- 回复群组 -->
					<FormItem label="回复群组" prop="mailDepartArry">
						<CheckboxGroup v-model="req.mailDepartArry" clearable>
							<Checkbox :label="item" v-for="(item, index) in mailDepartArry" :key="index"></Checkbox>
						</CheckboxGroup>
					</FormItem>
					<!-- 回复信息-->
					<FormItem label="回复信息" prop="Msg">
						<Input v-model="req.Msg" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
					</FormItem>
					<!-- Category-->
					<FormItem label="Category" prop="category">
						<Input v-model="req.category" />
					</FormItem>
					<!-- Loaction-->
					<FormItem label="Loaction" prop="location">
						<Input v-model="req.location" />
					</FormItem>
					<!-- rootcause-->
					<FormItem label="RootCause" prop="rootcause">
						<Input v-model="req.rootcause" />
					</FormItem>
					<!-- nexDRI-->
					<FormItem label="nexDRI" prop="nextDRI">
						<Input v-model="req.nextDRI" />
					</FormItem>
					<!-- 回复人员-->
					<FormItem label="回复人员" prop="EMPNO">
						<Input v-model="req.EMPNO" />
					</FormItem>
				</Form>
				<!-- 保存，提交，驳回 -->
				<!-- <drawer-button @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button> -->
				<div class="drawer-button">
					<Button @click="cancelClick">{{ $t("cancel") }}</Button>
					<Button type="primary" @click="submitClick(false)">{{ $t("save") }}</Button>
					<Button type="primary" @click="submitClick(true, 'submit')">提交</Button>
					<Button type="primary" @click="submitClick(true, 'back')">驳回</Button>
				</div>
			</div>
		</Drawer>
	</div>
</template>

<script>
import { modifyReq, getMailDepartReq } from "@/api/bill-manage/maverick-faca";
import { formatDate } from "@/libs/tools";

export default {
	name: "reply-maverick",
	props: {
		selectArr: {
			type: Array,
			default: [],
		},
	},
	data() {
		return {
			drawerFlag: false,
			mailDepartArry: [],
			tableConfig: { ...this.$config.tableConfig }, // table配置
			req: {
				Msg: "",
				category: "",
				location: "",
				rootcause: "",
				nextDRI: "",
				EMPNO: "",
				mailDepartArry: [],
			},
			// 验证实体
			ruleValidate: {
				templateName: [
					{
						required: true,
						message: this.$t("pleaseSelect") + this.$t("templateName"),
						trigger: "change",
					},
				],
			},
		};
	},
	watch: {
		drawerFlag() {
			if (this.drawerFlag) {
				const { fA_MSG, fA_EMPNO, q_MSG, q_EMPNO, cA_MSG, cA_EMPNO, status } = this.selectArr[0];
				const msgObj =
					status === "FA" ? { Msg: fA_MSG, EMPNO: fA_EMPNO } : status === "Q" ? { Msg: q_MSG, EMPNO: q_EMPNO } : { Msg: cA_MSG, EMPNO: cA_EMPNO };
				this.req = { ...this.selectArr[0], ...msgObj };
				//获取群组
				this.getMailDepart();
			}
		},
	},
	methods: {
		// 保存
		submitClick(isClose = false, type = "") {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					const { Msg, category, location, rootcause, nextDRI, EMPNO, mailDepartArry } = this.req;
					let warningType = false;
					const nowTime = formatDate(new Date());
					let maverickDetailList = this.selectArr.map((item, index) => {
						const msgObj =
							item.status === "FA"
								? { fA_MSG: Msg, fA_EMPNO: EMPNO, fA_TIME: nowTime }
								: item.status === "Q"
								? { q_MSG: Msg, q_EMPNO: EMPNO, q_TIME: nowTime }
								: { cA_MSG: Msg, cA_EMPNO: EMPNO, cA_TIME: nowTime };
						let status = item.status;
						//提交状态+1
						if (type === "submit") {
							if (item.status === "Closed" && index === 0) {
								this.$Msg.error("状态为Closed,不可提交！");
								warningType = true;
							}
							if (!warningType) {
								const type = parseInt(this.getStatus(item.status)) + 1;
								status = this.getStatus(type);
							}
						}
						//驳回状态-1
						if (type === "back") {
							if (item.status === "FA" && index === 0) {
								this.$Msg.error("状态为FA,不可驳回！");
								warningType = true;
							}
							if (!warningType) {
								const type = parseInt(this.getStatus(item.status)) - 1;
								status = this.getStatus(type);
							}
						}
						return { ...item, ...msgObj, category, location, rootcause, nextDRI, status };
					});
					const obj = {
						maverickDetailList,
						mailDepartArry,
					};
					if (!warningType) {
						modifyReq(obj).then((res) => {
							if (res.code === 200) {
								this.$Msg.success(`回复信息${this.$t("success")}`);
								if (isClose) this.cancelClick();
								this.$parent.pageLoad();
							} else {
								this.$Msg.error(`回复信息${this.$t("fail")},${res.message}`);
							}
						});
					}
				}
			});
		},
		//获取状态
		getStatus(type) {
			const status = {
				FA: 0,
				CA: 1,
				Q: 2,
				Closed: 3,
				0: "FA",
				1: "CA",
				2: "Q",
				3: "Closed",
			};
			return status[type];
		},
		//获取邮件群组
		getMailDepart() {
			getMailDepartReq({}).then((res) => {
				if (res.code === 200) {
					this.mailDepartArry = res.result;
				}
			});
		},

		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
			this.$refs.submitReq.resetFields(); //清除表单红色提示
		},
	},
	created() {},
	mounted() {},
};
</script>
<style lang="less">
.drawer-button {
	text-align: center;
	button {
		margin-right: 5px;
		&:first-child {
			padding: 5px 16px;
			color: #27ce88;
			border: 1px solid #27ce88;
			border-radius: 0;
		}
		&:nth-child(2),
		&:nth-child(3),
		&:last-child {
			padding: 5px 16px;
			color: #fff;
			border: 1px solid #27ce88;
			background-color: #27ce88;
			border-radius: 0;
		}
		&:last-child {
			margin-right: 0;
		}
	}
}
</style>
