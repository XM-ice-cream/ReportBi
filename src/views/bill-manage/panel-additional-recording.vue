/* 打件资料补录 */
<template>
	<div class="page-style">
		<!-- 表单信息 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style" id="panel-additional-recording">
				<Form ref="submitReq" :model="req" :label-width="120" :label-colon="false" class="form-content" @submit.native.prevent :rules="ruleValidate">
					<Row>
						<Col span="24">
							<!-- 补录的大板码 -->
							<FormItem label="Add PanelNo" prop="panelno">
								<Input type="textarea" ref="input" v-model="req.panelno" clearable size="default" placeholder="请输入补录的panelNo(最多10个,以空格分割)" :autosize="{ minRows: 3, maxRows: 5 }"></Input>
							</FormItem>
						</Col>
						<Col span="24">
							<!-- B/T面 -->
							<FormItem label="B/T面" prop="bt">
								<RadioGroup v-model="req.bt" type="button" button-style="solid">
									<Radio label="B">B面</Radio>
									<Radio label="T">T面</Radio>
								</RadioGroup>
							</FormItem>
						</Col>
						<Col span="24">
							<!-- 大板码模板 -->
							<FormItem label="Copy PanelNo" prop="templetepanelno">
								<Input type="text" v-model="req.templetepanelno" clearable size="default" placeholder="请输入panelNo模板"></Input>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem style="text-align: center">
								<Button type="primary" ghost @click="reset()" size="default">{{ $t("reset") }}</Button>
								<Button type="primary" @click="submitClick()" size="default">{{ $t("submit") }}</Button>
							</FormItem>
						</Col>
					</Row>
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
				</Form>
				<!-- 提交记录 -->
				<div class="log-box">
					<div class="title">提交记录 :</div>
					<div class="log-content">
						<Alert v-for="(item, index) in tipMsg" :key="index">
							<div v-for="(mItem, mIndex) in item.msg" v-if="mItem">
								<div v-if="mIndex == 0" class="subtitle">{{ mItem }}</div>
								<div v-else :class="mItem.indexOf('NG') == -1 ? 'success' : 'error'">{{ mIndex }}. {{ mItem }}</div>
							</div>
						</Alert>
					</div>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
import { addReq } from "@/api/bill-manage/panel-additional-recording";
import { inputSelectContent } from "@/libs/tools";
export default {
	name: "panel-additional-recording",
	data() {
		return {
			req: {
				panelno: "", //大板码
				bt: "B",
				templetepanelno: "", //大板码模板
			},
			tipMsg: [],
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
		submitClick() {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					const { panelno, templetepanelno, bt } = this.req;
					const obj = {
						userId: sessionStorage.getItem("userName"),
						panelno,
						templetepanelno,
						bt,
					};
					addReq(obj).then((res) => {
						res.msg = res.msg.split(";");
						this.tipMsg.unshift(res);
						this.reset();
					});
				}
			});
		},
		// 重置
		reset() {
			this.$refs.submitReq.resetFields();
			inputSelectContent(this.$refs.input);
		},
	},
	mounted() {
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
	height: 100%;
	float: left;
	position: relative;
	.declare {
		position: absolute;
		bottom: -20px;
		width: 100%;
	}
}
.log-box {
	width: 49%;
	height: 100%;
	background: #f7feff;
	border: 1px solid #27ce88;
	padding: 10px;
	margin: 10px 0;
	border-radius: 10px;
	float: right;
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
