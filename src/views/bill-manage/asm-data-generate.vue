/* ASM数据处理 */
<template>
	<div class="page-style">
		<!-- 页面输入下载条件 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style" id="asm-data-generate">
				<Form ref="submitReq" :model="req" :label-width="80" :label-colon="false" class="form-content" @submit.native.prevent :rules="ruleValidate">
					<Row>
						<Col span="24">
							<FormItem label="PanelNo" prop="input">
								<Input
									type="text"
									ref="input"
									v-model="req.input"
									clearable
									size="default"
									placeholder="请输入大板码"
									@on-enter="submitClick"
								></Input>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem style="text-align: center">
								<Button type="primary" ghost @click="reset()" size="default">{{ $t("reset") }}</Button>
								<Button type="primary" @click="submitClick()" size="default">{{ $t("submit") }}</Button>
							</FormItem>
						</Col>
					</Row>
				</Form>
				<!-- 提交记录 -->
				<div class="log-box">
					<div class="title">提交记录 :</div>
					<div class="log-content">
						<Alert v-for="(item, index) in tipMsg" :key="index" :type="item.indexOf('200') == -1 ? 'error' : 'success'" show-icon>
							{{ item }}
						</Alert>
					</div>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
import { addReq } from "@/api/bill-manage/asm-data-generate";
import { inputSelectContent } from "@/libs/tools";
export default {
	name: "asm-data-generate",
	data() {
		return {
			req: {
				input: "", //大板码
			},
			tipMsg: [], //提示信息
			// 验证实体
			ruleValidate: {
				input: [
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
					addReq({ input: this.req.input }).then((res) => {
						this.tipMsg.unshift(JSON.stringify(res));
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
#asm-data-generate {
	.ivu-row {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
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
	label {
		padding-left: 1rem;
		background: #f5f7f9;
		border-radius: 3px;
		display: block;
		height: 25px;
	}
}
.form-content {
	width: 50%;
	height: 100%;
	float: left;
	position: relative;
}
.log-box {
	width: 49%;
	height: 100%;
	background: #58b09d;
	padding: 10px;
	margin: 10px 0;
	border-radius: 10px;
	float: right;
	.title {
		font-size: 16px;
		font-weight: bold;
		padding-bottom: 10px;
		color: #fff;
	}
	.log-content {
		height: calc(100% - 45px);
		padding: 10px;
		overflow-x: hidden;
		overflow-y: auto;
	}
}
</style>
