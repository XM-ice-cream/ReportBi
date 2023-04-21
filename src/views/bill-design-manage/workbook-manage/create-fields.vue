/**创建计算字段 */
<template>
	<!-- 函数管理 -->
	<Modal
		:title="isAdd ? '新建计算字段' : '编辑计算字段'"
		v-model="modelFlag"
		width="1500"
		draggable
		:mask-closable="false"
		:mask="true"
		:closable="true"
		:before-close="cancelClick"
	>
		<div class="create-field">
			<div class="left-box">
				<Input type="text" v-model="submitData.columnName" clearabled />
				<!-- <draggable group="site" v-model="submitData.fieldFunction" id="filter"> -->
				<Input
					v-model="submitData.fieldFunction"
					type="textarea"
					ref="fieldFunction"
					:autosize="{ minRows: 20, maxRows: 20 }"
					style="margin-top: 10px"
				></Input>
				<!-- 校验信息 -->
				<Alert :type="tipObj.code == 200 ? 'success' : 'error'" show-icon style="margin-top: 10px" v-if="tipObj.code">
					数据类型:{{ tipObj.result }}
					<template #desc>{{ tipObj.message }}</template>
				</Alert>
				<!-- </draggable> -->
			</div>
			<div class="right-box">
				<div style="width: 200px">
					<Select v-model="submitData.type">
						<Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
					<Input v-model="submitData.filterColumn" placeholder="输入搜索文本" clearable suffix="ios-search" style="margin-top: 10px" />
					<ul class="tree">
						<li
							v-for="(item, index) in dataItemList[submitData.type]"
							class="tree-father"
							:key="index"
							:class="[item.detailName === liObj.detailName ? 'tree-select' : '']"
							@click="liClick(item)"
							@dblclick="dbliClick(item)"
						>
							<div>
								{{ item.detailName }}
							</div>
						</li>
					</ul>
				</div>
				<div class="right-remark">
					<template v-for="item in liObj.remark">
						<p style="margin-bottom: 10px">{{ item }}</p>
					</template>
				</div>
			</div>
		</div>

		<div slot="footer" class="dialog-footer">
			<Button @click="cancelClick">取 消</Button>
			<Button @click="checkRules">校验语法</Button>
			<Button type="primary" @click="submitClick">确定 </Button>
		</div>
	</Modal>
</template>
<script>
import { getlistReq as getDataItemReq, getlisttreeReq } from "@/api/system-manager/data-item";
import { addCustomerFieldReq, getCustomerFieldReq, modifyCustomerFieldReq, checkCustomerFieldReq } from "@/api/bill-design-manage/workbook-manage.js";
import { inputSelectContent } from "@/libs/tools";
import draggable from "vuedraggable";

