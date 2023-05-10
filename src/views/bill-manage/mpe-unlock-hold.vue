/* MPE 解hold */
<template>
	<div class="page-style">
		<!-- 页面输入下载条件 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style" id="serinRowData">
				<Row>
					<Form ref="submitReq" :model="req" :label-width="150" :label-colon="false" :rules="ruleValidate" style="width: 70rem">
						<!-- 小板码 -->
						<FormItem label="UnitId" prop="unitId">
							<Input
								type="textarea"
								v-model="req.unitId"
								size="default"
								:autosize="{ minRows: 15, maxRows: 15 }"
								placeholder="请以逗号或回车分隔,输入小板码"
								clearable
							></Input>
						</FormItem>
						<FormItem>
							<Button type="primary" ghost @click="reset()" size="default">{{ $t("reset") }}</Button> &nbsp;&nbsp;
							<Button type="primary" @click="submitClick()" size="default">{{ $t("submit") }}</Button>
						</FormItem>
					</Form>
				</Row>
			</Card>
		</div>
	</div>
</template>

<script>
import { modifyReq } from "@/api/bill-manage/mpe-unlock-hold";
import { commaSplitString } from "@/libs/tools";

export default {
	name: "mpe-unlock-hold",
	data() {
		return {
			req: {
				unitId: "",
			}, //查询数据
			// 验证实体
			ruleValidate: {
				unitId: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "UnitId",
						trigger: "blur",
					},
				],
			},
		};
	},
	methods: {
		// 提交
		submitClick() {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					let { unitId } = this.req;
					const obj = {
						unitId: commaSplitString(unitId).join(),
					};
					modifyReq(obj).then((res) => {
						if (res.code === 200) {
							this.$Msg.success("解Hold成功！");
						} else {
							this.$Msg.error(`解Hold失败！,${res.message}`);
						}
					});
				}
			});
		},
		// 重置
		reset() {
			this.$refs.submitReq.resetFields();
		},
	},
};
</script>
<style lang="less" scoped>
#serinRowData {
	.ivu-row {
		padding-left: 15%;
		padding-top: 8%;
		text-align: center;
	}
	/deep/.ivu-form .ivu-form-item-label {
		font-size: 21px;
	}
	/deep/.ivu-btn-primary {
		width: 100px;
	}
	/deep/ textarea.ivu-input,
	.ivu-input,
	.ivu-btn {
		font-size: 19px;
	}
	/deep/.ivu-form-item-content {
		font-size: 18px;
	}
	/deep/.ivu-form-item {
		margin-bottom: 25px;
	}
}
</style>
