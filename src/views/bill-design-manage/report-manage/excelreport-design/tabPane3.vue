<!-- 条件属性 -->
<template>
	<div class="tabpane3-container">
		<Form ref="rightForm" :label-width="60" style="padding: 0 1.3rem">
			<!-- 添加条件 -->
			<FormItem label="添加条件">
				<Button long @click="add">
					<Icon type="md-add" />
				</Button>
			</FormItem>
		</Form>
		<Table border :columns="columns" :data="rightForm" width="280">
			<template #name="{ row }">
				<strong>{{ row.name }}</strong>
			</template>
			<template #action="{ row, index }">
				<Button type="primary" size="small" style="margin-right: 5px" @click="show(row, index)">View</Button>
				<Button type="error" size="small" @click="remove(index)">Delete</Button>
			</template>
		</Table>
		<!-- 条件属性设定 -->
		<pane-3-condition ref="pane3condition" @autoChangeFunc="autoChangeFunc" />
	</div>
</template>
<script>
import Pane3Condition from "./pane3-condition.vue";

export default {
	components: { Pane3Condition },
	name: "tabPane3",
	props: {
		formData: {
			type: Array,
			default: () => [],
		},
	},
	watch: {
		formData: {
			handler() {
				console.log("this.formData", this.formData);
				this.rightForm = this.formData.map((item) => item);
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {
			rightForm: [], //父组件的值 用data接收
			dataIndex: "",
			columns: [
				{
					title: "Name",
					slot: "name",
					align: "center",
				},
				{
					title: "Action",
					slot: "action",
					align: "center",
				},
			],
		};
	},
	methods: {
		autoChangeFunc(val) {
			this.rightForm[this.dataIndex] = { ...val };
			console.log("condition", this.rightForm);
			this.$emit("autoChangeFunc", "conditions", this.rightForm);
		},
		//添加条件
		add() {
			const obj = { name: `条件属性${this.rightForm.length + 1}`, types: [] };
			this.rightForm.push(obj);
		},
		//删除
		remove(index) {
			this.rightForm.splice(index, 1);
		},
		//编辑条件属性
		show(val, index) {
			console.log("val", val);
			this.dataIndex = index;
			this.$refs.pane3condition.drawerFlag = true;
			this.$refs.pane3condition.rightForm = { ...val };
		},
	},
};
</script>
<style></style>
<style scoped lang="less"></style>
