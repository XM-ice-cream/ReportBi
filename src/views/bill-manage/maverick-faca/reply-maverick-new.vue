/* MaverickFaca 回复信息 */
<template>
	<div style="height: 100%">
		<!-- 页面表格 -->
		<div class="comment">
			<Form ref="submitReq" :model="req" :rules="ruleValidate" :label-width="120" :label-colon="true" @submit.native.prevent>
				<!-- 回复群组 -->
				<FormItem label="回复群组" prop="mailDepartArry">
					<CheckboxGroup v-model="req.mailDepartArry" clearable>
						<Checkbox :label="item" v-for="(item, index) in mailDepartArry" :key="index"></Checkbox>
					</CheckboxGroup>
				</FormItem>
			</Form>
			<div style="display: flex; justify-content: space-between">
				<!-- FA -->
				<Form ref="submitReq" :model="req" :rules="ruleValidate" :label-width="120" :label-colon="true" @submit.native.prevent>
					<!-- 回复类型 -->
					<FormItem label="回复类型">
						<Label style="font-weight: bold">FA</Label>
					</FormItem>
					<!-- 回复信息-->
					<FormItem label="回复信息" prop="fA_MSG">
						<Input v-model="req.fA_MSG" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
					</FormItem>
					<!-- FA 输入框 -->
					<template v-if="req.status === 'FA'">
						<!-- Category-->
						<FormItem label="Category" prop="category">
							<Select v-model="req.category" size="small" placeholder="Please Select Category">
								<Option v-for="item in categoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
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
					</template>
					<!-- FA 文本框 -->
					<template v-if="req.status === 'CA'">
						<!-- Category-->
						<FormItem label="Category" prop="category">
							<Label>{{ replyInfo.category }}</Label>
						</FormItem>
						<!-- Loaction-->
						<FormItem label="Loaction" prop="location">
							<Label>{{ replyInfo.location }}</Label>
						</FormItem>
						<!-- rootcause-->
						<FormItem label="RootCause" prop="rootcause">
							<Label>{{ replyInfo.rootcause }}</Label>
						</FormItem>
						<!-- nexDRI-->
						<FormItem label="nexDRI" prop="nextDRI">
							<Label>{{ replyInfo.nextDRI }}</Label>
						</FormItem>
					</template>
					<!-- 回复人员-->
					<FormItem label="回复人员" prop="fA_EMPNO">
						<Input v-model="req.fA_EMPNO" />
					</FormItem>
				</Form>
				<!-- CA-->
				<Form ref="submitReq" :model="req" :rules="ruleValidate" :label-width="120" :label-colon="true" @submit.native.prevent>
					<!-- 回复类型 -->
					<FormItem label="回复类型">
						<Label style="font-weight: bold">CA</Label>
					</FormItem>
					<!-- 回复信息-->
					<FormItem label="回复信息" prop="cA_MSG">
						<Input v-model="req.cA_MSG" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
					</FormItem>
					<template v-if="req.status === 'CA'">
						<!-- Category-->
						<FormItem label="Category" prop="category">
							<Select v-model="req.category" size="small" placeholder="Please Select Category">
								<Option v-for="item in categoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
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
					</template>
					<!-- CA 文本框 -->
					<template v-if="req.status === 'Q'">
						<!-- Category-->
						<FormItem label="Category" prop="category">
							<Label>{{ replyInfo.category }}</Label>
						</FormItem>
						<!-- Loaction-->
						<FormItem label="Loaction" prop="location">
							<Label>{{ replyInfo.location }}</Label>
						</FormItem>
						<!-- rootcause-->
						<FormItem label="RootCause" prop="rootcause">
							<Label>{{ replyInfo.rootcause }}</Label>
						</FormItem>
						<!-- nexDRI-->
						<FormItem label="nexDRI" prop="nextDRI">
							<Label>{{ replyInfo.nextDRI }}</Label>
						</FormItem>
					</template>
					<!-- 回复人员-->
					<FormItem label="回复人员" prop="cA_EMPNO">
						<Input v-model="req.cA_EMPNO" />
					</FormItem>
				</Form>
				<!-- Q-->
				<Form ref="submitReq" :model="req" :rules="ruleValidate" :label-width="120" :label-colon="true" @submit.native.prevent>
					<!-- 回复类型 -->
					<FormItem label="回复类型">
						<Label style="font-weight: bold">Q</Label>
					</FormItem>
					<!-- 回复信息-->
					<FormItem label="回复信息" prop="q_MSG">
						<Input v-model="req.q_MSG" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
					</FormItem>
					<template v-if="req.status === 'Q' || req.status === 'Closed'">
						<!-- Category-->
						<FormItem label="Category" prop="category">
							<Select v-model="req.category" size="small" placeholder="Please Select Category">
								<Option v-for="item in categoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
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
					</template>
					<!-- 回复人员-->
					<FormItem label="回复人员" prop="q_EMPNO">
						<Input v-model="req.q_EMPNO" />
					</FormItem>
				</Form>
			</div>
			<!-- checkPoint -->
			<Form ref="submitReq" :model="req" :rules="ruleValidate" :label-width="120" :label-colon="true" @submit.native.prevent inline>
				<!-- checkPoint -->
				<FormItem label="checkPoint" prop="ischeckPoint">
					<Checkbox v-model="req.ischeckPoint"></Checkbox>
				</FormItem>
				<FormItem label="checkPoint日期" prop="checkPoint" v-if="req.ischeckPoint">
					<DatePicker type="date" placeholder="Select checkPoint date" v-model="req.checkPoint" />
				</FormItem>
			</Form>
			<div class="drawer-button">
				<Button ghost @click="submitClick(true, 'REJECT')" :disabled="isEdit">驳回</Button>
				<Button ghost @click="submitClick(true, 'REBACK')" :disabled="isEdit">退回上一步</Button>
				<Button type="primary" @click="submitClick(true, 'OK')" :disabled="isEdit">回复</Button>
			</div>
		</div>
	</div>
