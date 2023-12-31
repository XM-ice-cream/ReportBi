<template>
	<div ref="editor" class="main" style="height: 400px"></div>
</template>

<script>
import * as monaco from "monaco-editor";
export default {
	props: {
		options: {
			type: Object,
			default() {
				return {};
			},
		},
		value: {
			type: String,
			required: false,
		},
		language: {
			type: String,
		},
		hints: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	name: "MonacoEditor",
	data() {
		return {
			editorInstance: null,
			defaultOptions: {
				theme: "vs-dark",
				fontSize: 14,
			},
		};
	},
	watch: {
		value() {
			if (this.value !== this.editorInstance.getValue()) {
				this.editorInstance.setValue(this.value);
			}
		},
	},
	mounted() {
		this.initEditor();
		global[this.editorInstance._id] = this;
		window.addEventListener("resize", () => this.layout);
	},
	destroyed() {
		this.editorInstance.dispose();
		global[this.editorInstance._id] = null;
		window.addEventListener("resize", () => this.layout);
	},
	methods: {
		layout() {
			this.editorInstance.layout();
		},
		undo() {
			this.editorInstance.trigger("anyString", "undo");
			this.onValueChange();
		},
		redo() {
			this.editorInstance.trigger("anyString", "redo");
			this.onValueChange();
		},
		getOptions() {
			let props = { value: this.value };
			this.language !== undefined && (props.language = this.language);
			let options = Object.assign({}, this.defaultOptions, this.options, props);
			return options;
		},
		onValueChange() {
			this.$emit("input", this.editorInstance.getValue());
			this.$emit("change", this.editorInstance.getValue());
		},
		//获取光标位置
		getPosition() {
			return this.editorInstance.getPosition();
		},
		//光标位置插入数据
		insertTextPosition(position, newPosition, text) {
			this.editorInstance.executeEdits("my-source", [
				{
					range: new monaco.Range(position.lineNumber, position.column, newPosition.lineNumber, newPosition.column),
					text,
				},
			]);
			//修改光标位置
			this.editorInstance.setPosition(newPosition);
		},
		initEditor() {
			this.MonacoEnvironment = {
				getWorkerUrl: function () {
					return "./editor.worker.bundle.js";
				},
			};

			this.editorInstance = monaco.editor.create(this.$refs.editor, this.getOptions());
			this.editorInstance.onContextMenu((e) => {
				this.$emit("contextmenu", e);
			});
			this.editorInstance.onDidChangeModelContent(() => {
				this.onValueChange();
			});
			//ctrl + s 保存
			this.editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
				this.$emit("save", this.editorInstance.getValue());
			});
		},
	},
};
</script>

<style scoped>
.main /deep/ .view-lines * {
	font-family: Consolas, "Courier New", monospace !important;
}
/* :deep(.monaco-editor){
    color: #d4d4d4;
    width: 100% !important;
    height: 400px !important;
} */
</style>
