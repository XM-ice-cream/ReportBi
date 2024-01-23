<template>
	<Drawer title="打印预览" v-model="printDialogVisible" width="80%" class="printDialog" @closed="closePrintDialog">
		<slot name="content"></slot>
		<span slot="footer" class="dialog-footer">
			<Button @click="closePrintDialog">取 消</Button>
			<PrintButtonCom :id="printDivId" :title="printBtnTitle"></PrintButtonCom>
		</span>
	</Drawer>
</template>

<script>
export default {
	props: {
		printDialogVisible: {
			type: Boolean,
			default: false,
		},
		printDivId: {
			type: String,
			default: "",
		},
		printBtnTitle: {
			type: String,
			default: "",
		},
	},
	methods: {
		closePrintDialog() {
			this.$emit("closePrintDialog");
		},
	},
};
</script>

<style lang="less" scoped>
.printDialog {
	height: 800px !important;
	/deep/ .el-dialog__body {
		height: 600px !important;
		overflow-y: scroll;
	}
}
</style>
