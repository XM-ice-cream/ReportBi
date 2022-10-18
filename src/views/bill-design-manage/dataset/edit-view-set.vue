<template>
	<div>
		<Modal :title="dialogFormVisibleTitle" :mask-closable="false" :closable="true" v-model="visib" fullscreen :before-close="closeDialog">
			<Form ref="form" :model="formData" :rules="ruleValidate" :label-width="130" style="height: 100%">
				<Row :gutter="10">
					<Col :xs="24" :sm="20" :md="8" :lg="8" :xl="8">
						<FormItem label="数据源" prop="sourceCode">
							<Select v-model.trim="formData.sourceCode" class="organisation" size="small">
								<Option v-for="item in sourceList" :key="item.sourceName" :label="item.sourceName" :value="item.sourceCode" />
							</Select>
						</FormItem>
					</Col>
					<Col :xs="24" :sm="20" :md="7" :lg="7" :xl="7">
						<FormItem label="数据集编码" prop="setCode">
							<Input :disabled="updataDisabled" v-model.trim="formData.setCode" placeholder="唯一标识" size="small" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="20" :md="7" :lg="7" :xl="7">
						<FormItem label="数据集名称" prop="setName">
							<Input v-model.trim="formData.setName" size="small" />
						</FormItem>
					</Col>
					<Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22">
						<FormItem label="数据集描述">
							<Input v-model.trim="formData.setDesc" size="small" />
						</FormItem>
					</Col>
				</Row>
				<Row v-if="this.setType == 'sql'" :gutter="10">
					<Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22" class="code-mirror-form">
						<FormItem label="查询SQL">
							<div class="codemirror">
								<monaco-editor v-model.trim="formData.dynSentence" language="sql" v-if="visib" />
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row v-if="this.setType == 'http'">
					<Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22">
						<FormItem label="请求体">
							<Input type="text" v-model.trim="formData.dynSentence" />
						</FormItem>
					</Col>
				</Row>
				<!-- 是否有效 -->
				<Row>
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 是否有效 -->
						<FormItem :label="$t('enabled')" prop="enabled">
							<i-switch size="large" v-model="formData.enabled" :true-value="1" :false-value="0">
								<span slot="open">{{ $t("open") }}</span>
								<span slot="close">{{ $t("close") }}</span>
							</i-switch>
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="10">
					<Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22">
						<Form :label-width="100" class="demo-ruleForm">
							<Tabs v-model.trim="tabsActiveName" type="card" @on-click="handleClickTabs">
								<TabPane label="查询参数" name="first">
									<Button type="primary" v-if="tableData.length == 0" size="small" @click="addRow(-1)">添加 </Button>
									<Table :data="tableData" border :columns="columns" :max-height="350" style="width: 100%">
										<!-- 参数名 -->
										<template slot-scope="{ index }" slot="paramName">
											<Input v-model.trim="tableData[index].paramName" clearable />
										</template>
										<!-- 描述 -->
										<template slot-scope="{ index }" slot="paramDesc">
											<Input v-model.trim="tableData[index].paramDesc" clearable />
										</template>
										<!-- 数据类型 -->
										<template slot-scope="{ index }" slot="paramType">
											<Select v-model.trim="tableData[index].paramType" clearable transfer @on-change="changeParamAstrict(index)">
												<Option v-for="item in paramTypeList" :key="item.sourceName" :label="item.sourceName" :value="item.sourceCode" />
											</Select>
										</template>
										<!-- 数据限制-->
										<template slot-scope="{ index }" slot="paramAstrict">
											<!-- 数据类型为 下拉框 -->
											<v-selectpage
												class="select-page-style"
												v-if="tableData[index].paramType == 'Select'"
												key-field="setCode"
												placeholder="请选择对应数据集"
												show-field="setName"
												:data="setCodePageListUrl"
												v-model="tableData[index].paramAstrict"
												:result-format="
													(res) => {
														return {
															totalRow: res.total,
															list: res.data || [],
														};
													}
												"
											>
											</v-selectpage>
											<!-- 时间 限制长度 -->
											<InputNumber v-model.trim="tableData[index].paramAstrict" v-if="tableData[index].paramType == 'DateTime'" placeholder="请输入最长的时间差（天）" clearable />
											<!-- 数组 限制长度 -->
											<InputNumber v-model.trim="tableData[index].paramAstrict" v-if="tableData[index].paramType == 'Array'" placeholder="请输入数组的最大长度" clearable />
										</template>
										<!-- 示例值 -->
										<template slot-scope="{ index }" slot="sampleItem">
											<!-- 时间 -->
											<DatePicker v-if="tableData[index].paramType == 'DateTime'" v-model.trim="tableData[index].sampleItem" transfer type="datetime" clearable format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"></DatePicker>
											<!-- 数组为文本框 -->
											<Input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" v-else-if="tableData[index].paramType == 'Array'" v-model.trim="tableData[index].sampleItem" clearable></Input>
											<!-- 数据类型为 下拉框 -->
											<v-selectpage
												class="select-page-style"
												v-model="tableData[index].sampleItem"
												transfer
												v-else-if="tableData[index].paramType == 'Select' && tableData[index].paramAstrict"
												:params="{ setCode: tableData[index].paramAstrict }"
												key-field="value"
												show-field="value"
												:data="getValueBySetcodePageListUrl"
												:result-format="
													(res) => {
														return {
															totalRow: res.total,
															list: res.data || [],
														};
													}
												"
											>
											</v-selectpage>
											<Input v-model.trim="tableData[index].sampleItem" v-else clearable />
										</template>
										<!-- 校验 -->
										<template slot-scope="{ row, index }" slot="mandatory">
											<Checkbox v-model="tableData[index].mandatory" @on-change="Mandatory(index)">必选 </Checkbox>
											<!-- <Button type="primary" icon="el-icon-plus" @click="permissionClick(row, index)"> 高级规则</Button> -->
										</template>
										<!-- 操作 -->
										<template slot-scope="{ row, index }" slot="operator">
											<Button type="text" size="small" @click.native.prevent="cutOutRow(index, tableData)">删除</Button>
											<Button type="text" size="small" @click="addRow(index, row)">追加</Button>
										</template>
									</Table>
								</TabPane>
								<TabPane label="测试预览" name="third">
									<div style="overflow: auto">
										<vue-json-editor v-model="cols" :show-btns="false" :mode="'code'" lang="zh" />
									</div>
								</TabPane>
							</Tabs>
						</Form>
					</Col>
				</Row>
			</Form>
			<div slot="footer" class="dialog-footer">
				<Button @click="closeDialog">取消</Button>
				<Button type="primary" @click="submit('form')">保存</Button>
				<Button type="primary" @click="submit('form', true)">保存并跳转至报表设计管理</Button>
			</div>
		</Modal>
		<Modal :title="title" v-model="dialogPermissionVisible" :mask-closable="false" :closable="true" width="60%">
			<div class="codemirror">
				<!-- //自定义高级规则？ -->
				<monaco-editor v-model.trim="validationRules" language="javascript" style="height: 500px" v-if="dialogPermissionVisible" />
			</div>
			<span slot="footer" class="dialog-footer">
				<Button @click="testResultset">测试</Button>
				<Button type="primary" @click="dialogValidationRules">保存</Button>
				<Button @click="dialogPermissionVisible = false">关闭</Button>
			</span>
		</Modal>
	</div>
