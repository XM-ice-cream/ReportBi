<template>
	<div class="extel-panel">
		<Tabs size="small">
			<TabPane label="单元格属性" name="first" size="small">
				<tab-pane-1 :formData="rightForm.cellAttribute" @autoChangeFunc="autoChangeFunc" />
			</TabPane>
			<TabPane label="单元格元素" name="seconed" size="small">
				<tab-pane-2 :formData="rightForm.cell" @autoChangeFunc="autoChangeFunc" />
			</TabPane>
			<TabPane label="条件属性" name="thired" size="small">
				<tab-pane-3 :formData="rightForm.conditions" @autoChangeFunc="autoChangeFunc" />
			</TabPane>
		</Tabs>
	</div>
</template>
<script>
import tabPane1 from "./tabPane1.vue";
import TabPane2 from "./tabPane2.vue";
import TabPane3 from "./tabPane3.vue";

export default {
	components: { tabPane1, TabPane2, TabPane3 },
	name: "right-tabPane",
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
				console.log(this.rightForm);
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {
			rightForm: {},
		};
	},
	methods: {
		autoChangeFunc(type, rightForm) {
			this.rightForm[type] = rightForm instanceof Array ? [...rightForm] : { ...rightForm };
			console.log("rightForm", rightForm, type, this.rightForm);
			this.$emit("autoChangeFunc", this.rightForm);
		},
	},
};
</script>
<style>
.excel-menu .ivu-menu-vertical .ivu-menu-item-group-title {
	display: none;
}
.excel-menu .ivu-icon {
	margin-right: 6px;
	font-size: 1rem;
	text-align: center;
	font-weight: bold;
}
.excel-menu .ivu-menu-vertical .ivu-menu-item {
	padding: 12px 14px;
}
.excel-menu .ivu-poptip-body-content {
	overflow: hidden;
	text-align: center;
}
.excel-menu .ivu-poptip-popper {
	min-width: 60px;
}
/* .excel-tabs .ivu-tabs-nav .ivu-tabs-tab {
  padding: 8px 5px;
  margin-right: 8px;
} */
</style>
<style scoped lang="less">
.extel-panel {
	width: 100%;
	display: flex;
	margin-left: 0.5rem;
}
</style>
