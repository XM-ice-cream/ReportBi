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
	},
	data() {
		return {
			print: {
				id: this.id,
				popTitle: "打印", // 打印配置页上方标题
				extraHead: "", //最上方的头部文字，附加在head标签上的额外标签,使用逗号分隔
				preview: "", // 是否启动预览模式，默认是false（开启预览模式，可以先预览后打印）
				previewTitle: "", // 打印预览的标题（开启预览模式后出现）,
				previewPrintBtnLabel: "", // 打印预览的标题的下方按钮文本，点击可进入打印（开启预览模式后出现）
				zIndex: "", // 预览的窗口的z-index，默认是 20002（此值要高一些，这涉及到预览模式是否显示在最上面）
				clickMounted() {},
				previewBeforeOpenCallback() {}, //预览窗口打开之前的callback（开启预览模式调用）
				previewOpenCallback() {}, // 预览窗口打开之后的callback（开启预览模式调用）
				beforeOpenCallback() {
					console.log("打印前");
				}, // 开启打印前的回调事件
				openCallback() {}, // 调用打印之后的回调事件
				closeCallback() {}, //关闭打印的回调事件（无法确定点击的是确认还是取消）
				url: "",
				standard: "",
				extraCss: "",
			},
		};
	},
};
</script>

<style lang="less" scoped></style>
