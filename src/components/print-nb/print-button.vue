<template>
	<Button type="primary" v-print="print">{{ title }}</Button>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: "",
		},
		id: {
			type: String,
			default: "",
		},
		pdfName: {
			type: String,
			default: "",
		},
	},
	watch: {
		id(newval) {
			console.log("监听", newval);
		},
		pdfName(newval) {
			console.log("监听", newval);
			this.print.pdfName = newval;
		},
	},
	data() {
		return {
			print: {
				id: this.id,
				pdfName: this.pdfName,
				modalFlag: this.modalFlag,
				popTitle: "打印", // 打印配置页上方标题
				preview: false, // 是否启动预览模式，默认是false（开启预览模式，可以先预览后打印）
				previewTitle: "打印", // 打印预览的标题（开启预览模式后出现）,
				previewPrintBtnLabel: "", // 打印预览的标题的下方按钮文本，点击可进入打印（开启预览模式后出现）
				zIndex: "", // 预览的窗口的z-index，默认是 20002（此值要高一些，这涉及到预览模式是否显示在最上面）
				extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
				url: "",
				standard: "HTML5",
				extraCss: "",
				previewBeforeOpenCallback() {
					console.log("正在加载预览窗口");
				},
				previewOpenCallback() {
					console.log("已经加载完预览窗口");
				},
				beforeOpenCallback(vue) {
					vue.printLoading = true;
					console.log("打开之前");
				},
				openCallback(vue) {
					vue.printLoading = false;
					console.log("执行了打印");
				},
				closeCallback(vue) {
					console.log("关闭了打印工具");
					vue.$parent.$parent.modalFlag = false;
					document.title = window.localStorage.getItem("documentTitle");
					// window.localStorage.setItem("documentTitle", this.$parent.submitData.workBookName);
				},
				clickMounted(vue) {
					document.title = this.pdfName;
					console.log("点击了打印按钮", vue, this.id, this.pdfName);

					// vue.printContent.popTitle = "123"; // 动态设置页眉
				},
			},
		};
	},
};
</script>

<style media="print">
@page {
	size: auto;
	margin: 1mm;
}
@media print {
	html {
		background-color: #ffffff;
		height: auto;
		margin: 0px;
	}
}
</style>
