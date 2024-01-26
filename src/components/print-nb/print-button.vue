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
		},
	},
	data() {
		return {
			print: {
				id: this.id,
				pdfName: this.pdfName,
				popTitle: "打印", // 打印配置页上方标题
				preview: false, // 是否启动预览模式，默认是false（开启预览模式，可以先预览后打印）
				previewTitle: "打印", // 打印预览的标题（开启预览模式后出现）,
				previewPrintBtnLabel: "", // 打印预览的标题的下方按钮文本，点击可进入打印（开启预览模式后出现）
				zIndex: 200003, // 预览的窗口的z-index，默认是 20002（此值要高一些，这涉及到预览模式是否显示在最上面）
				extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
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
				closeCallback() {
					console.log("关闭了打印工具");
				},
				clickMounted(vue) {
					document.title = this.pdfName;
					console.log("点击了打印按钮", vue, this.id, this.pdfName);

					// vue.printContent.popTitle = vue.tableHead; // 动态设置页眉
				},
				// url: "",
				standard: "",
			},
		};
	},
};
</script>

<style media="printContent">
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
	body {
		margin: 10mm 15mm 10mm 15mm;
		border: solid 1px #ffffff; /* margin: 10mm 15mm 10mm 15mm; */
		height: auto;
	}
	/*打印内容的class*/
	.print-container {
		transform: scale(0.6);
	}
	/*无需打印内容的class*/
	.noPrint {
		display: none;
	}
	/* 自动分页*/
	.page-break {
		page-break-after: always;
	}
}
</style>