</template>

<script>
import { detailModelReq, sendCommentReq, getMailDepartReq } from "@/api/bill-manage/maverick-faca-new";
import { formatDate } from "@/libs/tools";

export default {
	name: "reply-maverick-new",
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
			isEdit: false,
			req: {
				ischeckPoint: false,
				category: "",
				location: "",
				rootcause: "",
				nextDRI: "",
				mailDepartArry: [],
			},
			replyInfo: {
				category: "",
				location: "",
				rootcause: "",
				nextDRI: "",
			},
			// 验证实体
			ruleValidate: {},
			categoryList: [
				{
					label: "0:material issue",
					value: "0:material issue",
				},
				{
					label: "1:process issue",
					value: "1:process issue",
				},
				{
					label: "3:NTF",
					value: "3:NTF",
				},
			],
		};
	},
	watch: {
		selectArr() {
			if (this.selectArr.length > 0) {
				const { location, category, rootcause, nextDRI } = this.selectArr[0];
				this.replyInfo = { location, category, rootcause, nextDRI };
				this.req = { ...this.selectArr[0], category: "", location: "", rootcause: "", nextDRI: "" };
				// 获取数据是否有回复权限
				this.getDataInfo();
			}
		},
	},
	methods: {
		// 保存
		submitClick(isClose = true, type = "") {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					const {
						ischeckPoint,
						checkPoint,
						category,
						location,
						rootcause,
						nextDRI,
						mailDepartArry,
						status,
						fA_MSG,
						fA_EMPNO,
						cA_MSG,
						cA_EMPNO,
						q_MSG,
						q_EMPNO,
					} = this.req;
					let maverickDetailList = this.selectArr.map((item, index) => {
						switch (status) {
							case "FA":
								item = { ...item, fA_MSG, fA_EMPNO };
								break;
							case "CA":
								item = { ...item, cA_MSG, cA_EMPNO };
								break;
							case "Q":
								item = { ...item, q_MSG, q_EMPNO };
								break;
						}

						return { ...item, category, location, rootcause, nextDRI };
					});
					const obj = {
						maverickDetailList,
						mailDepartArry,
						status: this.req.status, //回复类型
						checkPoint: ischeckPoint ? formatDate(checkPoint) : "",
						userId: this.$store.state.account, //工号
						opt_type: type,
					};

					sendCommentReq(obj).then((res) => {
						if (res.code === 200) {
							this.$Message.success(`回复信息${this.$t("success")}`);
							if (isClose) this.cancelClick();
							this.$emit("pageLoad"); //刷新表格数据
						} else {
							this.$Msg.error(`回复信息${this.$t("fail")},${res.message}`);
						}
					});
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
		//获取数据信息
		getDataInfo() {
			console.log(this.$store.state);
			const { status, id } = this.selectArr[0];
			const obj = {
				guid: id,
				status: status,
				userId: this.$store.state.account,
			};
			detailModelReq(obj).then((res) => {
				if (res.code == 200) {
					this.isEdit = res.result.auth ? false : true;
					console.log(this.isEdit);
				}
			});
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
			//数据恢复初始化
			Object.assign(this.$data, this.$options.data());
			//重新获取群组
			this.getMailDepart();
		},
	},
	created() {},
	mounted() {
		//获取群组
		this.getMailDepart();
	},
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
		&:nth-child(2) {
			padding: 5px 16px;
			color: #27ce88;
			border: 1px solid #27ce88;
			border-radius: 0;
		}
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
