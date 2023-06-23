/**数据集配置 自定义sql */
<template>
	<!-- 数据集 -->
	<Modal :title="modalTitle" :mask-closable="false" :width="1000" :closable="true" v-model="modalFlag" :before-close="closeDialog">
		<Tabs class="comment" @on-click="isShow = false">
			<TabPane label="自定义SQL">
				<Form ref="submitReq" :model="submitData" :label-width="120" @submit.native.prevent>
					<!-- 自定义sql名称 -->
					<FormItem label="自定义sql名称" prop="label">
						<Input v-model="submitData.label" placeholder="请输入自定义SQL名称" />
					</FormItem>
				</Form>
				<monaco-editor v-model.trim="submitData.customsql" language="sql" v-if="visib" ref="monacoEditorRef" />
				<Button type="primary" :icon="isShow ? 'md-arrow-dropdown' : 'md-arrow-dropright'" @click="isShow = !isShow" style="margin-top: 10px"
					>插入参数</Button
				>
			</TabPane>
			<TabPane label="新增参数">
				<Button type="primary" size="small" @click="addRow(-1)">添加 </Button>
				<Table :data="parmasList" :columns="columns" :max-height="350" style="width: 100%">
					<!-- 参数名 -->
					<template slot-scope="{ index }" slot="paramName">
						<Input v-model.trim="parmasList[index].paramName" clearable />
					</template>
					<!-- 描述 -->
					<template slot-scope="{ index }" slot="paramDesc">
						<Input v-model.trim="parmasList[index].paramDesc" clearable />
					</template>
					<!-- 数据类型 -->
					<template slot-scope="{ index }" slot="paramType">
						<Select v-model.trim="parmasList[index].paramType" clearable transfer>
							<Option v-for="item in paramTypeList" :key="item.sourceName" :label="item.sourceName" :value="item.sourceCode" />
						</Select>
					</template>
					<!-- 示例值 -->
					<template slot-scope="{ index }" slot="sampleItem">
						<!-- 时间 -->
						<DatePicker
							v-if="parmasList[index].paramType == 'DateTime'"
							v-model.trim="parmasList[index].sampleItem"
							transfer
							type="datetime"
							clearable
							format="yyyy-MM-dd HH:mm:ss"
							:options="$config.datetimeOptions"
						></DatePicker>
						<!-- 数组为文本框 -->
						<Input
							type="textarea"
							:autosize="{ minRows: 2, maxRows: 5 }"
							v-else-if="parmasList[index].paramType == 'Array'"
							v-model.trim="parmasList[index].sampleItem"
							clearable
						></Input>
						<Input v-model.trim="parmasList[index].sampleItem" v-else clearable />
					</template>
					<!-- 操作 -->
					<template slot-scope="{ row, index }" slot="operator">
						<div class="operator">
							<p @click="cutOutRow(index, parmasList)">删除</p>
						</div>
					</template>
				</Table>
			</TabPane>
		</Tabs>

		<div slot="footer" class="dialog-footer">
			<Button @click="closeDialog">取消</Button>
			<Button type="primary" @click="submitClick">提交</Button>
		</div>
		<!-- 插入参数下拉框 -->
		<div class="params-list" v-if="isShow">
			<ul v-if="parmasList.length > 0">
				<li v-for="item in parmasList" @dblclick="insertParamsClick(item)">{{ item.paramName }}</li>
			</ul>
		</div>
	</Modal>
</template>
<script>
import MonacoEditor from "@/components/monaco-editor/monaco-editor.vue";
import { formatDate } from "@/libs/tools";

export default {
	name: "data-set-custom-sql",
	components: { MonacoEditor },
	props: {
		modalFlag: {
			required: true,
			type: Boolean,
			default: false,
		},
		customObj: {
			required: true,
			type: Object,
			default: () => {},
		},
		paramsTabel: {
			required: true,
			type: Array,
			default: () => [],
		},
	},
	watch: {
		modalFlag(newVal) {
			if (newVal) {
				this.submitData = { ...this.customObj };
				this.parmasList = this.paramsTabel;
				console.log("this.customObj", this.submitData, this.parmasList);
				this.$nextTick(() => {
					this.visib = true;
				});
			}
		},
	},
	data() {
		return {
			modalTitle: "自定义SQL",
			visib: false,
			isShow: false, //是否显示插入参数下拉框
			submitData: {},
			parmasList: [], //创建的参数集合
			paramTypeList: [
				//参数类型
				{
					sourceName: "字符串",
					sourceCode: "String",
				},
				{
					sourceName: "时间类型",
					sourceCode: "DateTime",
				},
				{
					sourceName: "数组",
					sourceCode: "Array",
				},
				{
					sourceName: "整型",
					sourceCode: "Int",
				},
				{
					sourceName: "浮点类型",
					sourceCode: "Double",
				},
				{
					sourceName: "布尔",
					sourceCode: "Boolean",
				},
				{
					sourceName: "下拉框",
					sourceCode: "Select",
				},
			],
			columns: [
				{
					title: "No.",
					type: "index",
					width: 30,
					align: "center",
				},
				{
					title: "参数名",
					slot: "paramName",
					align: "center",
				},
				{
					title: "数据类型",
					slot: "paramType",
					align: "center",
				},
				{
					title: "示例值",
					slot: "sampleItem",
					align: "center",
				},
				{
					title: "操作",
					slot: "operator",
					width: "80",
					align: "center",
				},
			],
		};
	},
	methods: {
		async pageLoad() {},
		//提交
		submitClick() {
			//查询参数
			let paramsData = this.parmasList.map((item) => {
				if (item.paramType == "DateTime") {
					item.sampleItem = formatDate(item.sampleItem);
				}
				return { ...item };
			});
			this.$emit("updateCustomSql", this.submitData, paramsData);
			this.closeDialog();
		},
		//插入参数
		insertParamsClick(data) {
			//获取参数光标位置
			const str = ` @${data.paramName}`;
			const strlen = str.length;
			const position = this.$refs.monacoEditorRef.getPosition();
			const newPosition = { lineNumber: position.lineNumber, column: position.column + strlen };
			this.$nextTick(() => {
				this.$refs.monacoEditorRef.insertTextPosition(position, newPosition, str);
			});
			// const str = this.submitData.sql || "";
			// const newStr = data.paramName;
			// this.submitData.sql = str.substring(0, position) + newStr + str.substring(position);
		},
		// 追加
		addRow() {
			const obj = {
				paramName: "",
				paramType: "",
				sampleItem: "",
			};
			this.parmasList.push(obj);
		},
		// 删除
		cutOutRow(index, rows) {
			rows.splice(index, 1);
		},
		// 关闭模态框
		closeDialog() {
			this.$refs.submitReq.resetFields();
			this.submitData.customsql = "";
			this.parmasList = [];
			this.$emit("update:modalFlag", false);
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
.params-list {
	position: absolute;
	width: 77px;
	max-height: 500px px;
	overflow: auto;
	background: #fff;
	/* color: #fff; */
	border: 1px solid #27ce88;
	border-radius: 0 0 5px 5px;
	margin-top: -2px;
	li {
		padding: 5px 10px;
		cursor: pointer;
		&:hover {
			background: #27ce88;
			color: #fff;
		}
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
