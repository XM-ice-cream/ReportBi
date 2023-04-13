<template>
	<div>
		<Modal :title="modalTitle" :mask-closable="false" :closable="true" v-model="dialogFormVisible" fullscreen :before-close="closeDialog">
			<Form ref="form" :model="formData" :rules="ruleValidate" :label-width="130" style="height: 100%">
				<Row :gutter="10">
					<!-- 模板名称 -->
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem label="channelName" prop="channelName">
							<Input
								v-model.trim="formData.channelName"
								size="small"
								clearable
								placeholder="示例:Molding-LE2-SIP-Molding Shift & Warpage_MoldingShiftP2-X1"
							/>
						</FormItem>
					</Col>
					<!-- 模板参数 -->
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem label="channelParameter" prop="channelParameter">
							<Input v-model.trim="formData.channelParameter" size="small" clearable placeholder="示例:MoldingShiftP2-X1" />
						</FormItem>
					</Col>
					<!-- 中心sql -->
					<Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22" class="code-mirror-form">
						<FormItem label="mainSQL" prop="mainSQL">
							<div class="codemirror">
								<monaco-editor v-model.trim="formData.mainSQL" language="sql" v-if="dialogFormVisible" />
							</div>
						</FormItem>
					</Col>
					<!-- 量测值sql -->
					<Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22" class="code-mirror-form">
						<FormItem label="measurementSQL" prop="measurementSQL">
							<div class="codemirror">
								<monaco-editor v-model.trim="formData.measurementSQL" language="sql" v-if="dialogFormVisible" />
							</div>
						</FormItem>
					</Col>
					<!-- 量测值查询条件-->
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem label="measurementQuery" prop="measurementQuery">
							<Input
								v-model.trim="formData.measurementQuery"
								size="small"
								clearable
								placeholder="示例:@PARAMETER,PARAMETER;@NAME,NAME;@MODELNAME,MODELNAME;@UNITID,UNITID"
							/>
						</FormItem>
					</Col>
					<!-- 量测值字段 -->
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem label="measurementField" prop="measurementField">
							<Input v-model.trim="formData.measurementField" size="small" clearable placeholder="示例:CHECKVALUE" />
							<p class="red">只允许一个字段名称</p>
						</FormItem>
					</Col>
					<!-- 过滤值sql -->
					<Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22" class="code-mirror-form">
						<FormItem label="filterKeySQL" prop="filterKeySQL">
							<div class="codemirror">
								<monaco-editor v-model.trim="formData.filterKeySQL" language="sql" v-if="dialogFormVisible" />
							</div>
						</FormItem>
					</Col>
					<!-- 过滤值查询条件-->
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem label="filterKeyQuery" prop="filterKeyQuery">
							<Input
								v-model.trim="formData.filterKeyQuery"
								size="small"
								clearable
								placeholder="示例:@PARAMETER,PARAMETER;@NAME,NAME;@MODELNAME,MODELNAME;@UNITID,UNITID"
							/>
						</FormItem>
					</Col>
					<!-- 过滤值字段 -->
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem label="filterKeyField" prop="filterKeyField">
							<Input v-model.trim="formData.filterKeyField" size="small" clearable placeholder="示例:EQPID,MODELNAME,CURPROCESSNAME" />
							<p class="red">字段顺序必须与spc channelKey 设定顺序与数量保持一致</p>
						</FormItem>
					</Col>

					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<!-- 是否全星 -->
						<FormItem label="isDataKey" prop="isDataKey">
							<i-switch size="large" v-model="formData.isDataKey" :true-value="1" :false-value="0">
								<span slot="open">是</span>
								<span slot="close">否</span>
							</i-switch>
						</FormItem>
					</Col>
					<!-- datakeysql -->
					<Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22" class="code-mirror-form">
						<FormItem label="dataKeySQL" prop="dataKeySQL">
							<div class="codemirror">
								<monaco-editor v-model.trim="formData.dataKeySQL" language="sql" v-if="dialogFormVisible" />
							</div>
						</FormItem>
					</Col>
					<!-- datakey查询 -->
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem label="dataKeyQuery" prop="dataKeyQuery">
							<Input
								v-model.trim="formData.dataKeyQuery"
								size="small"
								clearable
								placeholder="示例:@PARAMETER,PARAMETER;@NAME,NAME;@MODELNAME,MODELNAME;@UNITID,UNITID"
							/>
						</FormItem>
					</Col>
					<!-- 更新状态sql -->
					<Col :xs="24" :sm="20" :md="22" :lg="22" :xl="22" class="code-mirror-form">
						<FormItem label="updateSQL" prop="updateSQL">
							<div class="codemirror">
								<monaco-editor v-model.trim="formData.updateSQL" language="sql" v-if="dialogFormVisible" />
							</div>
						</FormItem>
					</Col>
					<!-- updateQuery -->
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem label="updateQuery" prop="updateQuery">
							<Input
								v-model.trim="formData.updateQuery"
								size="small"
								clearable
								placeholder="示例:@PARAMETER,PARAMETER;@PROCESSID,PROCESSID;@MODELID,MODELID;@UNITID,UNITID"
							/>
						</FormItem>
					</Col>
					<!-- 是否有效 -->
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem label="enabled" prop="enabled">
							<i-switch size="large" v-model="formData.enabled" :true-value="1" :false-value="0">
								<span slot="open">是</span>
								<span slot="close">否</span>
							</i-switch>
						</FormItem>
					</Col>
					<!-- 备注 -->
					<Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<FormItem label="remark" prop="remark">
							<Input v-model.trim="formData.remark" size="small" clearable />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer" class="dialog-footer">
				<Button @click="closeDialog">取消</Button>
				<Button type="primary" @click="submit()">保存</Button>
			</div>
		</Modal>
	</div>
