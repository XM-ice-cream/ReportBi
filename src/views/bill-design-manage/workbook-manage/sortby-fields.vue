/**字段排序 */
<template>
	<!-- 函数管理 -->
	<Modal :title="modalTitle" v-model="modelFlag" width="800" draggable :mask-closable="false" :mask="true" :before-close="cancelClick">
		<div class="sortby-fields">
			<Form ref="submitReq" :model="submitData" :label-width="100">
				<!-- 排序类别 -->
				<FormItem label="排序" prop="sortBy">
					<Select v-model="submitData.sortBy" clearabled @on-change="changeSortBy">
						<Option v-for="(item, index) in sortByList" :value="item.value" :key="index">{{ item.name }} </Option>
					</Select>
				</FormItem>
			</Form>

			<Table
				:columns="columns"
				:data="submitData.sortValue"
				:height="400"
				draggable
				@on-drag-drop="changeOrder"
				:loading="tableConfig.loading"
				v-if="submitData.sortBy === 'manual'"
			>
			</Table>
		</div>
		<div slot="footer" class="dialog-footer">
			<Button @click="cancelClick">取 消</Button>
			<Button type="primary" @click="submitClick">确定 </Button>
		</div>
	</Modal>
</template>
<script>
import { getMarksReq } from "@/api/bill-design-manage/workbook-design.js";
import { formatDate } from "@/libs/tools";

export default {
	name: "sortby-fields",
	components: {},
	props: {
		selectObj: {
			type: Object,
			default: () => {},
		},
		filterData: {
			type: Array,
			default: () => [],
		},
	},
	watch: {
		modelFlag(newVal) {
			if (newVal) {
				this.$nextTick(() => {
					if (this.selectObj.sortBy) {
						this.submitData = { ...this.selectObj };
					} else {
						this.submitData = { ...this.selectObj, sortBy: "0", sortValue: [] };
					}
					if (this.submitData.sortBy === "manual") {
						this.changeSortBy();
					}
				});
			}
		},
	},
	data() {
		return {
			submitData: {},
			modelFlag: false,
			modalTitle: "字段排序",
			tableConfig: { ...this.$config.tableConfig }, // table配置
			sortByList: [
				{ name: "数据源顺序", value: "0" },
				{ name: "升序", value: "asc" },
				{ name: "降序", value: "desc" },
				{ name: "手动", value: "manual" },
			],
			columns: [
				{
					type: "index",
					width: 50,
					align: "center",
				},
				{ title: "value", key: "value", align: "center", tooltip: true, minWidth: 150 },
			],
		};
	},
	methods: {
		//获取数据
		pageLoad() {},
		//提交
		submitClick() {
			const { newIndex, markIndex } = this.submitData;
			this.$emit("updateSort", newIndex, this.submitData, markIndex); //取消后 删除拖拽的cell
			this.$refs.submitReq.resetFields();
			this.cancelClick(); //关闭弹框
		},
		//排序
		changeSortBy() {
			this.tableConfig.loading = false;
			if (this.submitData.sortBy === "manual" && (!this.submitData.sortValue || this.submitData?.sortValue?.length == 0)) {
				this.getAllValue();
			}
		},
		//获取字段对应的所有值
		getAllValue() {
			const { dataType } = this.submitData;

			const obj = {
				filterFields: this.filterData,
				markField: { ...this.submitData },
			};
			this.tableConfig.loading = true;
			getMarksReq(obj)
				.then((res) => {
					if (res.code == 200) {
						const data = res.result;
						this.submitData.sortValue =
							data.map((item, index) => {
								if (dataType === "DateTime") item = formatDate(item);
								return { value: item };
							}) || [];
					} else {
						this.$Msg.error(`查询失败,${res.message}`);
						this.submitData.sortValue = [];
					}
					this.submitData = JSON.parse(JSON.stringify(this.submitData));
				})
				.finally(() => (this.tableConfig.loading = false));
		},
		//排序
		changeOrder(oldIndex, newIndex) {
			oldIndex = parseInt(oldIndex);
			newIndex = parseInt(newIndex);
			let oldData = this.submitData.sortValue[oldIndex];
			this.submitData.sortValue.splice(oldIndex, 1, this.submitData.sortValue[newIndex]);
			this.submitData.sortValue.splice(newIndex, 1, oldData);
		},
		//关闭弹框
		cancelClick() {
			this.modelFlag = false;
		},
	},
};
</script>
<style lang="less" scoped>
.sortby-fields {
	height: 500px;
	overflow: auto;
}
</style>
