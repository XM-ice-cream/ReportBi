/**标记 */
<template>
	<!-- 函数管理 -->
	<Modal :title="isAdd ? '标记' : '标记'" v-model="modelFlag" width="800" draggable :mask-closable="false" :mask="true" :before-close="cancelClick">
		<div class="mark-fields">
			<Form ref="submitReq" :model="submitData" :label-width="100">
				<!-- 文本宽度 -->
				<FormItem label="文本宽度" prop="markValue" v-if="submitData.innerText === 'labelWidth'">
					<InputNumber v-model="submitData.markValue" controls-outside :step="10" />
				</FormItem>
				<!-- 颜色设定 -->
				<FormItem label="颜色设定" prop="markValue" v-if="submitData.innerText === 'color' && !this.numberType(this.submitData)">
					<Tree :data="submitData.markValue" :render="renderContent"></Tree>
				</FormItem>
				<!-- 数字类型颜色设定 -->
				<template v-if="submitData.innerText === 'color' && this.numberType(this.submitData)">
					<FormItem label="类型">
						<RadioGroup v-model="submitData.markValue.colorType" type="button" button-style="solid">
							<Radio :label="1" border>连续</Radio>
							<Radio :label="0" border>区间</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="颜色设定">
						<!-- 连续颜色设定 -->
						<template v-if="submitData.markValue.colorType == 1">
							<ColorPicker v-model="submitData.markValue.startRange" recommend />
							<div
								class="color-bg"
								:style="{
									'--start': submitData.markValue.startRange,
									'--end': submitData.markValue.endRange,
								}"
							></div>
							<ColorPicker v-model="submitData.markValue.endRange" recommend />
						</template>
						<!-- 区间颜色设定 -->
						<template v-else>
							<div class="add-box" @click="addClick"><icon custom="iconfont icon-add" class="add-icon" /> 添加颜色区段</div>

							<Table :columns="columns" :data="submitData.markValue.pieces" :height="tableConfig.height" disabled-hover>
								<!-- 大于 -->
								<template #gt="{ row, index }">
									<InputNumber type="text" v-model="submitData.markValue.pieces[index].gt" />
								</template>
								<!-- 小于 -->
								<template #lte="{ row, index }">
									<InputNumber type="text" v-model="submitData.markValue.pieces[index].lte" />
								</template>
								<!-- 颜色 -->
								<template #color="{ row, index }">
									<ColorPicker v-model="submitData.markValue.pieces[index].color" recommend transfer />
								</template>
								<!-- 自定义显示文本 -->
								<template #label="{ row, index }">
									<Input type="text" v-model="submitData.markValue.pieces[index].label" />
								</template>
								<!-- 操作 -->
								<template #operator="{ row, index }">
									<Button
										type="error"
										ghost
										size="small"
										@click="deleteClick(index, submitData.markValue.pieces)"
										custom-icon="iconfont icon-delete"
									></Button>
								</template>
							</Table>

							<div style="margin-top: 50px">其余颜色： <ColorPicker v-model="submitData.markValue.outOfRange" recommend transfer /></div>
						</template>
					</FormItem>
				</template>
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
				this.submitData = JSON.parse(JSON.stringify(this.selectObj));
				console.log("标记", this.submitData);
				const { innerText } = this.submitData;
				if (innerText === "labelWidth" && this.isAdd) {
					this.submitData.markValue = 90;
				}
				//新增的时候 需要获取字段对应的所有值 新增 或者 类型为数字类型，重新获取字段值
				if (innerText === "color") {
					//字符串类型 并且没有标记值
					if (!this.numberType(this.submitData) && (!this.submitData.markValue || this.submitData.markValue.length === 0)) {
						//获取对应字段的所有值
						this.getAllValue();
					}
				}
			}
		},
	},
	data() {
		return {
			submitData: {},
			tableConfig: { ...this.$config.tableConfig }, // table配置
			colorSelect: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
			modelFlag: false,
			spinShow: false,
			columns: [
				{
					title: "大于",
					slot: "gt",
					align: "center",
				},
				{
					title: "小于",
					slot: "lte",
					align: "center",
				},
				{
					title: "颜色",
					slot: "color",
					align: "center",
				},
				{
					title: "自定义显示文本",
					slot: "label",
					align: "center",
				},
				{
					title: "操作",
					slot: "operator",
					align: "center",
				},
			],
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
				this.$emit("updateMark", newIndex, this.submitData, markIndex); //取消后 删除拖拽的cell
				this.$refs.submitReq.resetFields();
			});
		},
		//获取字段对应的所有值
		getAllValue() {
			this.spinShow = true;
			const { dataType } = this.submitData;
			console.log("this.submitData", this.submitData);
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
						this.$Msg.error(`查询失败,${res.message}`);
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
		//数字类型
		numberType(item) {
			const numberFunction = ["count", "countDistinct"];
			const isNotContinue = item.dataType === "Number" || numberFunction.includes(item.calculatorFunction);
			return item.isContinue === "1" ? true : item.isContinue === "0" ? false : isNotContinue;
		},
		//新增字段
		addClick() {
			this.submitData.markValue.pieces.push({ gt: 0, lte: 50, color: "#27ce88" });
		},
		//删除字段
		deleteClick(index, rows) {
			rows.splice(index, 1);
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
