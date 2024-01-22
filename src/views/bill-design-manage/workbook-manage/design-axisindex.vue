/**图表 行列 轴值设定 */
<template>
	<!-- 函数管理 -->
	<Modal :title="modelTitle" v-model="modelFlag" width="800" draggable :mask-closable="false" :mask="true" :before-close="cancelClick">
		<div class="mark-fields">
			<Form ref="submitReq" :model="submitData" :label-width="100" :label-colon="true">
				<!-- 是否默认轴值 -->
				<FormItem label="是否默认轴值" prop="isDesign">
					<i-switch size="large" v-model="submitData.isDesign" :true-value="1" :false-value="0">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<template v-if="submitData.isDesign === 1">
					<FormItem label="Grid索引" prop="gridIndex">
						<InputNumber v-model.trim="submitData.gridIndex" clearable />
					</FormItem>
					<FormItem label="共用轴" prop="publicAxis">
						<Select v-model="submitData.publicAxis" clearable transfer>
							<Option v-for="(item, i) in publicAxisList" :value="item.value" :key="i">{{ item.label }}</Option>
						</Select>
					</FormItem>
				</template>
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
	name: "design-setGridindex",
	props: {
		selectObj: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		modelFlag(newVal) {
			if (newVal) {
				const temp = JSON.parse(JSON.stringify(this.selectObj));
				this.submitData = JSON.parse(temp?.setGrid) || { isDesign: 0, gridIndex: 0, publicAxis: "right" }; //默认不共用值
				console.log("this.submitData", this.submitData);
			}
		},
	},
	data() {
		return {
			submitData: {},
			modelFlag: false,
			modelTitle: "设置轴值",
			publicAxisList: [
				{
					value: "left",
					label: "同轴",
				},
				{
					value: "right",
					label: "双轴",
				},
			],
		};
	},
	methods: {
		//获取数据
		pageLoad() {},
		//提交
		submitClick() {
			const { newIndex, markIndex } = this.selectObj;
			this.cancelClick(); //关闭弹框
			this.$nextTick(() => {
				this.$emit("updateRowColumn", newIndex, { ...this.selectObj, setGrid: JSON.stringify({ ...this.submitData }) }, markIndex); //取消后 删除拖拽的cell
				this.$refs.submitReq.resetFields();
			});
		},

		//关闭弹框
		cancelClick() {
			this.modelFlag = false;
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
