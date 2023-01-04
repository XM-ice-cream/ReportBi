/**创建计算字段 */
<template>
	<!-- 函数管理 -->
	<Modal title="创建计算字段" v-model="modelFlag" width="1200">
		<div class="left-box">
			<Input type="text" v-model="selectObject.columnName" clearabled />
			<Input v-model="selectObject.function" type="textarea" :autosize="{ minRows: 5, maxRows: 5 }" />
		</div>
		<div class="right-box">
			<Select v-model="selectObject.type" style="width: 200px">
				<Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
			</Select>
		</div>

		<div slot="footer" class="dialog-footer">
			<Button @click="outerVisible = false">取 消</Button>
			<Button type="primary" @click="autoChangeFunc">确定 </Button>
		</div>
	</Modal>
</template>
<script>
import { getlistReq as getDataItemReq, getlisttreeReq } from "@/api/system-manager/data-item";

export default {
	name: "create-fields",
	components: {},
	props: {
		selectObject: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		selectObject: {
			handler() {
				this.rightForm = { ...this.formData };
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {
			typeList: [
				{
					value: "",
					label: "全部",
				},
				{
					value: "number",
					label: "数字",
				},
				{
					value: "string",
					label: "字符串",
				},
				{
					value: "date",
					label: "日期",
				},
				{
					value: "类型转换",
					label: "changeType",
				},
				{
					value: "逻辑",
					label: "logic",
				},
				{
					value: "聚合",
					label: "syndication",
				},
			],
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
			console.log("this.rightForm", this.rightForm);
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
									console.log(citem.itemCode);
									citem?.children.forEach((ccitem) => {
										const { itemCode, itemName } = ccitem;
										this.getDataItemDetailList(itemCode, itemName);
									});
								}
							});
						}
					});
					console.log(this.dataItemList);
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