</template>
<script>
import { getAllDatasourceReq, testTransformSet, insertDatacollectReq, modifyDatacollectReq, getDeatilByIdReq, setCodePageListUrl, getValueBySetcodePageListUrl } from "@/api/bill-design-manage/data-set.js";
import Dictionary from "@/components/dictionary/index";
import MonacoEditor from "@/components/monaco-editor/monaco-editor.vue";
import vueJsonEditor from "vue-json-editor";
import { validateEngOrNum } from "@/libs/validate";
import { formatDate } from "@/libs/tools";
export default {
	name: "Support",
	components: { Dictionary, vueJsonEditor, MonacoEditor },
	props: {
		visib: {
			required: true,
			type: Boolean,
			default: false,
		},
		dataSet: {
			required: false,
			type: Object,
			default: () => {
				return "";
			},
		},
	},
	data() {
		return {
			formData: {},
			// 弹框默认隐藏
			dialogFormVisible: false,
			dialogFormVisibleTitle: "",
			dialogPermissionVisible: false,
			dialogSwitchVisible: false,
			setCodePageListUrl: setCodePageListUrl(), //获取索引数据集
			getValueBySetcodePageListUrl: getValueBySetcodePageListUrl(), //对应数据集第一个字段的值
			title: "自定义高级规则",
			ruleValidate: {
				setName: [
					{ required: true, message: "数据集名称必填", trigger: "blur" },
					//   { validator:validateChinese,trigger:"change"}
				],
				setCode: [
					{ required: true, message: "数据集编码必填", trigger: "change" },
					{ validator: validateEngOrNum, trigger: "change" },
				],
				sourceCode: [{ required: true, message: "数据源必选", trigger: "change" }],
			},
			sourceList: [],
			validationRules: "",
			tabsActiveName: "first",
			cols: [],
			tableData: [
				{
					paramName: "",
					paramDesc: "",
					paramType: "",
					sampleItem: "",
					mandatory: true,
					requiredFlag: 1,
					validationRules: `function verification(data){\n\t//自定义脚本内容\n\t//可返回true/false单纯校验键入的data正确性\n\t//可返回文本，实时替换,比如当前时间等\n\t//return "2099-01-01 00:00:00";\n\treturn true;\n}`,
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
				},
				{
					title: "描述",
					slot: "paramDesc",
				},
				{
					title: "数据类型",
					slot: "paramType",
				},
				{
					title: "数据限制",
					slot: "paramAstrict",
				},
				{
					title: "示例值",
					slot: "sampleItem",
				},
				{
					title: "校验",
					slot: "mandatory",
				},
				{
					title: "操作",
					slot: "operator",
					width: "80",
				},
			],
			isRowData: {},
			updataDisabled: false,
			testMassageCode: null,
			setType: "", //数据集类型，主要用于区分http   addSql  addHttp  edit
			//待删除
			dictionaryOptions: [], // 数据源类型
			paramTypeList: [
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
			isAdd: true,
		};
	},
	methods: {
		// 编辑数据集,获取单条数据详情
		addOrEditDataSet(row, type, isAdd) {
			this.setType = type;
			this.isAdd = isAdd;
			//   if (type == "http" && row.dynSentence) {
			//     this.httpForm = JSON.parse(row.dynSentence);
			//   }
			//获取数据源下拉
			this.getDataSourceList(type);
			this.dialogFormVisible = true;
			this.tabsActiveName = "first";
			this.testMassageCode = null;
			!isAdd ? this.refeshEdit(row) : this.refeshAdd();
		},
		//编辑
		refeshEdit(row) {
			this.updataDisabled = true;
			this.dialogFormVisibleTitle = "编辑数据集";
			this.tableData = [];
			const obj = { setCode: row.setCode };
			getDeatilByIdReq(obj).then((res) => {
				this.formData = res.result;
				if (res.result.dataSetParamDtoList != null || res.result.dataSetParamDtoList.length > 0) {
					this.tableData = res.result.dataSetParamDtoList;
					this.tableData.find((value, i) => {
						this.tableData[i].mandatory = value.requiredFlag == 1 ? true : false;
					});
				}
			});
		},

		//新增
		refeshAdd() {
			this.dialogFormVisibleTitle = "新增数据集";
			this.updataDisabled = false;
			this.tableData = [];
			this.formData = {
				setName: "",
				setCode: "",
				setDesc: "",
				sourceCode: "",
				dynSentence: "",
				enabled: 1,
			};
		},
		//获取数据源下拉框
		getDataSourceList(type) {
			const obj = { sourceType: type };
			getAllDatasourceReq(obj).then((res) => {
				const { code, result } = res;
				if (code !== 200) return;
				this.sourceList = result;
			});
		},
		// 关闭模态框
		closeDialog() {
			this.$emit("update:visib", false);
		},

		// 测试预览
		async handleClickTabs(tab) {
			//   if (this.setType == "http") {
			//     //针对http数据源
			//     this.formData.dynSentence = JSON.stringify(this.httpForm);
			//   }
			if (tab == "third") {
				this.cols = [];
				this.$refs.form.validate(async (valid) => {
					if (valid) {
						let params = {
							sourceCode: this.formData.sourceCode,
							dynSentence: this.formData.dynSentence,
							dataSetParamDtoList: this.tableData,
							dataSetTransformDtoList: [],
							setType: this.setType,
							setDesc: this.formData.setDesc,
						};
						params.dataSetParamDtoList = params.dataSetParamDtoList.map((item) => {
							if (item.paramType == "DateTime") {
								item.sampleItem = formatDate(item.sampleItem);
							}
							return { ...item };
						});
						const { code, message } = await testTransformSet(params);
						if (code != 200) {
							this.$Message.error(message);
							return;
						}
						this.cols = JSON.parse(message);
						this.testMassageCode = code;
					}
				});
			}
		},

		// --查询参数-----------------///////////////////////////////////////////////////////////////////////
		permissionClick(row) {
			this.title = "自定义高级规则";
			if (this.isRowData.sampleItem != "") {
				this.isRowData = row;
				const fnCont = `function verification(data){\n\t//自定义脚本内容\n\t//可返回true/false单纯校验键入的data正确性\n\t//可返回文本，实时替换,比如当前时间等\n\t//return "2099-01-01 00:00:00";\n\treturn true;\n}`;
				this.validationRules = row.validationRules ? row.validationRules : fnCont;
			}
			this.$nextTick(() => {
				this.dialogPermissionVisible = true;
			});
		},
		dialogValidationRules() {
			this.isRowData.validationRules = this.validationRules;
			this.dialogPermissionVisible = false;
		},
		// 自定义高级规则
		async testResultset() {
			this.isRowData.validationRules = this.validationRules;
			//   const { code, message, data } = await verificationSet(this.isRowData);
			//   if (code == "200") {
			//     if (data) {
			//       this.$message.success("返回结果：" + data);
			//     } else {
			//       this.$message.warning("当前示例值校验不通过");
			//     }
			//   } else {
			//     this.$message.error(message);
			//   }
		},
		// 删除
		cutOutRow(index, rows) {
			rows.splice(index, 1);
		},
		// 必选
		Mandatory(val) {
			this.tableData[val].requiredFlag = !this.tableData[val].mandatory ? 0 : 1;
		},
		//改变数据限制默认值
		changeParamAstrict(index) {
			this.tableData[index].paramAstrict = "";
			this.tableData[index].sampleItem = "";
		},
		// 追加
		addRow(index) {
			const obj = {
				paramName: "",
				paramDesc: "",
				paramType: "",
				sampleItem: "",
				paramAstrict: "",
				mandatory: true,
				requiredFlag: 1,
				validationRules: `function verification(data){\n\t//自定义脚本内容\n\t//可返回true/false单纯校验键入的data正确性\n\t//可返回文本，实时替换,比如当前时间等\n\t//return "2099-01-01 00:00:00";\n\treturn true;\n}`,
			};
			this.tableData.splice(index + 1, 0, obj);
		},
		async submit(formName, isSkip = false) {
			this.formData.setType = this.setType;
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					if (this.testMassageCode == 200) {
						this.formData.dataSetParamDtoList = this.tableData.map((item) => {
							if (item.paramType == "DateTime") {
								item.sampleItem = formatDate(item.sampleItem);
							}
							return { ...item };
						});
						this.formData.dataSetTransformDtoList = this.itemFilterList;
						this.formData.caseResult = JSON.stringify(this.cols);
						const requestApi = this.isAdd ? insertDatacollectReq : modifyDatacollectReq;
						const { code, message } = await requestApi(this.formData);
						if (code != 200) {
							this.$Message.error(message);
							return;
						}
						this.$Message.success("提交成功！");
						if (isSkip) {
							this.$router.push({ name: "design-report-manage", query: { setCode: this.formData.setCode } });
						}
						this.$emit("refreshList");
						this.closeDialog();
					} else {
						this.$Message.error("请先测试预览，操作成功后便可保存！");
						return;
					}
				}
			});
		},
	},
};
</script>
<style lang="less" scoped>
.code-mirror-form {
	/deep/ .FormItem__content {
		height: 200px;
		overflow: hidden;
	}
}

