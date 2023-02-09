/**标记 */
<template>
	<!-- 函数管理 -->
	<Modal :title="isAdd ? '标记' : '标记'" v-model="modelFlag" width="800" draggable :mask-closable="false" :mask="true" :before-close="cancelClick">
		<div class="mark-fields">
			<Form ref="submitReq" :model="submitData" :label-width="100" :label-colon="true">
				<!-- 显示数据 -->
				<FormItem label="文本宽度" prop="labelWidth" v-if="submitData.markId === 'labelWidth'">
					<InputNumber v-model="submitData.labelWidth" controls-outside :step="10" />
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
export default {
	name: "mark-fields",
	components: {},
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
			submitData: {},
			modelFlag: false,
		};
	},
	methods: {
		//获取数据
		pageLoad() {},
		//提交
		submitClick() {
			const { newIndex } = this.submitData;
			this.$emit("updateMark", newIndex, this.submitData); //取消后 删除拖拽的cell
			this.$refs.submitReq.resetFields();
			this.cancelClick(); //关闭弹框
		},

		//关闭弹框
		cancelClick() {
			// const { newIndex } = this.submitData;
			this.modelFlag = false;
			// this.$refs.submitReq.resetFields();
			// this.$emit("deleteFilter", newIndex); //取消后 删除拖拽的cell
		},
	},
};
</script>
<style lang="less" scoped></style>
