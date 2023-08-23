/* 添加计算逻辑函数 */
<template>
	<div class="add-function" id="add-function">
		<!-- 左侧抽屉 -->
		<Drawer v-model="drawerFlag" :title="drawerTitle" width="1000" :mask-closable="false" @on-close="cancelClick">
			<!-- 计算逻辑 -->
			<monaco-editor v-model.trim="validationRules" language="csharp" style="height: 700px" v-if="drawerFlag" @save="checkClick" />
			<div style="margin-top: 10px; text-align: center">
				<!-- 按钮 -->
				<drawer-button :text="drawerTitle" class="tree" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)">
					<template v-slot:default><Button @click="checkClick">检测语法</Button> </template>
				</drawer-button>
			</div>
		</Drawer>
	</div>
</template>

<script>
import MonacoEditor from "@/components/monaco-editor/monaco-editor.vue";
import { checkFunctionReq } from "@/api/bill-design-manage/report-manage.js";

export default {
	name: "add-function",
	components: { MonacoEditor },
	props: {
		monacoEditor: {
			type: String,
			default: () => "",
		},
	},
	computed: {},
	data() {
		return {
			drawerFlag: false,
			isCheck: false, //是否已核验
			drawerTitle: "自定义高级规则(C#)",
			validationRules: "",
			data: [],
			selectItemList: [],
		};
	},
	watch: {
		monacoEditor: {
			handler() {
				if (this.monacoEditor) {
					this.validationRules = this.monacoEditor;
				} else {
					this.validationRules =
						'using System;\r\nusing Bi.Entities.Response;\r\nusing System.Text;\r\nusing System.Linq;\r\nusing System.Data;\r\nusing System.Collections.Generic;\r\nusing Bi.Core.Extensions;\r\n\r\nnamespace RoslynCompileSample\r\n{\r\n    public class Writer\r\n    {\r\n        public string Write(List<CellItem> list)\r\n        {\r\n            try{\r\n                //此处编写代码\r\n                \r\n\r\n\r\n            }catch(Exception ex){\r\n                return ex.ToString();\r\n            }    \r\n            // 此处返回OK 代表程序正常执行，否则抛出异常\r\n            return "OK";\r\n        }\r\n    }\r\n}';
				}
			},
			deep: true,
			immediate: true,
		},
		drawerFlag() {
			this.$parent.drawerFlag = this.drawerFlag;
		},
	},
	mounted() {},
	methods: {
		//更新数据
		submitClick(flag) {
			//是否已核验
			if (this.isCheck) {
				this.$emit("update:monacoEditor", this.validationRules);
				if (flag) {
					this.cancelClick();
				}
			} else {
				this.$Msg.warning("请检查语法后再保存提交");
			}
		},
		// 校验函数信息
		checkClick() {
			this.$Notice.destroy();
			checkFunctionReq({ dynamicCode: this.validationRules }).then((res) => {
				if (res.code == 200) {
					this.$Notice.warning({
						title: res.message,
						desc: "",
						duration: 0,
					});
					if (res.message === "语法检查无误！") {
						this.isCheck = true;
					} else this.isCheck = false;
				}
			});
		},
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
			this.$Notice.destroy();
		},
	},
};
</script>
<style>
.ivu-notice {
	right: auto !important;
	left: 0px !important;
	width: auto !important;
}
</style>
<style scoped lang="less">
/deep/.ivu-table-wrapper {
	margin-bottom: 1rem;
}
/deep/.ivu-tree {
	height: 400px;
	background: #e6fbf2;
	border-radius: 10px;
	padding: 1rem;
	margin-bottom: 3rem;
	overflow: auto;
}
</style>
