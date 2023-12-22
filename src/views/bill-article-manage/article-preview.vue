<template>
	<div class="markdownBox">
		<div class="titleBox">
			<p>{{uriParam.title}}</p>
		</div>
		<div class="contentBox">
			<markdown-preview ref="markdown" :value="content"/>
		</div>
	</div>
</template>
<script>
import {
	getentity
} from "@/api/bill-design-manage/article-manage.js";
import MarkdownPreview from "../../components/editor-md/MarkdownPreview.vue";
export default {
	name: "articlepreview",
	components: { MarkdownPreview },
	data(){
		return{
			content :'',
			uriParam:{
				id:'',
				title:''
			}
		}
	},
	mounted(){
		this.$nextTick(() => {
			this.uriParam.id = this.$route.query.id;
			this.uriParam.title = this.$route.query.title;
			this.getContent();
		});
	},
	methods: {
        getContent(){
            let obj = this.uriParam;

            getentity(obj).then((res) => {
                if (res.code === 200) {
                    this.$Msg.success(`获取数据成功 `);
					//console.log(res.result.content);
					//console.log(this.$refs.markdown);
					this.content = res.result.content;
					this.$refs.markdown.initEditor();
                } else this.$Msg.error(`${this.$t("fail")}` + res.message);
            });
        },
		watchHtml() {
			this.$refs["markdown"].watch();
		},
		unwatchHtml() {
			this.$refs["markdown"].unwatch();
		},
		onlyView() {
			let markdown = this.$refs["markdown"];
			markdown.watch();
			markdown.previewing();
			markdown.hideCloseButton();
		},
	},
};
</script>
<style>
.markdownBox{
	width: 100%; 
	height: 100%;
	overflow:auto;
	padding-left: 0%;
}
.contentBox{
	padding-left: 40px;
}
.titleBox{
	background-color: #f3f3f3;
	height: 78px;
	padding: 10px;
	font-size: 46px;
	align-items: center;
}
.titleBox p {
	text-align:center;
}
</style>
