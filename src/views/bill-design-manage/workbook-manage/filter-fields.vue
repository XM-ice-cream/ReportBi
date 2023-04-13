/**过滤字段 */
<template>
	<!-- 函数管理 -->
	<Modal
		:title="isAdd ? '筛选器' : '筛选器'"
		v-model="modelFlag"
		width="800"
		draggable
		:mask-closable="false"
		:mask="true"
		:before-close="cancelClick"
	>
		<div class="filter-fields">
			<Form ref="submitReq" :model="submitData" :label-width="100" :label-colon="true">
				<!-- 显示数据 -->
				<FormItem label="显示数据" prop="showData">
					<i-switch size="small" v-model="submitData.showData" :true-value="1" :false-value="0"> </i-switch>
				</FormItem>
				<template v-if="submitData.columnType == 'DATE' && !submitData.showData">
					<!-- 时间类别 -->
					<FormItem label="时间类别" prop="timeType">
						<RadioGroup v-model="submitData.timeType">
							<Radio label="year">年</Radio>
							<Radio label="month">年-月</Radio>
							<Radio label="datetime">年-月-日 时:分:秒</Radio>
						</RadioGroup>
					</FormItem>
					<!-- 起始时间 -->
					<FormItem :label="$t('startTime')" prop="startTime">
						<DatePicker
							transfer
							:type="submitData.timeType"
							:placeholder="$t('pleaseSelect') + $t('startTime')"
							:options="$config.datetimeOptions"
							v-model="submitData.startTime"
						></DatePicker>
					</FormItem>
					<!-- 结束时间 -->
					<FormItem :label="$t('endTime')" prop="endTime">
						<DatePicker
							transfer
							:type="submitData.timeType"
							:placeholder="$t('pleaseSelect') + $t('endTime')"
							:options="$config.datetimeOptions"
							v-model="submitData.endTime"
						></DatePicker>
					</FormItem>
				</template>
				<template v-else>
					<!-- 筛选信息 -->
					<FormItem label="筛选信息" prop="filterValue">
						<Input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" v-model="submitData.filterValue" clearabled />
					</FormItem>
				</template>
			</Form>
			<template v-if="submitData.showData">
				<Table
					ref="selection"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
					@on-selection-change="selectClick"
				></Table>
				<!-- <page-custom
					:elapsedMilliseconds="req.elapsedMilliseconds"
					:total="req.total"
					:totalPage="req.totalPage"
					:pageIndex="req.pageIndex"
					:page-size="req.pageSize"
					@on-change="pageChange"
					@on-page-size-change="pageSizeChange"
				/> -->
			</template>
		</div>

		<div slot="footer" class="dialog-footer">
			<Button @click="cancelClick">取 消</Button>
			<Button type="primary" @click="submitClick">确定 </Button>
		</div>
	</Modal>
</template>
<script>
import { formatDate } from "@/libs/tools";
import { getselectvalueReq } from "@/api/bill-design-manage/workbook-design.js";
export default {
	name: "filter-fields",
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
				this.submitData = { ...this.selectObj, showData: 0 };
				this.autoSize();
				window.addEventListener("resize", () => this.autoSize());
			}
		},
		"submitData.showData"(newVal) {
			//关闭显示数据，清空
			if (newVal == 0) {
				// this.submitData.selectArr = [];
				// this.submitData.filterValue = "";
			}
			//显示筛选器
			if (newVal == 1) {
				this.$nextTick(() => {
					this.pageLoad();
				});
			}
		},
	},
	data() {
		return {
			submitData: {},
			modelFlag: false,
			tableConfig: { ...this.$config.tableConfig }, // table配置
			columns: [
				{
					type: "selection",
					width: 60,
					align: "center",
				},
				{
					title: "全选",
					key: "value",
				},
			],
			data: [],
			req: {
				...this.$config.pageConfig,
			}, //查询数据
		};
	},
	methods: {
		//获取数据
		pageLoad() {
			this.tableConfig.loading = true;
			this.data = [];
			const { nodeId, datasetId, labelName, columnName, columnType, dataType, columnComment } = this.submitData;
			const obj = {
				orderField: "string",
				ascending: true,
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				total: 0,
				data: {
					nodeId,
					datasetId,
					labelName,
					columnName,
					columnType,
					dataType,
					columnComment,
				},
			};
			getselectvalueReq(obj)
				.then((res) => {
					if (res.code == 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						this.data =
							data.map((item) => {
								if (dataType === "DateTime") item = formatDate(item);
								//默认选中数据
								if ((this.submitData.filterValue?.split(",") || []).includes(item)) return { value: item, _checked: true };
								return { value: item };
							}) || [];
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
						this.$nextTick(() => {
							this.submitData.selectArr =
								this.submitData.filterValue?.split(",").map((item) => {
									return { value: item };
								}) || [];
							this.submitData = JSON.parse(JSON.stringify(this.submitData));
						});
					} else {
						this.$Msg.error(`查询失败,${res.message}`);
						this.data = [];
					}
				})
				.finally(() => (this.tableConfig.loading = false));
		},
		//提交
		submitClick() {
			const { newIndex, startTime, endTime, columnType, showData } = this.submitData;
			if (columnType === "DATE" && !showData) {
				this.submitData.filterValue = `${formatDate(startTime)},${formatDate(endTime)}`;
				this.submitData.startTime = formatDate(startTime);
				this.submitData.endTime = formatDate(endTime);
			}
			// else (this.submitData.filterValue = commaSplitString(filterValue).join()), (this.modelFlag = false);

			this.$emit("updateFilter", newIndex, this.submitData); //取消后 删除拖拽的cell
			this.$refs.submitReq.resetFields();
			this.modelFlag = false;
		},
		handleSelectAll(status) {
			this.$refs.selection.selectAll(status);
		},
		//选择的数据
		selectClick(selection) {
			this.submitData.selectArr = selection;
			this.submitData.filterValue = selection.map((item) => item.value).toString();
			this.submitData = JSON.parse(JSON.stringify(this.submitData));
		},
		//删除过滤数据
		cancelClick() {
			// const { newIndex } = this.submitData;
			this.modelFlag = false;
			// this.$refs.submitReq.resetFields();
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight / 2 - 60;
		},
		// 选择第几页
		pageChange(index) {
			this.req.pageIndex = index;
			this.pageLoad();
		},
		// 选择一页有条数据
		pageSizeChange(index) {
			this.req.pageIndex = 1;
			this.req.pageSize = index;
			this.pageLoad();
		},
	},
};
</script>
<style lang="less" scoped></style>
