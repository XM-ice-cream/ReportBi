/**数据集配置 关联 */
<template>
	<!-- 数据集 -->
	<Modal :title="modalTitle" :mask-closable="false" :closable="true" v-model="modalFlag" :before-close="closeDialog">
		<div class="add-box"><icon custom="iconfont icon-add" class="add-icon" @click="addData" /> 添加更多字段</div>
		<div class="modal-content">
			<Table :columns="columns" :data="data" :height="tableConfig.height" disabled-hover>
				<!-- 源表 -->
				<template #source="{ row, index }">
					<Select v-model="data[index].source" size="small" placehold="选择字段" transfer>
						<template #prefix v-if="!row.source">
							<icon custom="iconfont icon-search" />
						</template>
						<Option v-for="(item, index) in sourceList" :value="item.columnName" :key="index">
							<icon custom="iconfont icon-string" v-if="item.columnType === 'VARCHAR2'" />
							<icon custom="iconfont icon-shuzishurukuang" v-if="item.columnType === 'NUMBER'" />
							<icon custom="iconfont icon-huatifuhao" v-if="item.columnType === 'any'" />
							<icon custom="iconfont icon-riqishijian" v-if="item.columnType === 'datetime'" />
							{{ item.columnName }}
						</Option>
					</Select>
				</template>
				<template #symbol="{ row, index }">
					<Select v-model="data[index].symbol" size="small" style="border: none" transfer>
						<Option v-for="item in symbolList" :value="item" :key="item">{{ item }}</Option>
					</Select>
				</template>
				<!-- 目标表 -->
				<template #target="{ row, index }">
					<Select v-model="data[index].target" size="small" placehold="选择字段" transfer>
						<template #prefix v-if="!row.target">
							<icon custom="iconfont icon-search" />
						</template>
						<Option v-for="(item, index) in targetList" :value="item.columnName" :key="index">
							<icon custom="iconfont icon-string" v-if="item.columnType === 'VARCHAR2'" />
							<icon custom="iconfont icon-shuzishurukuang" v-if="item.columnType === 'NUMBER'" />
							<icon custom="iconfont icon-huatifuhao" v-if="item.columnType === 'any'" />
							<icon custom="iconfont icon-riqishijian" v-if="item.columnType === 'datetime'" />
							{{ item.columnName }}
						</Option>
					</Select>
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

export default {
	name: "DataSetConfigConnecttable",
	components: {},
	props: {
		modalFlag: {
			required: true,
			type: Boolean,
			default: false,
		},
		connectObj: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		modalFlag(newVal) {
			if (newVal) {
				this.getSourceFieldList();
				this.getTargetFieldList();
				this.getColumns();
				this.autoSize();
				window.addEventListener("resize", () => this.autoSize());
			}
		},
	},
	data() {
		return {
			tableConfig: { ...this.$config.tableConfig },
			modalTitle: "编辑关系",
			data: [],
			columns: [],
			symbolList: ["=", "<>", "<", "<=", ">", ">="],
			sourceList: [],
			targetList: [],
		};
	},
	methods: {
		//提交
		submitClick() {
			console.log("提交");
			this.$emit("updateEdge", { ...this.connectObj, relations: this.data });
			this.closeDialog();
		},
		//获取字段 源表
		getSourceFieldList() {
			const { source } = this.connectObj;
			const sourceObj = {
				sourceCode: source.split(":")[0],
				tableName: source.split(":")[1],
			};
			getColumnListReq(sourceObj).then((res) => {
				if (res.code == 200) {
					this.sourceList = res?.result || [];
				}
			});
		},
		//获取字段 源表
		getTargetFieldList() {
			const { target } = this.connectObj;
			const targetObj = {
				sourceCode: target.split(":")[0],
				tableName: target.split(":")[1],
			};
			getColumnListReq(targetObj).then((res) => {
				if (res.code == 200) {
					this.targetList = res?.result || [];
				}
			});
		},
		//获取列
		getColumns() {
			const { source, target } = this.connectObj;
			this.columns = [
				{
					title: source.split(":")[1],
					slot: "source",
				},
				{
					title: "",
					slot: "symbol",
				},
				{
					title: target.split(":")[1],
					slot: "target",
				},
			];
		},
		//添加字段
		addData() {
			this.data.push({ source: "", symbol: "=", target: "" });
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
<style lang="less" scoped>
.add-box {
	color: #6f6f6f;
	margin-bottom: 10px;
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