export default {
	name: "create-fields",
	components: { draggable },
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
				this.getDataItemData();
				this.pageLoad();

				this.$nextTick(() => {
					//光标聚焦
					inputSelectContent(this.$refs.fieldFunction);
				});
			}
		},
	},
	data() {
		return {
			submitData: {},
			tipObj: { code: "", message: "", result: "" },
			modelFlag: false,
			dataItemList: { all: [] },
			blurIndex: 0,
			liObj: {}, //li 标签点击选中值
			typeList: [
				{
					value: "all",
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
					value: "changeType",
					label: "类型转换",
				},
				{
					value: "logic",
					label: "逻辑",
				},
				{
					value: "syndication",
					label: "聚合",
				},
			],
		};
	},
	methods: {
		//获取自定义字段信息
		pageLoad() {
			const { nodeId } = this.submitData;
			getCustomerFieldReq({ id: nodeId }).then((res) => {
				if (res.code == 200) {
					this.submitData = { ...this.submitData, ...res.result };
				}
			});
		},
		//校验语法
		checkRules() {
			checkCustomerFieldReq({ ...this.submitData }).then((res) => {
				const { code, message, result } = res;
				this.tipObj = { code, message, result };
			});
		},

		//li 标签选中事件
		liClick(row) {
			this.liObj = { ...row, remark: row.remark.split("\n\n") };
		},
		//li 标签 双击
		dbliClick(row) {
			this.insertAtCursor(`${row.detailName}()`);
		},
		//插入数据至光标处
		async insertAtCursor(myValue) {
			const myField = this.$refs.fieldFunction.$el.children[0];

			if (myField.selectionStart || myField.selectionStart === 0) {
				let startPos = myField.selectionStart; //开始位置
				let endPos = myField.selectionEnd; //结束位置
				let selectionPos = endPos + myValue.length - 1; //光标选中位置

				const fieldFunction = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
				this.submitData = { ...this.submitData, fieldFunction };

				await this.$nextTick(); // 这句是重点, 圈起来,不加的话后面两步有问题
				myField.focus();
				myField.setSelectionRange(selectionPos, selectionPos);
			} else {
				this.submitData = { ...this.submitData, fieldFunction: (this.submitData.fieldFunction += myValue) };
			}
		},

		//提交
		submitClick() {
			const { fieldFunction, labelName, datasetId, columnName, id } = this.submitData;
			const obj = { fieldFunction, labelName, datasetId, fieldCode: columnName, id, remark: 2 };
			const requestApi = this.isAdd ? addCustomerFieldReq(obj) : modifyCustomerFieldReq(obj);
			requestApi.then((res) => {
				if (res.code === 200) {
					this.$Msg.success("提交成功！");
					this.cancelClick(); //关闭弹框
					this.$emit("getColumnList");
				} else {
					this.$Msg.error(`提交失败！,${res.message}`);
				}
			});
		},
		//关闭弹框
		cancelClick() {
			this.modelFlag = false;
			this.tipObj = { code: "", message: "", result: "" };
		},

		// 获取业务数据
		async getDataItemData() {
			this.dataItemList = { all: [] };
			await getlisttreeReq({ id: "", parentId: "0", itemCode: "", itemName: "", enabled: -1 }).then((res) => {
				if (res.code === 200) {
					res.result.forEach((item) => {
						if (item.itemCode === "reportDesign") {
							item?.children.forEach((citem) => {
								if (citem.itemCode === "workbookCustomFields") {
									citem?.children.forEach((ccitem) => {
										const { itemCode, itemName } = ccitem;
										this.getDataItemDetailList(itemCode, itemName);
									});
								}
							});
						}
					});
				}
			});
		},

		// 获取数据字典数据
		async getDataItemDetailList(itemCode, itemName) {
			let arr = [];
			await getDataItemReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) {
					this.dataItemList[itemCode] = res.result || [];
					if (res?.result) this.dataItemList.all.push(...res.result);
				}
			});
			return arr;
		},
	},
};
</script>

<style lang="less" scoped>
/deep/textarea.ivu-input {
	background: #000;
	color: #fff;
}
.create-field {
	display: flex;
	height: 500px;
	.left-box {
		width: 1000px;
		padding: 10px;
	}
	.right-box {
		display: flex;
		flex: 1;
		background-color: #eeeeee;
		padding: 10px;
		border-radius: 10px;
		.tree {
			height: calc(100% - 60px);
			background: #fff;
			overflow: auto;
			li {
				list-style: none;
				cursor: pointer;
			}
			.tree-father {
				padding: 5px;
				font-weight: bold;
			}
			.tree-select {
				background-color: #e6e6e6;
			}
		}
		.right-remark {
			width: calc(100% - 200px);
			padding: 10px;
			p {
				&:first-child {
					font-weight: bold;
				}
			}
		}
	}
}
.ivu-modal-footer .ivu-btn:nth-child(2) {
	padding: 5px 16px;
	color: #27ce88;
	border: 1px solid #27ce88;
	border-radius: 0;
}
</style>
