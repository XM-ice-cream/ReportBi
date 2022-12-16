/**数据集配置 关联 */
<template>
	<!-- 数据集 -->
	<Modal :title="modalTitle" :mask-closable="false" :closable="true" v-model="modalFlag" :before-close="closeDialog">
		<div class="add-box"><icon custom="iconfont icon-add" class="add-icon" @click="addData" /> 添加更多字段</div>
		<div class="modal-content">
			<Table :columns="columns" :data="data" :height="tableConfig.height" disabled-hover>
				<!-- 源表 -->
				<template #source="{ row }">
					<Select v-model="row.source" size="small" placehold="选择字段">
						<template #prefix>
							<icon custom="iconfont icon-search" />
						</template>
						<Option v-for="item in sourceList" :value="item.field" :key="item">
							<icon custom="iconfont icon-string" v-if="item.type === 'string'" />
							<icon custom="iconfont icon-shuzishurukuang" v-if="item.type === 'number'" />
							<icon custom="iconfont icon-huatifuhao" v-if="item.type === 'any'" />
							<icon custom="iconfont icon-riqishijian" v-if="item.type === 'datetime'" />
							{{ item.field }}
						</Option>
					</Select>
				</template>
				<template #symbol="{ row }">
					<Select v-model="row.symbol" size="small" style="border: none">
						<Option v-for="item in symbolList" :value="item" :key="item">{{ item }}</Option>
					</Select>
				</template>
				<!-- 目标表 -->
				<template #target="{ row }">
					<Select v-model="row.target" size="small" placehold="选择字段">
						<template #prefix>
							<icon custom="iconfont icon-search" />
						</template>
						<Option v-for="item in targetList" :value="item.field" :key="item">
							<icon custom="iconfont icon-string" v-if="item.type === 'string'" />
							<icon custom="iconfont icon-shuzishurukuang" v-if="item.type === 'number'" />
							<icon custom="iconfont icon-huatifuhao" v-if="item.type === 'any'" />
							<icon custom="iconfont icon-riqishijian" v-if="item.type === 'datetime'" />
							{{ item.field }}
						</Option>
					</Select>
				</template>
			</Table>
		</div>
		<div slot="footer" class="dialog-footer">
			<Button @click="closeDialog">取消</Button>
			<Button type="primary" @click="submitClick()">提交</Button>
		</div>
	</Modal>
</template>
<script>
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
			sourceList: [
				{ type: "any", field: "BASE" },
				{ type: "string", field: "BATCHID" },
				{ type: "number", field: "BOARDNO" },
			],
			targetList: [
				{ type: "datetime", field: "Createdate" },
				{ type: "string", field: "Createuserid" },
				{ type: "number", field: "Deliverdate" },
			],
		};
	},
	methods: {
		//提交
		submitClick() {},
		//获取列
		getColumns() {
			const { source, target } = this.connectObj;
			this.columns = [
				{
					title: source,
					slot: "source",
				},
				{
					title: "",
					slot: "symbol",
				},
				{
					title: target,
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
