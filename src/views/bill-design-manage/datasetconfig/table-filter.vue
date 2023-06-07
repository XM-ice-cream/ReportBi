/**表的筛选 关联 */
<template>
	<!-- 数据集 -->
	<Modal :title="modalTitle" :mask-closable="false" :width="1000" :closable="true" v-model="modalFlag" :before-close="closeDialog">
		<div class="add-box" @click="addClick"><icon custom="iconfont icon-add" class="add-icon" /> 添加</div>
		<div class="modal-content">
			<Table :columns="columns" :data="data" :height="tableConfig.height" disabled-hover>
				<!-- 字段名 -->
				<template #columnname="{ row, index }">
					<Select v-model.trim="data[index].columnname" size="small" placehold="选择字段" transfer filterable @on-change="changeColumnName(index)">
						<Option v-for="(item, sourceIndex) in columnList" :value="item.columnName" :key="sourceIndex" :label="item.columnName">
							<icon custom="iconfont icon-string" v-if="item.columnType == 'String'" />
							<icon custom="iconfont icon-shuzishurukuang" v-else-if="item.columnType == 'Number'" />
							<icon custom="iconfont icon-riqishijian" v-else-if="item.columnType == 'DateTime'" />
							<icon custom="iconfont icon-wenhao" v-else />{{ item.columnName }}
						</Option>
					</Select>
				</template>
				<!-- 逻辑符号 -->
				<template #operator="{ row, index }">
					<Select v-model="data[index].operator" size="small" style="border: none" transfer>
						<Option v-for="item in operatorList" :value="item" :key="item">{{ item }}</Option>
					</Select>
				</template>
				<!-- 值 -->
				<template #value="{ row, index }">
					<Input type="text" v-model="data[index].value" clearable v-if="row.columnType !== 'DateTime' || row.operator === '<=(day)'" />
					<DatePicker
						transfer
						type="datetime"
						format="yyyy-MM-dd HH:mm:ss"
						:options="$config.datetimeOptions"
						v-model="data[index].value"
						@on-change="changeDatePicker(index)"
						v-else
					></DatePicker>
				</template>
				<!-- 操作区 -->
				<template #operarea="{ row, index }">
					<Button type="error" ghost size="small" @click="deleteClick(index, data)" custom-icon="iconfont icon-delete"></Button>
				</template>
			</Table>
		</div>
		<div slot="footer" class="dialog-footer">
			<Button @click="closeDialog">取消</Button>
			<Button type="primary" @click="submitClick">提交</Button>
		</div>
	</Modal>
</template>
<script>
import { getColumnListReq } from "@/api/bill-design-manage/data-set-config.js";
import { getlistReq } from "@/api/system-manager/data-item";
import { formatDate } from "@/libs/tools";

export default {
	name: "TableFilter",
	components: {},
	props: {
		modalFlag: {
			required: true,
			type: Boolean,
			default: false,
		},
		selectObj: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		modalFlag(newVal) {
			if (newVal) {
				this.pageLoad();
				this.autoSize();
				window.addEventListener("resize", () => this.autoSize());
				this.$nextTick(() => {
					const { condition } = this.selectObj;
					this.data = condition ? [...condition] : [];
				});
			}
		},
	},
	data() {
		return {
			tableConfig: { ...this.$config.tableConfig },
			modalTitle: "基础过滤器",
			data: [],
			columns: [
				{
					title: "字段",
					slot: "columnname",
				},
				{
					title: "运算符",
					slot: "operator",
				},
				{
					title: "值",
					slot: "value",
				},
				{
					title: "#",
					slot: "operarea",
					width: 60,
					align: "center",
				},
			],
			columnTypeList: [],
			isSameType: [],
			operatorList: ["in", "=", "<", ">", "<=", ">=", "<=(day)", ">=(datetime)", "<=(datetime)"],
			columnList: [],
			targetList: [],
		};
	},
	methods: {
		async pageLoad() {
			await this.getDataItemData(); //数据字典
			this.getFieldList();
		},
		//提交
		submitClick() {
			this.$emit("updateFilter", { ...this.selectObj, condition: this.data });
			this.closeDialog();
		},
		//获取字段 源表
		getFieldList() {
			console.log(this.selectObj);
			const { id, isCustomSql, customsql } = this.selectObj;
			let obj = {
				sourceCode: id.split(":")[0],
				tableName: id.split(":")[1].split("(")[0],
			};
			if (isCustomSql) {
				obj = {
					sourceCode: id.split(":")[0],
					tableName: customsql,
					type: "sql",
				};
			}
			getColumnListReq(obj).then((res) => {
				if (res.code == 200) {
					this.columnList =
						res?.result.map((item) => {
							const { columnType } = item;
							this.columnTypeList.forEach((columnItem) => {
								const { detailCode, detailName } = columnItem;
								if (detailCode.includes(columnType.toUpperCase())) item.columnType = detailName;
							});
							return { ...item };
						}) || [];
				}
			});
		},
		//获取字段对应的类型
		changeColumnName(index) {
			const { columnname } = this.data[index];
			const { columnType } = this.columnList.filter((item) => item.columnName === columnname)[0];
			this.data[index].columnType = columnType;
			// this.data = JSON.parse(JSON.stringify(this.data));
		},
		// 时间数据格式化
		changeDatePicker(index) {
			this.data[index].value = formatDate(this.data[index].value);
		},

		//添加字段
		addClick() {
			this.data.push({ columnname: "", operator: "=", value: "" });
		},
		//删除字段
		deleteClick(index, rows) {
			rows.splice(index, 1);
		},
		// 获取数据字典数据
		async getDataItemData() {
			this.columnTypeList = await this.getDataItemDetailList("columnType");
		},
		async getDataItemDetailList(itemCode) {
			let arr = [];
			await getlistReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight / 2 - 130;
		},
		// 关闭模态框
		closeDialog() {
			this.$emit("update:modalFlag", false);
			this.data = [];
		},
	},
};
</script>
<style></style>
<style lang="less" scoped>
.add-box {
	color: #6f6f6f;
	margin-top: 10px;
	margin-bottom: 10px;
	cursor: pointer;
	.add-icon {
		text-align: right;
		margin-right: 5px;
		border: 1px solid #6f6f6f;
		padding: 3px;
		font-size: 1px;
		border-radius: 50%;
	}
}
.ivu-select-item {
	i {
		color: #488aa5;
	}
}
:deep(.ivu-table th) {
	background-color: transparent;
}
:deep(table) {
	border: none;
}
:deep(.ivu-select-selection) {
	border: none;
	border-bottom: 1px solid #dcdee2;
}
:deep(.ivu-table th) {
	border-bottom: 1px solid #fff;
}
:deep(.ivu-table td) {
	border-bottom: 1px solid #fff;
}
:deep(table > tr > td:nth-child(1) > .ivu-select-selection) {
	border: none;
}
</style>
