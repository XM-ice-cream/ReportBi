<template>
	<div class="markdown-editor-box" style="height: 100%">
		<link rel="stylesheet" href="./static/editor.md-master/css/editormd.min.css" />
		<div :id="editorId" style="height: 100%"></div>
	</div>
</template>

<script>
import scriptjs from "scriptjs";
import { defaultConfig } from "@/config/MarkdownConfig";

export default {
	name: "MarkdownEditor",
	props: {
		editorId: {
			type: String,
			default: "markdown-editor",
		},
		onchange: {
			type: Function,
		},
		config: {
			type: Object,
		},
		initData: {
			type: String,
		},
		initDataDelay: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			editor: null,
			editorLoaded: false,
		};
	},
	methods: {
		fetchScript(url) {
			return new Promise((resolve) => {
				scriptjs(url, () => {
					resolve();
				});
			});
		},
		getConfig() {
			return { ...defaultConfig, ...this.config };
		},
		getEditor() {
			return this.editor;
		},
		getDoc() {
			return this.doc;
		},
		watch() {
			return this.editor.watch();
		},
		unwatch() {
			return this.editor.unwatch();
		},
		previewing() {
			return this.editor.previewing();
		},
		getHTML() {
			return this.editor.getHTML();
		},
		getMarkdown() {
			return this.editor.getMarkdown();
		},
		setMarkdown(markdown) {
			return this.editor.setMarkdown(markdown);
		},
		initEditor() {
			(async () => {
				await this.fetchScript("./static/editor.md-master/jquery.min.js");
				await this.fetchScript("./static/editor.md-master/editormd.min.js");
				this.$nextTick(() => {
					const editor = window.editormd(this.editorId, this.getConfig());
					console.log("init editor ", editor);
					editor.on("load", () => {
						setTimeout(() => {
							this.editorLoaded = true;
							this.initData && editor.setMarkdown(this.initData);
						}, this.initDataDelay);
					});
					this.onchange &&
						editor.on("change", () => {
							const html = editor.getPreviewedHTML();
							this.onchange({
								markdown: editor.getMarkdown(),
								html: html,
								text: window.$(html).text(),
							});
						});
					this.editor = editor;
				});
			})();
		},
	},
	mounted() {
		this.initEditor();
	},
	watch: {
		initData: function (newVal) {
			if (newVal) {
				this.editorLoaded && this.editor.setMarkdown(newVal);
			}
		},
	},
};
</script>

<style scoped lang="less"></style>