.my-editor {
	height: 400px;

	div.jsoneditor {
		height: 400px !important;
	}
}

.title {
	width: 100%;
	display: inline-block;
	text-align: left;
}

.addSwitch {
	ul {
		list-style: none;
		margin: 0px;

		li {
			width: 200px;
			height: 60px;
			padding: 10px;
			border: 1px solid #aaa;
			float: left;
			margin-right: 10px;
			text-align: center;
			line-height: 40px;
			cursor: pointer;

			&.add,
			&:hover {
				border: 1px solid #3385ff;
				color: #3385ff;
			}
		}
	}
}

.filterWrapper {
	position: relative;
}

.filterTable {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	padding: 5px 15px 25px 15px;
}

.filterWrapper .addFilter {
	cursor: pointer;
	width: 150px;
	height: 50px;
	border-radius: 3px;
	border: 1px solid #67c23a;
	margin-top: 20px;
	background: #e4f7da;
	padding-left: 24px;
}

.filterWrapper .addFilter i {
	font-size: 20px;
	color: #67c23a;
	margin-top: 16px;
	margin-left: 16px;
}

.filterWrapper .addFilter span {
	color: #67c23a;
	margin-left: 5px;
	font-size: 18px;
}

.filterBox {
	width: 182px;
	position: relative;
	margin-top: 20px;
	display: flex;
	flex-direction: row;
}

.filterBox .box {
	width: 150px;
	height: 50px;
	text-align: center;
	position: relative;
	background: #e0e8ff;
	border-radius: 3px;
	border: 1px solid #b8caff;
	float: left;
	padding: 5px 20px;
}

.filterBox .box .reduceFilter {
	width: 10px;
	height: 10px;
	position: absolute;
	right: 4px;
	top: 4px;
	cursor: pointer;
}

.filterBox .box .editor {
	width: 12px;
	height: 13px;
	position: absolute;
	left: -5px;
	top: 5px;
	cursor: pointer;
}

.filterBox .rightIcon {
	width: 45px;
	height: 19px;
	position: absolute;
	right: 10px;
	top: 15px;
}

.filterTextarea /deep/ .el-textarea__inner {
	min-height: 300px !important;
}

.filterBox .code-selected {
	width: 70%;
	margin-top: 4px;
}

.filterBox /deep/ .Input--suffix .Input__inner {
	background: #f4f7ff;
	border-radius: 3px;
	border: 1px solid #b8caff;
	color: #89a3ee;
}

.font-icon-right {
	line-height: 35px;
	font-size: 30px;
}

.popover-box {
	width: 100%;
	height: 220px;
	overflow-y: auto;
	padding: 10px;
}
</style>
