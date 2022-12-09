<template>
	<div style="height: 100%">
		<div class="page-style excel-preview">
			<div class="comment">
				<Card :bordered="false" dis-hover class="card-style">
					<p slot="title">{{ isPreview ? `模板预览【${data.name}】` : `表单审核【${data.billNumber}】` }}</p>
					<!-- 表格 -->
					<div class="data-table" style="height: calc(100% - 20px); overflow: auto">
						<table class="table tableScroll" id="exceltable" :class="tableHtml.length > 1 ? '' : 'blankBg'">
							<tr v-for="(itemTr, indexTr) in tableHtml" :key="indexTr">
								<template v-for="(item, index) in itemTr">
									<td v-if="item && item.rowspan" :style="item.style" :colspan="item.colspan || 1" :rowspan="item.rowspan || 1" :key="index">
										<div :title="item.value" :style="item.divStyle">
											<template v-if="item.cellType?.type">
												<!-- 输入框 -->
												<template v-if="item.cellType.type === 'input'"> <Input clearable v-model.trim="resultData.celldata[item.index].v.v" /> </template>
												<!-- 复选框 -->
												<template v-if="item.cellType.type === 'checkbox'">
													<CheckboxGroup v-model="resultData.celldata[item.index].v.v">
														<Checkbox v-for="cellItem in item.cellType.data" :key="cellItem.value" :label="cellItem.value">{{ cellItem.name }}</Checkbox>
													</CheckboxGroup>
												</template>
												<!-- 下拉框 -->
												<template v-if="item.cellType.type === 'select'">
													<Select v-model="resultData.celldata[item.index].v.v" clearable transfer placeholder="">
														<Option v-for="cellItem in item.cellType.data" :value="cellItem.value" :key="cellItem.value">{{ cellItem.name }}</Option>
													</Select>
												</template>
												<!-- 时间选择器 -->
												<template v-if="item.cellType.type === 'datePicker'">
													<DatePicker type="datetime" v-model="resultData.celldata[item.index].v.v" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" clearable transfer></DatePicker>
												</template>
												<!-- 数字输入框 -->
												<template v-if="item.cellType.type === 'inputnumber'">
													<InputNumber v-model="resultData.celldata[item.index].v.v" clearable />
												</template>
											</template>
											<template v-else>{{ item.value }}</template>
										</div>
									</td>
									<!-- <td v-if="!item" :key="index" style="width: 75px; height: 18px; border: 1px solid #000"></td> -->
								</template>
							</tr>
						</table>
					</div>
					<!-- 提交按钮 -->
					<div class="card-footer" v-if="!isPreview">
						<Button type="primary" ghost @click="modalOk(-1)">{{ $t("save") }}</Button>
						<Button type="primary" @click="modalOk(0)">{{ $t("submit") }}</Button>
					</div>
				</Card>
			</div>
		</div>
	</div>
</template>

<script>
import { modifyReq, getlistReq } from "@/api/bill-design-manage/paperless-form.js";

