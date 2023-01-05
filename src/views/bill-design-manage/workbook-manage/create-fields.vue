/**创建计算字段 */
<template>
	<!-- 函数管理 -->
	<Modal title="创建计算字段" v-model="modelFlag" width="1500">
		<div class="create-field">
			<div class="left-box">
				<Input type="text" v-model="selectObj.columnName" clearabled />
				<Input
					v-model="selectObj.fieldFunction"
					type="textarea"
					style="margin-top: 10px"
					:autosize="{ minRows: 20, maxRows: 20 }"
					@on-focus="setCaret"
					@on-blur="setCaret"
					@on-keyup="setCaret"
				/>
			</div>
			<div class="right-box">
				<div style="width: 200px">
					<Select v-model="selectObj.type">
						<Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
					<Input v-model="selectObj.filterColumn" placeholder="输入搜索文本" clearable suffix="ios-search" />
					<ul class="tree">
						<li
							v-for="(item, index) in dataItemList[selectObj.type]"
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
			<Button @click="outerVisible = false">取 消</Button>
			<Button type="primary" @click="submitClick">确定 </Button>
		</div>
	</Modal>
</template>
<script>
import { getlistReq as getDataItemReq, getlisttreeReq } from "@/api/system-manager/data-item";
import { addCustomerFieldReq, getCustomerFieldReq, modifyCustomerFieldReq } from "@/api/bill-design-manage/workbook-manage.js";

export default {
	name: "create-fields",
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
				this.getDataItemData();
				this.pageLoad(); //
			}
		},
	},
	data() {
		return {
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
			const { nodeId } = this.selectObj;
			getCustomerFieldReq({ id: nodeId }).then((res) => {
				if (res.code == 200) {
					this.selectObj = { ...this.selectObj, ...res.result };
				}
			});
		},
		//li 标签选中事件
		liClick(row) {
			this.liObj = { ...row, remark: row.remark.split("\n\n") };
			console.log(this.liObj);
		},
		//li 标签 双击
		dbliClick(row) {
			let index = this.blurIndex;
			let str = this.selectObj?.fieldFunction || "";
			this.selectObj.fieldFunction = str.slice(0, index) + `${row.detailName}()` + str.slice(index);
			console.log("this.selectObj", this.selectObj, row);
		},
		//获取光标位置
		setCaret(e) {
			this.blurIndex = e.srcElement.selectionStart;
			console.log("光标位置", this.blurIndex);
			// console.log(e);
			// console.log(e.srcElement);
			// console.log(e.srcElement.selectionStart); //光标所在的位置
		},
		//提交
		submitClick() {
			const { fieldFunction, tableName, datasetId, columnName, id } = this.selectObj;
			const obj = { fieldFunction, tableName, datasetCode: datasetId, fieldCode: columnName, id, remark: 2 };
			const requestApi = this.isAdd ? addCustomerFieldReq(obj) : modifyCustomerFieldReq(obj);
			requestApi.then((res) => {
				if (res.code === 200) {
					this.$Message.success("提交成功！");
					this.modelFlag = false;
					this.$emit("getColumnList");
				} else {
					this.$Message.error("提交失败！", res.message);
				}
			});
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
									console.log(citem.itemCode);
									citem?.children.forEach((ccitem) => {
										const { itemCode, itemName } = ccitem;
										this.getDataItemDetailList(itemCode, itemName);
									});
								}
							});
						}
					});
					// this.fieldType = this.$XEUtiles.groupBy(this.dataItemList, "itemCode");
					// this.dataItemList.forEach((item) => {
					// 	console.log(item);
					// });
					//  this.fieldType['all'] = this.dataItemList.
					console.log(this.dataItemList, this.fieldType);
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
		padding: 5px 0 10px 10px;
		.tree {
			height: calc(100% - 50px);
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
</style>
