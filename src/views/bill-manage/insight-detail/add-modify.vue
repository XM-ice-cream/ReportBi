<template>
	<!-- 右侧抽屉 Form表单 -->
	<Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
		<Form ref="submitData" :model="submitData" :label-width="90" @submit.native.prevent>
			<!-- 机种 -->
			<FormItem :label="$t('modelName')" prop="modelName">
				<Input v-model="submitData.modelName" :placeholder="$t('pleaseEnter') + $t('modelName')" />
			</FormItem>
			<!-- 线体 -->
			<FormItem label="线体" prop="lineName">
				<Input v-model.trim="submitData.lineName" :placeholder="$t('pleaseEnter') + '线体'" />
			</FormItem>
			<!-- EE Code -->
			<FormItem label="EE Code" prop="eeCode">
				<Input v-model.trim="submitData.eeCode" :placeholder="$t('pleaseEnter') + 'EE Code'" />
			</FormItem>
			<!-- 料号 -->
			<FormItem label="料号" prop="partName">
				<Input v-model.trim="submitData.partName" :placeholder="$t('pleaseEnter') + '料号'" />
			</FormItem>
			<!-- 脚号 -->
			<FormItem label="脚号" prop="infoCode">
				<Input v-model.trim="submitData.infoCode" :placeholder="$t('pleaseEnter') + '脚号'" />
			</FormItem>
			<!-- 品名 -->
			<FormItem label="品名" prop="mateType">
				<Input v-model.trim="submitData.mateType" :placeholder="$t('pleaseEnter') + '品名'" />
			</FormItem>
			<!-- 路由-->
			<FormItem label="路由" prop="origin">
				<Input v-model.trim="submitData.origin" :placeholder="$t('pleaseEnter') + '路由'" />
			</FormItem>
			<!-- 状态 -->
			<FormItem label="状态" prop="actionFlag">
				<Input v-model.trim="submitData.actionFlag" :placeholder="$t('pleaseEnter') + '状态'" />
			</FormItem>
			<!-- 生产地 -->
			<FormItem label="生产地" prop="site">
				<Input v-model.trim="submitData.site" :placeholder="$t('pleaseEnter') + '生产地'" />
			</FormItem>
			<!-- 类别 -->
			<FormItem label="类别" prop="refdes_Gategory">
				<Input v-model.trim="submitData.refdes_Gategory" :placeholder="$t('pleaseEnter') + '类别'" />
				<!-- <Select v-model="submitData.refdes_Gategory" clearable>
					<Option v-for="item in refdesGategoryList" :value="item" :key="item">{{ item }}</Option>
				</Select> -->
			</FormItem>
			<!-- 卡关 -->
			<FormItem label="卡关" prop="opT1">
				<Select v-model="submitData.opT1" clearable>
					<Option v-for="item in opt1List" :value="item" :key="item">{{ item }}</Option>
				</Select>
			</FormItem>
			<!-- 是否有效 -->
			<FormItem :label="$t('enabled')" prop="enabled">
				<i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
					<span slot="open">{{ $t("open") }}</span>
					<span slot="close">{{ $t("close") }}</span>
				</i-switch>
			</FormItem>
			<!-- 按钮 -->
			<FormItem>
				<drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
			</FormItem>
		</Form>
	</Drawer>
</template>

<script>
import { addReq, modifyReq } from "@/api/bill-manage/insight-detail";
export default {
	name: "insight-add-modify",
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
			//弹窗开启 及编辑时 赋值
			if (newVal && !this.isAdd) {
				this.submitData = { ...this.selectObj };
			}
		},
	},
	data() {
		return {
			submitData: {
				id: "",
				modelName: "",
				lineName: "",
				eeCode: "",
				partName: "",
				infoCode: "",
				mateType: "",
				origin: "",
				actionFlag: "",
				refdes_Gategory: "",
				site: "",
				opT1: "",
				enabled: 1,
			},
			refdesGategoryList: ["All", "B", "T"],
			opt1List: ["PDCA", "KPSL"],
		};
	},
	activated() {},
	methods: {
		//提交
		submitClick(isClose = false) {
			this.$refs.submitData.validate((validate) => {
				if (validate) {
					const { modelName, lineName, eeCode, partName, infoCode, mateType, origin, actionFlag, site, id, opT1, enabled, refdes_Gategory } =
						this.submitData;
					const obj = {
						modelName,
						lineName,
						eeCode,
						partName,
						infoCode,
						mateType,
						origin,
						actionFlag,
						site,
						id,
						opT1,
						enabled,
						refdes_Gategory,
					};
					const requestApi = this.isAdd ? addReq : modifyReq;
					requestApi(obj).then((res) => {
						if (res.code === 200) {
							this.$Msg.success(`${this.drawerTitle}${this.$t("success")}`);
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
		},
	},
};
</script>
