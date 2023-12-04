/**数据集筛选过滤字段 */
<template>
	<!-- 函数管理 -->
	<Modal :title="modelTitle" v-model="modelFlag" width="800" draggable :mask-closable="false" :mask="true" :before-close="cancelClick">
		<div class="filter-fields">
			<Form ref="submitReq" :model="submitData" :label-width="100">
				<!-- 筛选信息 -->
				<FormItem label="筛选信息" prop="value">
					<DatePicker
						transfer
						type="datetime"
						:placeholder="$t('pleaseSelect') + '时间值'"
						:options="$config.datetimeOptions"
						v-model="submitData.value"
						v-if="submitData.columnType.toUpperCase().includes('DATE')"
					></DatePicker>
					<!-- 数字 -->
					<InputNumber v-else-if="submitData.columnType.toUpperCase() === 'NUMBER'" v-model.trim.number="submitData.value" clearable />
					<Input type="textarea" :autosize="{ minRows: 2, maxRows: 15 }" v-else v-model="submitData.value" clearabled />
				</FormItem>
			</Form>
		</div>

		<div slot="footer" class="dialog-footer">
			<Button @click="cancelClick">取 消</Button>
			<Button type="primary" @click="submitClick">确定 </Button>
		</div>
	</Modal>
</template>
<script>
import { formatDate } from "@/libs/tools";
export default {
	name: "filter-dataset-fields",
	props: {
		selectObj: {
			type: Object,
			default: () => {},
		},
		isAdd: {
			type: Boolean,
			default: () => true,
		},
	},
	watch: {
		modelFlag(newVal) {
			if (newVal) {
				this.submitData = { ...this.selectObj };
			}
		},
	},
	data() {
		return {
			modelTitle: "数据集筛选器",
			submitData: {},
			modelFlag: false,
		};
	},
	methods: {
		//提交
		submitClick() {
			const { newIndex, columnType, value } = this.submitData;
			if (columnType.toUpperCase().includes("DATE")) {
				this.submitData.value = `${formatDate(value)}`;
			}
			this.$emit("updateDataSetFilter", newIndex, this.submitData); //取消后 删除拖拽的cell
			this.$refs.submitReq.resetFields();
			this.modelFlag = false;
		},

		//删除过滤数据
		cancelClick() {
			this.modelFlag = false;
		},
	},
};
</script>
<style lang="less" scoped></style>
