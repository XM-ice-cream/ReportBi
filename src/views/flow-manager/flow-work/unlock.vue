/* 解锁 */
<template>
	<div>
		<!-- 左侧抽屉 -->
		<Drawer v-model="drawerFlag" :title="drawerTitle" width="520" :mask-closable="false" @on-close="cancelClick">
			<Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="90" @submit.native.prevent>
				<!-- 条码类型 -->
				<FormItem :label="$t('barCodingType')" prop="barCodeType">
					<Select
						v-model="submitData.barCodeType"
						clearable
						filterable
						@on-select="autoFocus = 1"
						:placeholder="`${$t('pleaseEnter')}${$t('barCodingType')}`"
					>
						<Option v-for="(item, i) in barCodeTypeData" :value="item.detailCode" :key="i">
							{{ item.detailName }}
						</Option>
					</Select>
				</FormItem>
				<!-- 条码 -->
				<FormItem :label="$t('barCoding')" prop="barCode">
					<Input
						ref="unlockRefsName"
						v-model.trim="submitData.barCode"
						v-focus="autoFocus === 1"
						@on-focus="autoFocus = null"
						:placeholder="`${$t('pleaseEnter')}${$t('barCoding')}`"
					/>
				</FormItem>
				<!-- 按钮 -->
				<FormItem>
					<Button style="margin-right: 5px" @click="cancelClick">{{ $t("cancel") }}</Button>
					<Button type="primary" @click="submitClick">{{ $t("submit") }}</Button>
				</FormItem>
			</Form>
			<!-- 提交信息展示 -->
			<tips-custom :tips-list="errData" />
		</Drawer>
	</div>
</template>

<script>
import { unholdReq } from "@/api/bill-manage/flow-card";
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";
import { errorType, inputSelectContent, playSound } from "@/libs/tools";

export default {
	name: "unlock",
	props: {
		selectObj: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			autoFocus: null,
			isShow: false,
			drawerFlag: false,
			drawerTitle: this.$t("unlock"),
			submitData: {
				barCodeType: "", //条码类型
				barCode: "", //条码
				enabled: 1, //条码
			},
			// 验证实体
			ruleValidate: {
				barCodeType: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}${this.$t("barCode")}${this.$t("type")}`,
						trigger: "change",
					},
				],
				barCode: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}${this.$t("barCode")}`,
						trigger: "change",
					},
				],
			},
			errData: [], //打印信息
			flowList: [],
			barCodeTypeData: [],
		};
	},
	watch: {
		drawerFlag(newValue) {
			if (newValue) {
				this.getDataItemData();
			}
		},
	},
	methods: {
		//提交
		submitClick() {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					let obj = { ...this.submitData, barCodes: [this.submitData.barCode] };
					unholdReq(obj).then((res) => {
						let isSuccess = false;
						if (res.code === 200) {
							isSuccess = true;
							this.$Msg.success(`${this.drawerTitle}${this.$t("success")}`);
							this.submitData = { barCodeType: this.submitData.barCodeType, barCode: "" };
						} else {
							playSound(this.$config.tipsVoice.NgTips);
							this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
						}
						inputSelectContent(this.$refs.unlockRefsName);
						// 组合错误信息
						const errText = isSuccess ? "" : ` ${this.$t("errCase")}: ${errorType(this, res)}`;
						this.errData.unshift({
							type: isSuccess ? "success" : "error",
							text: `${this.$t("barCoding")}:${obj.barCode[0]}${errText}`,
						});
					});
				}
			});
		},
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
			this.$refs.submitReq.resetFields(); //清除表单红色提示
			this.errData = [];
			this.submitData = { barCodeType: "", barCode: "" };
		},
		// 点击编码规则中的加号按钮触发
		async getDataItemData() {
			this.barCodeTypeData = await this.getDataItemDetailList("BarCodeType");
		},
		async getDataItemDetailList(itemCode) {
			const obj = { itemCode, enabled: 1 };
			let arr = [];
			await getdataitemlistReq(obj).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
		},
	},
};
</script>
