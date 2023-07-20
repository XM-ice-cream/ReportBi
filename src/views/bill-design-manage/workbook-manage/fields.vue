/**行、列 */
<template>
	<!-- 函数管理 -->
	<Modal :title="modelTitle" v-model="modelFlag" width="800" draggable :mask-closable="false" :mask="true" :before-close="cancelClick">
		<div class="mark-fields">
			<Form ref="submitReq" :model="submitData" :label-width="100" :label-colon="true">
				<!-- 最小值 -->
				<FormItem label="Min" prop="min">
					<InputNumber v-model="submitData.remark.min" placeholder="请输入最小值" />
				</FormItem>
				<!-- 最大值 -->
				<FormItem label="Max" prop="max">
					<InputNumber v-model="submitData.remark.max" placeholder="请输入最大值" />
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
	name: "fields",
	components: {},
	props: {
		selectObj: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		modelFlag(newVal) {
			if (newVal) {
				this.submitData = JSON.parse(JSON.stringify(this.selectObj));
				this.submitData.remark = JSON.parse(this.submitData?.remark) || { min: 0, max: 0 };
			}
		},
	},
	data() {
		return {
			submitData: {},
			modelFlag: false,
			modelTitle: "行边界值",
		};
	},
	methods: {
		//获取数据
		pageLoad() {},
		//提交
		submitClick() {
			const { newIndex, markIndex } = this.submitData;
			this.cancelClick(); //关闭弹框
			this.$nextTick(() => {
				this.$emit("updateRowColumn", newIndex, this.submitData, markIndex); //取消后 删除拖拽的cell
				this.$refs.submitReq.resetFields();
			});
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
<style>
.ivu-select-dropdown.ivu-transfer-no-max-height {
	width: 260px;
}
</style>
<style lang="less" scoped>
.mark-fields {
	height: 500px;
	overflow: auto;
}
.color-bg {
	height: 24px;
	margin: 10px 0;
	background: linear-gradient(to right, var(--start), var(--end));
}
.add-box {
	display: inline-block;
	margin-bottom: 20px;
	padding: 2px 10px;
	background: #27ce88;
	color: #fff;
}
</style>
