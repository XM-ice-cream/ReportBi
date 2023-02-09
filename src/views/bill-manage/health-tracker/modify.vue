/* 修改记录 */
<template>
	<div>
		<!-- 左侧抽屉 -->
		<Drawer
			class="add-record"
			v-model="drawerFlag"
			:title="isAdd ? '新增记录' : '修改记录'"
			width="700"
			:mask-closable="false"
			@on-close="cancelClick"
		>
			<!-- 页面表格 -->
			<div class="comment">
				<Form ref="searchReq" :model="selectObj" :label-width="120" :label-colon="true" @submit.native.prevent>
					<!-- trackingno -->
					<FormItem label="TrackingNo" prop="trackingno">
						<Input v-model.trim="selectObj.trackingno" :placeholder="$t('pleaseEnter') + 'TrackingNo'" />
					</FormItem>
					<!-- shipmentdate -->
					<FormItem label="ShipmentDate" prop="shipmentdate">
						<DatePicker
							transfer
							type="datetime"
							:placeholder="$t('pleaseSelect') + 'ShipmentDate'"
							format="yyyy-MM-dd HH:mm:ss"
							:options="$config.datetimeOptions"
							v-model="selectObj.shipmentdate"
						></DatePicker>
					</FormItem>
					<!-- vendorreceivdate -->
					<FormItem label="VendorreceivDate" prop="vendorreceivdate">
						<DatePicker
							transfer
							type="datetime"
							:placeholder="$t('pleaseSelect') + 'VendorreceivDate'"
							format="yyyy-MM-dd HH:mm:ss"
							:options="$config.datetimeOptions"
							v-model="selectObj.vendorreceivdate"
						></DatePicker>
					</FormItem>
					<!-- issuedate -->
					<FormItem label="IssueDate" prop="issuedate">
						<DatePicker
							transfer
							type="datetime"
							:placeholder="$t('pleaseSelect') + 'IssueDate'"
							format="yyyy-MM-dd HH:mm:ss"
							:options="$config.datetimeOptions"
							v-model="selectObj.issuedate"
						></DatePicker>
					</FormItem>
					<!-- reportdate -->
					<FormItem label="ReportDate" prop="reportdate">
						<DatePicker
							transfer
							type="datetime"
							:placeholder="$t('pleaseSelect') + 'ReportDate'"
							format="yyyy-MM-dd HH:mm:ss"
							:options="$config.datetimeOptions"
							v-model="selectObj.reportdate"
						></DatePicker>
					</FormItem>
					<!-- failurestation -->
					<FormItem label="FailureStation" prop="failurestation">
						<Input v-model.trim="selectObj.failurestation" :placeholder="$t('pleaseEnter') + 'FailureStation'" />
					</FormItem>
					<!-- status -->
					<FormItem label="状态" prop="status">
						<Input v-model.trim="selectObj.status" :placeholder="$t('pleaseEnter') + '状态'" />
					</FormItem>
					<!-- 备注 -->
					<FormItem label="备注" prop="remark">
						<Input v-model.trim="selectObj.remark" :placeholder="$t('pleaseEnter') + '备注'" />
					</FormItem>
				</Form>
				<drawer-button @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
			</div>
		</Drawer>
	</div>
</template>

<script>
import { modifyReq } from "@/api/bill-manage/health-tracker";
import { errorType, formatDate } from "@/libs/tools";

export default {
	name: "modify-record",
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
			drawerTitle: "Health Tracker编辑",
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
			}
		},
	},
	methods: {
		// 提交
		submitClick(isClose = false) {
			const { reportdate, shipmentdate, vendorreceivdate, issuedate } = this.selectObj;
			const obj = {
				...this.selectObj,
				reportdate: formatDate(reportdate),
				shipmentdate: formatDate(shipmentdate),
				vendorreceivdate: formatDate(vendorreceivdate),
				issuedate: formatDate(issuedate),
			};
			modifyReq(obj).then((res) => {
				if (res.code === 200) {
					this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
					this.$emit("refreshPageLoad");
					if (isClose) this.cancelClick();
				} else {
					this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
				}
			});
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
	mounted() {},
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
