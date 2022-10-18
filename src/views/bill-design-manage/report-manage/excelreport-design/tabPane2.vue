<template>
	<div class="tabpane2-container">
		<Form ref="rightForm" :model="rightForm" :label-width="80" style="padding: 0 1.3rem">
			<!-- 显示方式：分组，列表，汇总 -->
			<FormItem label="数据设置">
				<Select v-model="rightForm.showType" size="small" transfer class="showtype" @on-change="autoChangeFunc">
					<Option v-for="item in showTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
				<!-- 分组为汇总的 -->
				<Select v-model="rightForm.showTypeValue" size="small" transfer v-if="['summary'].includes(rightForm.showType)" class="showtype" @on-change="autoChangeFunc">
					<Option v-for="item in showTypeList[2].children" :value="item.value" :key="item.value" :label="item.label"></Option>
				</Select>
			</FormItem>
			<!-- 常量不设定过滤值 -->
			<FormItem label="过滤条件" v-if="rightForm.label && rightForm.label.indexOf('#') > -1">
				<Button long @click="filterClick">编辑</Button>
			</FormItem>
			<!-- 补充空白行 -->
			<FormItem label="数据总行数">
				<InputNumber v-model="rightForm.blankNum" class="inputNumber" placeholder="请输入数据总行数" clearable @on-change="autoChangeFunc" />
			</FormItem>
		</Form>
		<!-- 自定义 -->
		<pane-2-user-defined ref="userDefined" :formData="rightForm" />
		<!-- 过滤数据 -->
		<pane-2-filter-data ref="filterData" :formData.sync="rightForm" @autoChangeFunc="autoChangeFunc" />
	</div>
</template>
<script>
import Pane2FilterData from "./pane2-filter-data.vue";
import pane2UserDefined from "./pane2-user-defined.vue";

export default {
	components: { pane2UserDefined, Pane2FilterData },
	name: "tabPane2",
	props: {
		formData: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		formData: {
			handler() {
				console.log("this.formData", this.formData);
				this.rightForm = { ...this.formData };
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {
			rightForm: {},
			//数据显示类型
			showTypeList: [
				{
					label: "分组",
					value: "group",
				},
				{
					label: "列表",
					value: "list",
				},
				{
					label: "汇总",
					value: "summary",
					children: [
						{ label: "求和", value: "sum" },
						{ label: "平均", value: "avg" },
						{ label: "最大值", value: "max" },
						{ label: "最小值", value: "min" },
						{ label: "个数", value: "count" },
						{ label: "个数(去重)", value: "countDistinct" },
					],
				},
			],
		};
	},
	methods: {
		autoChangeFunc(val) {
			this.rightForm = { ...this.rightForm, ...val };
			const { showType } = this.rightForm;
			if (showType !== "summary") this.rightForm.showTypeValue = "";
			this.$emit("autoChangeFunc", "cell", this.rightForm);
		},
		//自定义按钮设定
		userDefinedClick() {
			this.$refs.userDefined.drawerFlag = true;
		},
		//过滤数据
		filterClick() {
			this.$refs.filterData.loadDataSet(this.rightForm.label);
			this.$refs.filterData.drawerFlag = true;
		},
	},
};
</script>
<style></style>
<style scoped lang="less">
.tabPane2 {
	.showtype {
		margin-bottom: 5px;
	}
	.showtypebtn {
		border: 1px solid #dcdee2;
		text-align: center;
	}
	.inputNumber {
		width: 50%;
	}
}
</style>
