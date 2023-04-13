/**数据集配置 关联 */
<template>
	<!-- 数据集 -->
	<Modal :title="modalTitle" :mask-closable="false" :width="1000" :closable="true" v-model="modalFlag" :before-close="closeDialog">
		<Form :label-width="70" inline>
			<FormItem label="关联关系" prop="incidenceRelation">
				<Select v-model.trim="connectObj.incidenceRelation" size="small" placeholder="请选择关联关系" clearable style="width: 200px">
					<Option v-for="item in incidenceList" :key="item.value" :label="item.label" :value="item.value" />
				</Select>
			</FormItem>
		</Form>
		<div class="add-box" @click="addClick"><icon custom="iconfont icon-add" class="add-icon" /> 添加更多字段</div>
		<div class="modal-content">
			<Table :columns="columns" :data="data" :height="tableConfig.height" disabled-hover>
				<!-- 源表 -->
				<template #source="{ row, index }">
					<Select
						v-model.trim="data[index].sourceType"
						size="small"
						transfer
						class="field-select"
						style="width: 80px; display: inline-block"
						placeholder=""
					>
						<Option value="String"> Str. </Option>
						<Option value="Number"> Num. </Option>
						<Option value="DateTime"> Date. </Option>
					</Select>
					<Select
						v-model.trim="data[index].source"
						size="small"
						placehold="选择字段"
						transfer
						filterable
						@on-click.stop
						@on-change="changeField(index, 'source')"
						style="display: inline-block; width: calc(100% - 80px)"
					>
						<template #prefix v-if="!row.source">
							<icon custom="iconfont icon-search" />
						</template>
						<Option v-for="(item, sourceIndex) in sourceList" :value="item.columnName" :key="sourceIndex" :label="item.columnName">
							<icon custom="iconfont icon-string" v-if="item.columnType == 'String'" />
							<icon custom="iconfont icon-shuzishurukuang" v-else-if="item.columnType == 'Number'" />
							<icon custom="iconfont icon-riqishijian" v-else-if="item.columnType == 'DateTime'" />
							<icon custom="iconfont icon-wenhao" v-else />{{ item.columnName }}
						</Option>
					</Select>
				</template>
				<!-- 逻辑符号 -->
				<template #symbol="{ row, index }">
					<Select v-model="data[index].symbol" size="small" style="border: none" transfer>
						<Option v-for="item in symbolList" :value="item" :key="item">{{ item }}</Option>
					</Select>
				</template>
				<!-- 目标表 -->
				<template #target="{ row, index }">
					<Select
						v-model.trim="data[index].targetType"
						size="small"
						transfer
						class="field-select"
						style="width: 80px; display: inline-block"
						placeholder=""
					>
						<Option value="String"> Str. </Option>
						<Option value="Number"> Num. </Option>
						<Option value="DateTime"> Date. </Option>
					</Select>
					<Select
						v-model.trim="data[index].target"
						size="small"
						placehold="选择字段"
						transfer
						filterable
						@on-click.stop
						@on-change="changeField(index, 'target')"
						style="display: inline-block; width: calc(100% - 80px)"
					>
						<template #prefix v-if="!row.target">
							<icon custom="iconfont icon-search" />
						</template>
						<Option v-for="(item, targetIndex) in targetList" :value="item.columnName" :key="targetIndex" :label="item.columnName">
							<icon custom="iconfont icon-string" v-if="item.columnType == 'String'" />
							<icon custom="iconfont icon-shuzishurukuang" v-else-if="item.columnType == 'Number'" />
							<icon custom="iconfont icon-riqishijian" v-else-if="item.columnType == 'DateTime'" />
							<icon custom="iconfont icon-wenhao" v-else />{{ item.columnName }}
						</Option>
					</Select>
				</template>
				<!-- 操作 -->
				<template #operator="{ row, index }">
					<Button type="error" ghost size="small" @click="deleteClick(index, data)" custom-icon="iconfont icon-delete"></Button>
					<!-- <Button type="primary" size="small" shape="circle" icon="iconfont icon-delete" @click.native.prevent="deleteClick(index, data)"></Button> -->
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
				this.pageLoad();
				this.getColumns();
				this.autoSize();
				window.addEventListener("resize", () => this.autoSize());
				this.$nextTick(() => {
					const { relations } = this.connectObj;
					this.data = relations ? [...relations] : [];
				});
			}
		},
	},
	data() {
		return {
			tableConfig: { ...this.$config.tableConfig },
			modalTitle: "编辑关系",
			data: [],
			columns: [],
			columnTypeList: [],
			isSameType: [],
			symbolList: ["=", "<>", "<", "<=", ">", ">="],
			sourceList: [],
			targetList: [],
			incidenceList: [
				{ label: "左连接", value: "left join" },
				{ label: "右连接", value: "right join" },
				{ label: "内连接", value: "inner join" },
			],
		};
	},
	methods: {
		async pageLoad() {
			await this.getDataItemData(); //数据字典
			this.getSourceFieldList();
			this.getTargetFieldList();
		},
		//提交
		submitClick() {
			//判断数据类型是否都相同
			const isSamType = this.data.every((item) => item.sourceType === item.targetType);
			if (isSamType) {
				this.$emit("updateEdge", { ...this.connectObj, relations: this.data });
				this.closeDialog();
			} else {
				this.$Msg.error("关联字段类型不一致，请核验~");
			}
		},
		//获取字段 源表
		getSourceFieldList() {
			const { source } = this.connectObj;
			const sourceObj = {
				sourceCode: source.split(":")[0],
				tableName: source.split(":")[1].split("(")[0],
			};
			getColumnListReq(sourceObj).then((res) => {
				if (res.code == 200) {
					this.sourceList =
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
		//获取字段 源表
		getTargetFieldList() {
			const { target } = this.connectObj;
			const targetObj = {
				sourceCode: target.split(":")[0],
				tableName: target.split(":")[1].split("(")[0],
			};
			getColumnListReq(targetObj).then((res) => {
				if (res.code == 200) {
					this.targetList =
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
				{
					title: "#",
					slot: "operator",
					width: 60,
					align: "center",
				},
			];
		},

		//修改按钮
		changeRadioGroup(data, index, type) {
			this.data[index][type] = data;
		},
		//添加字段
		addClick() {
			this.data.push({ source: "", symbol: "=", target: "" });
		},
		//删除字段
		deleteClick(index, rows) {
			rows.splice(index, 1);
		},
		//修改关联字段
		async changeField(index, type) {
			const { target, source } = this.data[index];
			//目标值
			if (type == "target") {
				const targetCurType = this.targetList.filter((item) => item.columnName === target)[0].columnType;
				this.data[index].targetType = targetCurType;
				this.data[index].targetCurType = targetCurType;
			}
			//源值
			if (type == "source") {
				const sourceCurType = this.sourceList.filter((item) => item.columnName === source)[0].columnType;
				this.data[index].sourceType = sourceCurType;
				this.data[index].sourceCurType = sourceCurType;
			}
			//选中原值、目标值判断类型
			if (target && source) {
				const { sourceType, targetType } = this.data[index];
				if (sourceType !== targetType) {
					this.$Msg.error("两个字段类型不一致,不可保存");
					return;
				}
			}
			this.data = JSON.parse(JSON.stringify(this.data));
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
<style>
.field-select .ivu-select-arrow {
	visibility: hidden;
}
.field-select .ivu-select-selected-value {
	text-align: center;
	background: #00374421;
	margin-bottom: 6px;
	border-radius: 3px;
	color: #000;
	padding-right: 12px !important;
	/* width: 55px; */
	border: 1px solid #3b2c2c1a;
}
</style>
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
