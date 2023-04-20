<template>
	<Modal v-model="modalFlag" :title="title" :mask-closable="false" draggable :mask="mask">
		<div style="display: flex; align-items: center">
			<common-icon type="md-warning" color="#ff9900" :size="54" />
			<p style="margin-left: 10px">
				<slot>{{ content }}</slot>
			</p>
		</div>
		<div slot="footer" style="text-align: right">
			<Button :loading="loading" @click="cancelClick">{{ $t("cancel") }}</Button>
			<Button type="primary" :loading="loading" @click="okClick">{{ $t("ok") }}</Button>
		</div>
	</Modal>
</template>

<script>
import CommonIcon from "@/components/common-icon";
export default {
	name: "modal-custom",
	components: { CommonIcon },
	props: {
		title: {
			type: String,
			default: "",
		},
		content: {
			type: String,
			default: "是否执行当前操作",
		},
		tipType: {
			type: String,
			default: "warning",
		},
		mask: Boolean,
	},
	data() {
		return {
			modalFlag: false,
			loading: false,
			btnData: [
				{ name: "cancel", type: "default" },
				{ name: "ok", type: "primary" },
			],
		};
	},
	methods: {
		// 取消按钮事件
		cancelClick() {
			this.modalFlag = false;
			this.$emit("on-cancel");
		},
		// 确定按钮事件
		okClick() {
			this.loading = true;
			this.$emit(`on-ok`);
		},
	},
};
</script>

<style scoped lang="less"></style>