export default {
	name: "paperless-preview",
	components: {},
	data() {
		return {
			tableHtml: [],
			isPreview: false,
			resultData: [],
			data: {},
		};
	},

	methods: {
		//获取数据
		pageLoad() {
			const data = window.localStorage.getItem("paperlessRow");
			const obj = {
				billNumber: JSON.parse(data).billNumber,
				templateId: JSON.parse(data).templateId,
			};
			getlistReq(obj).then((res) => {
				if (res.code == 200) {
					this.data = res?.result[0] || [];
					console.log(this.data);
					this.$nextTick(() => {
						this.getTable();
					});
				}
			});
		},

		//初始化表格
		getTable() {
			this.resultData = JSON.parse(this.data.json)[0];
			let { celldata, config, frozen } = this.resultData;
			this.tableHtml = [];

			// 处理表格单元格样式
			celldata.forEach((item, index) => {
				console.log(item);
				const { r, c } = item;
				//console.log(r, c, item);
				if (!this.tableHtml[r]) this.tableHtml[r] = [];
				if (!this.tableHtml[r][c]) this.tableHtml[r][c] = {};

				let { v, bg, bl, fc, ht, vt, mc, fs, cellType, authority, ct } = item.v; //获取样式
				const { columnlen, rowlen } = config; //边框
				let style = "";
				//   宽高
				let width = columnlen && columnlen[c] ? columnlen[c] : 75;
				let height = rowlen && rowlen[r] ? rowlen[r] : 18;
				// td 样式
				if (bg) style += `background:${bg};`; //背景颜色
				if (bl) style += `font-weight:${bl == 1 ? "bold" : "normal"};`; //字体粗细
				if (fc) style += `color:${fc};`; //字体颜色
				if (fs) style += `font-size:${fs}px;`; //文字大小
				if (ht) style += `justify-content:${ht == 0 ? "center" : ht == 2 ? "right" : "left"};`; //水平居中 0:居中;1:居左;2:居右
				if (vt) style += `align-items:${vt == 0 ? "center" : vt == 2 ? "right" : "left"};`; //垂直居中
				if (frozen?.type && r == 0) style += "position:sticky;top:0;"; //冻结首行
				style += `border:1px solid #000;`; //边框
				//合并单元格
				const colspan = mc ? (r == mc?.r && c == mc?.c ? mc.cs : 0) : 1;
				const rowspan = mc ? (r == mc?.r && c == mc?.c ? mc.rs : 0) : 1;

				//td 内部div样式
				let divStyle = `min-width:${width}px;min-height:${height}px;`; //宽高
				if (v) divStyle += `line-height:${height * rowspan}px;`;
				divStyle += `white-space: pre-line;overflow: hidden;text-overflow: ellipsis;display: flex;`; //超出文字省略,有\n 换行
				if (ht) divStyle += `justify-content:${ht == 0 ? "center" : ht == 2 ? "right" : "left"};`; //水平居中 0:居中;1:居左;2:居右
				if (vt) divStyle += `align-items:${vt == 0 ? "center" : vt == 2 ? "right" : "left"};`; //垂直居中
				// 值不存在 则显示默认值
				if (!v) v = cellType?.default || ct?.s?.map((item) => item.v).toString() || v;

				this.resultData.celldata[index] = { ...item, v: { ...item?.v, v: v } };

				this.tableHtml[r][c] = { r, c, style, colspan, rowspan, divStyle, value: v, cellType, index };
				console.log(this.tableHtml[r][c]);
			});
		},
		modalOk(type) {
			const obj = {
				...this.data,
				json: JSON.stringify([this.resultData]),
				state: type,
			};
			modifyReq(obj).then((res) => {
				if (res.code == 200) {
					this.$Message.success("提交成功！");
				} else {
					this.$Message.error("提交失败", res.message);
				}
			});
			console.log("结果集：", this.resultData);
		},
	},
	mounted() {
		const obj = window.localStorage.getItem("paperlessRow");
		const parseObj = JSON.parse(obj);
		if (parseObj?.row) {
			console.log(obj.row);
			this.data = parseObj.row;
			this.isPreview = true;
			document.title = `模板-${this.data.name}`;

			this.$nextTick(() => {
				this.getTable();
			});
		} else {
			document.title = JSON.parse(obj).billNumber;
			this.pageLoad();
		}
	},
};
</script>
<style>
@import "../../../assets/table.less";
</style>
<style lang="less" scoped>
.data-table table {
	width: auto;
	height: auto;
	// position: absolute;
	// top: 50%;
	// left: 50%;
	// transform: translate(-50%, -50%);
	float: none;
	display: table;
	color: #1a1a1a !important;
	border: none;
}
.data-table td {
	padding: 0 3px;
	&:hover {
		background-color: #27ce88 !important;
		color: #fff;
	}
}
.card-footer {
	width: 100%;
	text-align: center;
	position: absolute;
	bottom: 4px;

	button {
		margin-right: 10px;
		padding: 0 25px;
	}
}
:deep(.ivu-card-head) {
	p {
		padding-left: 10px;
		font-weight: bold;
		&::before {
			content: "";
			position: absolute;
			left: 8px;
			display: inline-block;
			width: 4px;
			height: 22px;
			background: #27ce88;
		}
	}
}
:deep(.ivu-input) {
	border: none;
	border-radius: 0px !important;
	background: transparent;
	&:hover {
		color: #fff;
	}
}
:deep(.ivu-checkbox-wrapper) {
	font-size: 16px;
}
:deep(.ivu-modal-fullscreen .ivu-modal-body) {
	top: 25px;
	bottom: 0px;
}
:deep(.ivu-select-selection:hover) {
	border: none;
	background-color: transparent;
	border-radius: 0px;
	color: #fff;
}
:deep(.ivu-select-selection) {
	border: none;
}
</style>
