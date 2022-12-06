<template>
	<Modal v-model="modalFlag" title="无纸化表单编辑" fullscreen :mask="false" :z-index="999" transfer>
		<div class="page-style excel-preview">
			<div class="comment">
				<Card :bordered="false" dis-hover class="card-style">
					<!-- 表格 -->
					<div class="data-table" style="height: 100%">
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
													<DatePicker type="datetime" v-model="resultData.celldata[item.index].v.v" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" clearable></DatePicker>
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
				</Card>
			</div>
		</div>
		<div slot="footer">
			<Button @click="modalCancel">{{ $t("cancel") }}</Button>
			<Button type="primary" @click="modalOk">{{ $t("submit") }}</Button>
		</div>
	</Modal>
</template>

<script>
export default {
	name: "paperless-preview",
	components: {},
	data() {
		return {
			tableHtml: [],
			modalFlag: false,
			resultData: [],
			data: {},
		};
	},
	watch: {
		modalFlag() {
			this.$nextTick(() => {
				this.getTable();
			});
		},
	},
	methods: {
		//初始化表格
		getTable() {
			this.resultData = JSON.parse(this.data.json)[0];
			let { celldata, config, frozen } = this.resultData;
			console.log("JSON.parse(this.data.json)", JSON.parse(this.data.json));
			this.tableHtml = [];

			// 处理表格单元格样式
			celldata.forEach((item, index) => {
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
			});
		},
		modalOk() {
			console.log("结果集：", this.resultData);
		},
		//取消
		modalCancel() {
			this.modalFlag = false;
		},
	},
};
</script>
<style>
@import "../../../assets/table.less";
</style>
<style lang="less" scoped>
.data-table table {
	position: absolute;
	width: auto;
	height: 100%;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #1a1a1a !important;
}
.data-table td {
	padding: 0;
}
:deep(.ivu-input) {
	border: none;
	border-radius: 0px !important;
}
:deep(.ivu-checkbox-wrapper) {
	font-size: 16px;
}
:deep(.ivu-modal-fullscreen .ivu-modal-body) {
	top: 25px;
	bottom: 0px;
}
</style>
