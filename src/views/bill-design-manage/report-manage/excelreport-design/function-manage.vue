<template>
	<!-- 函数管理 -->
	<Modal title="数据集管理" v-model="outerVisible" class="functionModal" width="1200">
		<div class="function-editor" id="function-editor">
			<monaco-editor v-model.trim="rightForm.v" language="sql" style="height: 200px" v-if="outerVisible" />
		</div>
		<div class="function-content">
			<div class="function-type">
				<Menu :active-name="menuType" @on-select="(name) => (menuType = name)">
					<MenuGroup title="函数类型">
						<MenuItem :name="index" v-for="(item, index) in dataItemList" :key="index">
							{{ item.itemName }}
						</MenuItem>
					</MenuGroup>
				</Menu>
			</div>
			<div class="function-name">
				<Menu :active-name="menuName" @on-select="(name) => (menuName = name)">
					<MenuGroup title="函数名">
						<MenuItem
							:name="index"
							v-for="(item, index) in dataItemList[parseInt(menuType)].children"
							:key="index"
							@dblclick.native="menuDblclick(item)"
						>
							{{ item.detailCode }}
						</MenuItem>
					</MenuGroup>
				</Menu>
			</div>
			<div class="function-remark">
				{{ dataItemList[parseInt(menuType)].children[parseInt(menuName)].remark }}
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<Button @click="outerVisible = false">取 消</Button>
			<Button type="primary" @click="autoChangeFunc">确定 </Button>
		</div>
	</Modal>
</template>
<script>
import { getlistReq as getDataItemReq, getlisttreeReq } from "@/api/system-manager/data-item";
import MonacoEditor from "@/components/monaco-editor/monaco-editor.vue";

export default {
	name: "function-manage",
	components: { MonacoEditor },
	props: {
		formData: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		formData: {
			handler() {
				this.rightForm = { ...this.formData };
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {
			rightForm: {},
			outerVisible: false,
			menuType: "0",
			menuName: "0",
			dataItemList: [],
		};
	},
	methods: {
		//提交
		autoChangeFunc() {
			this.outerVisible = false;
			this.rightForm.m = this.rightForm.v;
			this.$emit("autoChangeFunc", this.rightForm);
		},
		//双击
		menuDblclick(val) {
			this.rightForm.v = `=${val.detailCode}()`;
			this.rightForm.m = `=${val.detailCode}()`;
		},
		// 获取业务数据
		async getDataItemData() {
			this.dataItemList = [];
			await getlisttreeReq({ id: "", parentId: "0", itemCode: "", itemName: "", enabled: -1 }).then((res) => {
				if (res.code === 200) {
					res.result.forEach((item) => {
						if (item.itemCode === "reportDesign") {
							item?.children.forEach((citem) => {
								if (citem.itemCode === "designFuncion") {
									citem?.children.forEach((ccitem) => {
										const { itemCode, itemName } = ccitem;
										this.getDataItemDetailList(itemCode, itemName);
									});
								}
							});
						}
					});
				}
			});
		},

		// 获取数据字典数据
		async getDataItemDetailList(itemCode, itemName) {
			let arr = [];
			await getDataItemReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) {
					this.dataItemList.push({ itemCode, itemName, children: res.result || [] });
				}
			});
			return arr;
		},
	},
};
</script>
<style lang="less" scoped>
.functionModal {
	position: relative;
	.function-content {
		display: flex;
		.function-remark {
			padding: 20px;
		}
	}
}
</style>
