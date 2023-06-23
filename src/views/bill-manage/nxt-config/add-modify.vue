<template>
	<!-- 右侧抽屉 Form表单 -->
	<Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
		<Form ref="submitData" :model="submitData" :label-width="90" @submit.native.prevent>
			<!-- jobName -->
			<FormItem label="jobName" prop="jobname">
				<Input v-model.trim="submitData.jobname" :placeholder="$t('pleaseEnter') + 'jobname'" />
			</FormItem>
			<!-- 线体 -->
			<FormItem label="线体" prop="linename">
				<Input v-model.trim="submitData.linename" :placeholder="$t('pleaseEnter') + '线体'" />
			</FormItem>
			<!-- Refdes -->
			<FormItem label="Refdes" prop="refdes">
				<Input v-model.trim="submitData.refdes" :placeholder="$t('pleaseEnter') + 'Refdes'" />
			</FormItem>
			<!-- 按钮 -->
			<FormItem>
				<drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
			</FormItem>
		</Form>
	</Drawer>
</template>

<script>
import { addReq, modifyReq } from "@/api/bill-manage/nxt-config";
export default {
	name: "nxt-add-modify",
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
			submitData: {
				id: "",
				jobname: "",
				linename: "",
				refdes: "",
			},
		};
	},
	activated() {},
	methods: {
		//提交
		submitClick(isClose = false) {
			this.$refs.submitData.validate((validate) => {
				if (validate) {
					const { jobname, linename, refdes, id } = this.submitData;
					const obj = {
						jobname,
						linename,
						refdes,
						id,
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
