/* 单元格元素过滤数据 */
<template>
	<div class="pane2-filter-data">
		<!-- 左侧抽屉 -->
		<Drawer v-model="drawerFlag" :title="drawerTitle" width="750" :mask-closable="false" @on-close="cancelClick">
			<Form ref="submitReq" :model="rightForm" :label-width="110" @submit.native.prevent>
				<!-- 自定义分组类型：条件，公式分组 -->
				<FormItem label="父格条件" prop="isFather">
					<Checkbox v-model="rightForm.isFather" size="small">将父格作为过滤条件（适用于父子格来自于同一个数据集）</Checkbox>
				</FormItem>

				<!-- 过滤表格 type=""说明默认不显示可选列-->
				<ConditionSetting
					ref="conditionsetting"
					type="1"
					:drawerFlag.sync="drawerFlag"
					:selectItemList="selectItemList"
					:rightForm="rightForm.data"
					@updateData="updateData"
				/>

				<!-- 按钮 -->
				<FormItem>
					<drawer-button
						:text="drawerTitle"
						class="tree"
						@on-cancel="cancelClick"
						@on-ok="submitClick"
						@on-okAndClose="submitClick(true)"
					></drawer-button>
				</FormItem>
			</Form>
		</Drawer>
	</div>
</template>

<script>
import ConditionSetting from "@/components/condition-setting/condition-setting.vue";
import { getDeatilByIdReq } from "@/api/bill-design-manage/data-set.js";

export default {
	name: "pane2-filter-data",
	components: { ConditionSetting },
	props: {
		formData: {
			type: Object,
			default: () => {},
		},
	},
	computed: {},
	data() {
		return {
			rightForm: {},
			tableConfig: { ...this.$config.tableConfig }, // table配置
			drawerFlag: false,
			drawerTitle: "过滤数据",
			data: [],
			selectItemList: [],
		};
	},
	watch: {
		drawerFlag(newValue) {
			if (newValue) {
				if (this.drawerTitle) {
					this.title = this.drawerTitle;
					this.autoSize();
					window.addEventListener("resize", () => {
						this.autoSize();
					});
				}
			}
		},
		formData: {
			handler() {
				this.rightForm = { ...this.formData };
			},
			deep: true,
			immediate: true,
		},
	},
	mounted() {},
	methods: {
		//更新数据
		submitClick(flag) {
			this.rightForm.filterData = "";
			this.rightForm.data = [...this.data];
			this.data.forEach((item) => {
				this.rightForm.filterData += `${item.logic} `;
			});
			if (flag) this.cancelClick();
			this.$emit("autoChangeFunc", this.rightForm);
		},
		updateData(val) {
			this.data = val;
		},
		//获取全部数据集
		async loadDataSet(val) {
			//label = #{WF_UNITINFOTRAVEL.unitid};
			const label = val.replace(/#|{|}/g, "");
			const setCode = label.split(".");
			let obj = { setCode: setCode[0] };
			const { result } = await getDeatilByIdReq(obj);
			this.selectItemList = result.setParamList;
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = 100;
		},
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
			this.data = [];
		},
	},
};
</script>
<style></style>
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
