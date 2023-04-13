/* 新增记录 */
<template>
	<div>
		<!-- 左侧抽屉 -->
		<Drawer
			class="add-record"
			v-model="drawerFlag"
			:title="isAdd ? '新增记录' : '修改记录'"
			width="1350"
			:mask-closable="false"
			@on-close="cancelClick"
		>
			<!-- 页面表格 -->
			<div class="comment">
				<div class="content-title">
					<div class="line"></div>
					Health Tracker数据信息
					<Button type="success" class="add-button" custom-icon="iconfont icon-add" @click="addLastRow">添加一行 </Button>
				</div>
				<div class="add-table">
					<Table :columns="columns" :data="tableData" :height="tableConfig.height" :border="tableConfig.border" disabled-hover draggable>
						<template slot-scope="{ row, index }" slot="operation">
							<Button type="success" class="row-button" custom-icon="iconfont icon-add" @click="addRowClick(index)"></Button>
							<Button type="error" ghost class="row-button" custom-icon="iconfont icon-delete" @click="deleteClick(index)"></Button>
						</template>
					</Table>
					<Alert type="warning">输入SN和Location后，回车带出相关信息！</Alert>
				</div>
				<drawer-button @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
			</div>
		</Drawer>
	</div>
</template>

<script>
import { getInfoReq, addReq } from "@/api/bill-manage/health-tracker";
import { errorType } from "@/libs/tools";

export default {
	name: "add-modify",
	props: {
		selectObj: {
			type: Object,
			default: null,
		},
		data: {
			type: Array,
			default: null,
		},
		isAdd: Boolean,
	},
	data() {
		return {
			drawerFlag: false,
			drawerTitle: "Health Tracker新增",
			tableConfig: { ...this.$config.tableConfig }, // table配置
			templateNameList: [],
			//data: [], //表格数据
			columns: [],
			rowObj: {},
			submitData: {
				detailsList: [],
			},
			tableData: [],
		};
	},
	watch: {
		drawerFlag(newValue) {
			if (newValue) {
				this.autoSize();
			} else {
				this.submitData.detailsList = [];
				this.tableData = [];
			}
		},
	},
	methods: {
		renderComp({ row, index, fieldType, fileKey }) {
			switch (fieldType) {
				case "input":
					return (
						<Input
							value={row[fileKey]}
							placeholder="请输入"
							onInput={(value) => (this.tableData[index][fileKey] = value)}
							style="backgroundColor:#FFF"
						/>
					);
				case "changeInput":
					return (
						<Input
							value={row[fileKey]}
							placeholder="请输入"
							onInput={(value) => (this.tableData[index][fileKey] = value)}
							nativeOnkeyup={(event) => this.changeInput(event, index, fileKey)}
							style="backgroundColor:#FED"
						/>
					);
				case "datetime":
					return (
						<DatePicker value={row[fileKey]} type="datetime" placeholder="请选择" onInput={(value) => (this.tableData[index][fileKey] = value)} />
					);
				case "Qty":
					return <div>1</div>;
				default:
					return <div>{row[fileKey]}</div>;
			}
		},
		async changeInput(event, index, fileKey) {
			const obj = {
				sn: this.tableData[index]["sn"],
				location: this.tableData[index]["loacation"],
			};
			//回车 isRequest=true说明可回车
			if (event.keyCode === 13) {
				if (obj) {
					await getInfoReq({ ...obj }).then((res) => {
						if (res.result) {
							const result = res.result;
							this.tableData[index] = { ...this.tableData[index], ...result };
							this.tableData = JSON.parse(JSON.stringify(this.tableData));
						} else {
							this.$Msg.warning("无法找到对应信息！");
							this.tableData[index][fileKey] = "";
						}
					});
				} else {
					this.$Msg.warning("请填写SN和Location,谢谢！");
				}
			}
		},
		// 提交
		submitClick(isClose = false) {
			this.submitData.detailsList = this.tableData;
			const desLength = this.tableData.every((item) => !item?.issuedescription || item?.issuedescription?.length <= 120);
			if (!desLength) {
				this.$Msg.error("Issue Description 内容长度超出120,请核验");
				return;
			}

			let request = addReq(this.submitData);
			request.then((res) => {
				if (res.code === 200) {
					this.$Msg.success(`${res.message}`);
					this.$emit("refreshPageLoad");
					if (isClose) this.cancelClick();
				} else {
					this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
				}
			});
		},
		// 新增
		getColumnsList() {
			this.columns = [];
			this.columns = this.data.map((val) => ({
				title: val.title,
				key: val.key,
				minWidth: val.minWidth,
				tooltip: true,
				ellipsis: true,
				align: "center",
				render: (h, { row, index }) => {
					return this.renderComp({
						fieldType: val.inputType,
						fileKey: val.key,
						row,
						index,
					});
				},
			}));
			this.columns.push(
				{
					title: this.$t("operation"),
					slot: "operation",
					width: 130,
					align: "center",
				},
				{
					fixed: "left",
					title: this.$t("sort"),
					width: 50,
					key: "sort",
					align: "center",
					render: (h, params) => {
						return h("span", {}, params.index + 1);
					},
				}
			);
		},
		//新增最后一列
		addLastRow() {
			let rowData;
			rowData = this.submitData.detailsList.map((val) => val.title);
			const rowObj = {};
			for (let key in rowData) {
				rowObj[rowData[key]] = null;
			}
			this.tableData.push(rowObj);
		},
		// 新增下一列
		addRowClick(index) {
			let rowData;
			rowData = this.data.map((val) => val.title);
			const rowObj = {};
			for (let key in rowData) {
				rowObj[rowData[key]] = null;
			}
			this.tableData.splice(index + 1, 0, rowObj);
		},
		// 删除
		deleteClick(index) {
			this.tableData.splice(index, 1);
		},
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
			this.$parent.isAdd = true;
			//this.tableData = []
			//this.columns = []
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 300;
		},
	},
	created() {},
	mounted() {
		this.getColumnsList();
	},
};
</script>
<style lang="less">
.drawer-button {
	margin-top: 20px;
	display: flex;
	justify-content: center;
}

.add-record {
	.content-title {
		font-size: 14px;
		font-weight: bold;
		color: #484848;
		margin-bottom: 10px;
		margin-left: 15px;

		.line {
			display: inline-block;
			width: 3px;
			height: 16px;
			vertical-align: middle;
			background: #5f91ff;
			margin-right: 7px;
		}
	}

	.ivu-form-item {
		margin-bottom: 10px;
		margin-top: 10px;
	}

	.row-button {
		margin: 0 5px;
	}

	.add-button {
		position: absolute;
		right: 20px;
	}

	.ivu-table-cell-slot {
		input {
			border: none;

			&:focus {
				box-shadow: none;
			}
		}

		.ivu-select-selection {
			border: none;
			box-shadow: none;
		}
	}

	.add-table {
		.ivu-input {
			border: none;
			text-align: center;
			background-color: transparent;
			&:focus {
				box-shadow: none;
			}
		}
	}
}
</style>
