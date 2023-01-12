<template>
	<!-- 右侧抽屉 Form表单 -->
	<Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
		<Form ref="submitData" :model="submitData" :label-width="90" :label-colon="true" @submit.native.prevent>
			<!-- 群组类型 -->
			<FormItem label="群组类型" prop="grouP_TYPE">
				<Select v-model.tirm="submitData.grouP_TYPE" transfer :placeholder="$t('pleaseSelect') + '群组类型'" clearable>
					<Option v-for="(item, index) in groupTypeList" :key="index" :value="item">{{ item }}</Option>
				</Select>
			</FormItem>
			<!-- 群组名称 -->
			<FormItem label="群组名称" prop="grouP_NAME">
				<Input v-model.trim="submitData.grouP_NAME" :placeholder="$t('pleaseEnter') + '群组名称'" clearable />
			</FormItem>
			<!-- 群组线体 -->
			<FormItem label="群组线体" prop="grouP_LINE">
				<Input v-model.trim="submitData.grouP_LINE" :placeholder="$t('pleaseEnter') + '群组线体'" clearable />
			</FormItem>
			<!-- 群组站点 -->
			<FormItem label="群组站点" prop="grouP_STATION">
				<Input v-model.trim="submitData.grouP_STATION" :placeholder="$t('pleaseEnter') + '群组站点'" clearable />
			</FormItem>
			<!-- 不良编码 -->
			<FormItem label="DefectCode" prop="defectcode">
				<Input v-model.trim="submitData.defectcode" :placeholder="$t('pleaseEnter') + 'DefectCode'" clearable />
			</FormItem>
			<!-- 群组机种 -->
			<FormItem label="群组机种" prop="grouP_MODEL">
				<Input v-model.trim="submitData.grouP_MODEL" :placeholder="$t('pleaseEnter') + '群组机种'" clearable />
			</FormItem>
			<!-- 群组信息 -->
			<FormItem label="群组信息" prop="grouP_INFO">
				<Input v-model.trim="submitData.grouP_INFO" :placeholder="$t('pleaseEnter') + '群组信息'" clearable />
			</FormItem>
			<!-- 邮箱群组 -->
			<FormItem label="邮箱群组" prop="emaiL_GROUP">
				<Input
					v-model.trim="submitData.emaiL_GROUP"
					type="textarea"
					:autosize="{ minRows: 2, maxRows: 5 }"
					:placeholder="$t('pleaseEnter') + '邮箱群组'"
					clearable
				/>
			</FormItem>
			<!-- 目标值 -->
			<FormItem label="目标上限" prop="grouP_GOAL">
				<Input v-model.trim="submitData.grouP_GOAL" :placeholder="$t('pleaseEnter') + '目标上限'" clearable />
			</FormItem>
			<!-- 目标值 -->
			<FormItem label="目标下限" prop="grouP_TARGET">
				<Input v-model.trim="submitData.grouP_TARGET" :placeholder="$t('pleaseEnter') + '目标下限'" clearable />
			</FormItem>

			<!-- 按钮 -->
			<FormItem>
				<drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
			</FormItem>
		</Form>
	</Drawer>
</template>

<script>
import { addReq, modifyReq } from "@/api/bill-manage/maverick-email-setting.js";
import { commaSplitString } from "@/libs/tools";

export default {
	name: "maverick-add-modify",
	props: {
		drawerFlag: {
			type: Boolean,
			default: false,
		},
		isAdd: {
			type: Boolean,
			default: false,
		},
		selectObj: {
			type: Object,
			default: () => null,
		},
		drawerTitle: {
			type: String,
			default: "新增",
		},
	},
	watch: {
		drawerFlag(newVal) {
			if (newVal && !this.isAdd) {
				this.submitData = { ...this.selectObj };
			}
		},
	},
	data() {
		return {
			groupTypeList: ["FACA", "EarlyWarning", "MaverickSYLWarning"], //群组类型
			submitData: {
				grouP_TYPE: "",
				grouP_NAME: "",
				grouP_LINE: "",
				grouP_STATION: "",
				grouP_MODEL: "",
				grouP_INFO: "",
				emaiL_GROUP: "",
				grouP_TARGET: 0,
				grouP_GOAL: 0,
				defectcode: "",
				id: "",
			},
		};
	},
	activated() {},
	methods: {
		//提交
		submitClick(isClose = false) {
			this.$refs.submitData.validate((validate) => {
				if (validate) {
					const {
						grouP_TYPE,
						grouP_NAME,
						grouP_LINE,
						grouP_STATION,
						grouP_MODEL,
						grouP_INFO,
						emaiL_GROUP,
						grouP_TARGET,
						grouP_GOAL,
						defectcode,
						id,
					} = this.submitData;
					const obj = {
						grouP_TYPE,
						grouP_NAME,
						grouP_LINE,
						grouP_STATION,
						grouP_MODEL,
						grouP_INFO,
						emaiL_GROUP: commaSplitString(emaiL_GROUP).join(";"),
						grouP_TARGET,
						grouP_GOAL,
						defectcode,
						id,
					};
					const requestApi = this.isAdd ? addReq : modifyReq;
					requestApi(obj).then((res) => {
						if (res.code === 200) {
							this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
							this.$emit("pageLoad");
							if (isClose) this.cancelClick();
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${res.message}`);
					});
				}
			});
		},
		// 左侧抽屉取消
		cancelClick() {
			this.$emit("update:drawerFlag", false);
			this.$refs.submitData.resetFields();
			console.log("取消");
		},
	},
};
</script>
