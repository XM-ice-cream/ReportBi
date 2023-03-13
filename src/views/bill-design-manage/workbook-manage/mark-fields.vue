/**标记 */
<template>
	<!-- 函数管理 -->
	<Modal :title="isAdd ? '标记' : '标记'" v-model="modelFlag" width="800" draggable :mask-closable="false" :mask="true" :before-close="cancelClick">
		<div class="mark-fields">
			<Form ref="submitReq" :model="submitData" :label-width="100" :label-colon="true">
				<!-- 文本宽度 -->
				<FormItem label="文本宽度" prop="markValue" v-if="submitData.innerText === 'labelWidth'">
					<InputNumber v-model="submitData.markValue" controls-outside :step="10" />
				</FormItem>
				<!-- 颜色设定 -->
				<FormItem label="颜色设定" prop="markValue" v-if="submitData.innerText === 'color'">
					<Tree :data="submitData.markValue" :render="renderContent"></Tree>
				</FormItem>
			</Form>
		</div>
		<Spin size="large" fix v-if="spinShow"></Spin>
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
	name: "mark-fields",
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
		isAdd: {
			type: Boolean,
			default: () => true,
		},
	},
	watch: {
		modelFlag(newVal) {
			if (newVal) {
				this.submitData = { ...this.selectObj };
				const { innerText } = this.submitData;
				if (innerText === "labelWidth" && this.isAdd) {
					this.submitData.markValue = 90;
				}
				//新增的时候 需要获取字段对应的所有值
				if (innerText === "color" && this.isAdd) {
					//获取对应字段的所有值
					this.getAllValue();
				}
			}
		},
	},
	data() {
		return {
			submitData: {},
			colorSelect: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
			modelFlag: false,
			spinShow: false,
		};
	},
	methods: {
		//获取数据
		pageLoad() {},
		//提交
		submitClick() {
			const { newIndex, markIndex } = this.submitData;
			this.$emit("updateMark", newIndex, this.submitData, markIndex); //取消后 删除拖拽的cell
			this.$refs.submitReq.resetFields();
			this.cancelClick(); //关闭弹框
		},
		//获取字段对应的所有值
		getAllValue() {
			this.spinShow = true;
			const { dataType } = this.submitData;
			const obj = {
				filterFields: this.filterData,
				markField: this.submitData,
			};
			getMarksReq(obj)
				.then((res) => {
					if (res.code == 200) {
						const data = res.result;
						this.submitData.markValue =
							data.map((item, index) => {
								if (dataType === "DateTime") item = formatDate(item);
								const colorIndex = index % 9;
								return { title: item, color: this.colorSelect[colorIndex], nodeKey: index };
							}) || [];
					} else {
						this.$message.error(`查询失败,${res.message}`);
						this.submitData.markValue = [];
					}
					this.submitData = JSON.parse(JSON.stringify(this.submitData));
				})
				.finally(() => {
					this.spinShow = false;
				});
		},
		renderContent(h, { root, node, data }) {
			return h(
				"span",
				{
					style: {
						display: "inline-block",
						width: "100%",
						padding: "5px",
					},
				},
				[
					h("span", [
						h("ColorPicker", {
							props: {
								size: "small",
								value: data.color,
							},
							style: {
								marginRight: "10px",
							},
							on: {
								"on-change": (val) => {
									data.color = val;
								},
							},

							// style: {
							// 	width: "15px",
							// 	height: "15px",
							// 	backgroundColor: data.color,
							// 	display: "inline-block",
							// 	marginRight: "8px",
							// },
						}),
						h("span", data.title),
					]),
				]
			);
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
<style lang="less" scoped>
.mark-fields {
	height: 500px;
	overflow: auto;
}
</style>