</template>
<script>
import { addReq, modifyReq } from "@/api/bill-design-manage/spc.js";
import MonacoEditor from "@/components/monaco-editor/monaco-editor.vue";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/lib/codemirror.css"; // 核心样式
import "codemirror/theme/cobalt.css"; // 引入主题后还需要在 options 中指定主题才会生效
export default {
	name: "Support",
	components: { MonacoEditor },
	props: {},
	data() {
		return {
			modalTitle: "",
			formData: {
				channelName: "", //模板名称
				channelParameter: "", //模板参数
				mainSQL:
					"/*示例:SELECT DISTINCT A.UNITID,A.PARAMETER,B.NAME,C.MODELNAME,A.PROCESSID,A.MODELID\nFROM GITEA.WF_SAMPLING_CHECK_LOG A\nINNER JOIN GITEA.WF_PROCESS B ON A.PROCESSID = B.ID\nINNER JOIN GITEA.MC_MODEL C ON A.MODELID = C.ID\nWHERE A.PARAMETER = 'MoldingShiftP2-X1' \nAND B.NAME = 'Molding Shift & Warpage' \nAND C.MODELNAME = 'LE2-SIP'\nAND A.REMARK IS NULL*/", //中心sql
				measurementSQL:
					"/*示例:SELECT A.UNITID,A.PARAMETER,A.CHECKVALUE,B.NAME,C.MODELNAME\nFROM GITEA.WF_SAMPLING_CHECK_LOG A\nINNER JOIN GITEA.WF_PROCESS B ON A.PROCESSID=B.ID\nINNER JOIN GITEA.MC_MODEL C ON A.MODELID=C.ID\nWHERE A.PARAMETER=@PARAMETER \nAND B.NAME=@NAME\nAND C.MODELNAME=@MODELNAME\nAND A.UNITID=@UNITID*/", //量测值sql
				measurementQuery: "", //量测值查询条件
				measurementField: "", //量测值字段
				filterKeySQL:
					"/*示例:SELECT DISTINCT D.EQPID,C.MODELNAME,D.CURPROCESSNAME\nFROM GITEA.WF_SAMPLING_CHECK_LOG A\nINNER JOIN GITEA.WF_PROCESS B ON A.PROCESSID=B.ID\nINNER JOIN GITEA.MC_MODEL C ON A.MODELID=C.ID\nINNER JOIN GITEA.WF_UNITINFOTRAVEL D ON A.PROCESSID=D.CURPROCESSID AND A.UNITID=D.UNITID\nWHERE A.PARAMETER=@PARAMETER \nAND B.NAME=@NAME\nAND C.MODELNAME=@MODELNAME\nAND A.UNITID=@UNITID\nAND ROWNUM=1*/", //过滤值sql
				filterKeyQuery: "", //过滤值查询条件
				filterKeyField: "", //过滤值字段
				isDataKey: 0, //是否全星
				dataKeySQL:
					"/*示例:SELECT DISTINCT '*','*','*',D.PANELNO,D.INPROCESSTIME,D.OUTPROCESSTIME,'*','*','*','*'\nFROM GITEA.WF_SAMPLING_CHECK_LOG A\nINNER JOIN GITEA.WF_PROCESS B ON A.PROCESSID=B.ID\nINNER JOIN GITEA.MC_MODEL C ON A.MODELID=C.ID\nINNER JOIN GITEA.WF_UNITINFOTRAVEL D ON A.PROCESSID=D.CURPROCESSID AND A.UNITID=D.UNITID\nWHERE A.PARAMETER=@PARAMETER \nAND B.NAME=@NAME\nAND C.MODELNAME=@MODELNAME\nAND A.UNITID=@UNITID\nAND ROWNUM=1*/", //datakeysql
				dataKeyQuery: "", //datakey查询
				updateSQL:
					"/*示例:UPDATE GITEA.WF_SAMPLING_CHECK_LOG SET REMARK='Y'\nWHERE PARAMETER=@PARAMETER\nAND PROCESSID=@PROCESSID\nAND MODELID=@MODELID\nAND UNITID=@UNITID*/", //更新状态sql
				updateQuery: "", //
				enabled: 0,
				remark: "",
			},
			// 弹框默认隐藏
			dialogFormVisible: false,
			dialogFormVisibleTitle: "",
			ruleValidate: {
				channelName: [{ required: true, message: "模板名称必填", trigger: "blur" }],
				channelParameter: [{ required: true, message: "模板参数必填", trigger: "blur" }],
				mainSQL: [{ required: true, message: "中心sql必填", trigger: "blur" }],
				measurementSQL: [{ required: true, message: "量测值sql必填", trigger: "blur" }],
				measurementQuery: [{ required: true, message: "量测值查询条件必填", trigger: "blur" }],
				measurementField: [{ required: true, message: "量测值字段必填", trigger: "blur" }],
				filterKeySQL: [{ required: true, message: "过滤值SQL 必填", trigger: "blur" }],
				filterKeyQuery: [{ required: true, message: "过滤值查询条件必填", trigger: "blur" }],
				filterKeyField: [{ required: true, message: "过滤值字段必填", trigger: "blur" }],
				dataKeySQL: [{ required: true, message: "dataKeySQL必填", trigger: "blur" }],
				dataKeyQuery: [{ required: true, message: "datakey查询必填", trigger: "blur" }],
				updateSQL: [{ required: true, message: "updateSQL必填", trigger: "blur" }],
				updateQuery: [{ required: true, message: "update查询必填", trigger: "blur" }],
			},
			isAdd: true,
			spcType: "",
		};
	},
	methods: {
		// 编辑数据集,获取单条数据详情
		pageLoad(row, isAdd, type = "") {
			this.modalTitle = isAdd ? "新增" : type ? "复制" : "编辑";
			this.isAdd = isAdd;
			this.spcType = type; //复制 copy
			this.formData = { ...this.formData, ...row };
			this.$nextTick(() => {
				this.dialogFormVisible = true;
			});
		},
		// 关闭模态框
		closeDialog() {
			this.dialogFormVisible = false;
			this.$refs.form.resetFields();
			this.formData.mainSQL =
				"/*示例:SELECT DISTINCT A.UNITID,A.PARAMETER,B.NAME,C.MODELNAME,A.PROCESSID,A.MODELID\nFROM GITEA.WF_SAMPLING_CHECK_LOG A\nINNER JOIN GITEA.WF_PROCESS B ON A.PROCESSID = B.ID\nINNER JOIN GITEA.MC_MODEL C ON A.MODELID = C.ID\nWHERE A.PARAMETER = 'MoldingShiftP2-X1' \nAND B.NAME = 'Molding Shift & Warpage' \nAND C.MODELNAME = 'LE2-SIP'\nAND A.REMARK IS NULL*/"; //中心sql;
			(this.formData.measurementSQL =
				"/*示例:SELECT A.UNITID,A.PARAMETER,A.CHECKVALUE,B.NAME,C.MODELNAME\nFROM GITEA.WF_SAMPLING_CHECK_LOG A\nINNER JOIN GITEA.WF_PROCESS B ON A.PROCESSID=B.ID\nINNER JOIN GITEA.MC_MODEL C ON A.MODELID=C.ID\nWHERE A.PARAMETER=@PARAMETER \nAND B.NAME=@NAME\nAND C.MODELNAME=@MODELNAME\nAND A.UNITID=@UNITID*/"), //量测值sql;
				(this.formData.filterKeySQL =
					"/*示例:SELECT DISTINCT D.EQPID,C.MODELNAME,D.CURPROCESSNAME\nFROM GITEA.WF_SAMPLING_CHECK_LOG A\nINNER JOIN GITEA.WF_PROCESS B ON A.PROCESSID=B.ID\nINNER JOIN GITEA.MC_MODEL C ON A.MODELID=C.ID\nINNER JOIN GITEA.WF_UNITINFOTRAVEL D ON A.PROCESSID=D.CURPROCESSID AND A.UNITID=D.UNITID\nWHERE A.PARAMETER=@PARAMETER \nAND B.NAME=@NAME\nAND C.MODELNAME=@MODELNAME\nAND A.UNITID=@UNITID\nAND ROWNUM=1*/"); //过滤值sql;
			this.formData.dataKeySQL =
				"/*示例:SELECT DISTINCT '*','*','*',D.PANELNO,D.INPROCESSTIME,D.OUTPROCESSTIME,'*','*','*','*'\nFROM GITEA.WF_SAMPLING_CHECK_LOG A\nINNER JOIN GITEA.WF_PROCESS B ON A.PROCESSID=B.ID\nINNER JOIN GITEA.MC_MODEL C ON A.MODELID=C.ID\nINNER JOIN GITEA.WF_UNITINFOTRAVEL D ON A.PROCESSID=D.CURPROCESSID AND A.UNITID=D.UNITID\nWHERE A.PARAMETER=@PARAMETER \nAND B.NAME=@NAME\nAND C.MODELNAME=@MODELNAME\nAND A.UNITID=@UNITID\nAND ROWNUM=1*/"; //datakeysql;
			this.formData.updateSQL =
				"/*示例:UPDATE GITEA.WF_SAMPLING_CHECK_LOG SET REMARK='Y'\nWHERE PARAMETER=@PARAMETER\nAND PROCESSID=@PROCESSID\nAND MODELID=@MODELID\nAND UNITID=@UNITID*/"; //更新状态sql;
		},
		// 提交
		async submit() {
			this.$refs.form.validate(async (valid) => {
				if (valid) {
					const requestApi = this.isAdd ? addReq : this.spcType ? addReq : modifyReq;
					const { code, message } = await requestApi(this.formData);
					if (code === 200) {
						this.$Msg.success("提交成功！");
						this.$emit("refreshList");
						this.closeDialog();
					} else {
						this.$Msg.error(`提交失败！${message}`);
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
.red {
	color: red;
}
</style>
