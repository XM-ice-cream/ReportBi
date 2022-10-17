<template>
	<div class="shuttle-column">
		<div class="transfer-colomn">
			<div class="transfer-colomn-left" :style="{ width: ltWidth }">
				<Table
					border
					v-loading="dateLoading"
					ref="listTable"
					highlight-row
					:data="originDate"
					:height="tableHeight"
					:columns="leftListHeader"
					:row-class-name="tableRowClassName"
					@on-row-dblclick="handleDbRowClick"
					@on-row-click="handleCurrentRowClick"
					@on-select="handleSelectionChange"
					@on-select-all="handleSelectionChange"
				>
				</Table>
			</div>
			<div class="transfer-icons">
				<p @click="handleTransferRightClick"><Icon type="ios-arrow-forward" /></p>
				<p class="to-left" @click="handleTransferLeftClick"><Icon type="ios-arrow-back" /></p>
			</div>
			<div class="transfer-colomn-right" :style="{ width: rtWidth }">
				<Table
					ref="table"
					:data="shuttledDate"
					:columns="rightListHeader"
					border
					:height="tableHeight"
					highlight-row
					@on-row-dblclick="handleDbRebackRowClick"
					@on-row-click="handleCurrentRowRebackClick"
					@on-select="handleSelectionRebackChange"
					@on-select-all="handleSelectionRebackChange"
					class="quota-checked-table"
					row-key="name"
				>
					<!-- 是否为必过站 -->
					<template #isRequired="{ row, index }">
						<Checkbox v-model="shuttledDate[index].isRequested"></Checkbox>
					</template>
				</Table>
			</div>
		</div>
	</div>
</template>

<script>
import Sortable from "sortablejs"; // 拖拽功能插件
export default {
	data() {
		return {
			tableHeight: this.$attrs.tHeight, // 表格高度
			rtWidth: this.$attrs.rWidth, // 右侧表格宽度
			ltWidth: this.$attrs.lWidth, // 左侧表格宽度
			rowKeyName: this.$attrs.only, // 穿梭列表的关键字
			rightListHeader: this.$attrs.rTableHeaderList, // 右侧表头内容显示
			leftListHeader: this.$attrs.lTableHeaderList, // 左侧表头内容显示
			dateLoading: false,
			originDate: [],
			shuttledDate: [],
			shuttledDateTemp: [], //临时存储 穿梭框 数据 防止穿梭框中input框数值改变导致实时的不可编辑
			checkedQuotaList: [],
			hasTransferedList: [],
			rebackQuotaList: [],
			getIndex: "",
		};
	},
	props: {
		isShowDateList: Array,
		isSelectDateList: Array,
		isSort: Boolean,
	},
	watch: {
		isSort() {
			this.setSort();
		},
		// 监听到的shuttledDate传出
		shuttledDate: {
			handler(arr) {
				this.$emit("curCheckedShuttleDates", arr);
			},
			immediate: true,
			deep: true,
		},
		isShowDateList() {
			this.originDate = this.isShowDateList;
			this.$nextTick(() => {
				this.originDate.forEach((item, index) => {
					this.shuttledDate.forEach((shutItem) => {
						if (shutItem.processName === item.name) {
							this.originDate[index]._disabled = true;
							this.originDate[index]._checked = true;
						}
					});
				});
				this.originDate = JSON.parse(JSON.stringify(this.originDate));
				console.log(this.originDate, this.shuttledDate);
			});
		},
		isSelectDateList() {
			this.shuttledDate = this.isSelectDateList;
			this.hasTransferedList = this.shuttledDate;
		},
	},
	methods: {
		// 对象数组去重
		objectArrayReset(arr, val) {
			let result = [];
			let obj = [];
			result = arr.reduce(function (prev, cur) {
				obj[cur[val]] ? "" : (obj[cur[val]] = true && prev.push(cur));
				return prev;
			}, []);
			return result;
		},
		// 穿梭至右侧
		handleTransferRightClick() {
			let arr = JSON.parse(JSON.stringify(this.originDate));
			if (this.checkedQuotaList.length) {
				if (arr.length) {
					arr.map((info) => {
						this.checkedQuotaList.map((item) => {
							if (info[this.rowKeyName] === item[this.rowKeyName]) {
								info._disabled = true;
								info._checked = true;
								item._checked = false;
								item.processName = item.name;
							}
						});
					});
				}
			}
			this.originDate = JSON.parse(JSON.stringify(arr));
			console.log("this.checkedQuotaList", this.checkedQuotaList);
			this.hasTransferedList = this.hasTransferedList.concat(this.checkedQuotaList);
			this.shuttledDate = this.objectArrayReset(this.hasTransferedList, this.rowKeyName);
		},
		// 穿梭至左侧
		handleTransferLeftClick() {
			let arr = JSON.parse(JSON.stringify(this.originDate));
			if (this.rebackQuotaList.length) {
				if (arr.length) {
					arr.map((info) => {
						this.rebackQuotaList.map((item) => {
							if (info[this.rowKeyName] === item[this.rowKeyName]) {
								info._disabled = false;
								info._checked = false;
							}
						});
					});
				}
			}
			this.originDate = arr;
			let rebackArr = JSON.parse(JSON.stringify(this.rebackQuotaList));
			let rebackArrId = [];
			rebackArr.map((item) => {
				rebackArrId.push(item[this.rowKeyName]);
			});
			this.shuttledDate = this.shuttledDate.filter((item) => {
				return !new Set(rebackArrId).has(item[this.rowKeyName]);
			});
			// 撤回同时撤回进入的数组值
			this.hasTransferedList = this.shuttledDate;
		},
		// 选择行发生变化
		handleCurrentRowClick(row, column) {
			let curCheckedList = [];
			this.originDate.map((item) => {
				// item._checked = false
				this.shuttledDate.map((info) => {
					if (item[this.rowKeyName] === info[this.rowKeyName]) item._checked = true;
					if (info[this.rowKeyName] === row[this.rowKeyName]) curCheckedList.push(info);
				});
			});
			if (!row._checked) {
				row._checked = true;
			}
			this.checkedQuotaList = [];
			this.checkedQuotaList = this.originDate.filter((item) => item._checked);
		},
		// 批量选择指标
		handleSelectionChange(arr) {
			this.checkedQuotaList = [];
			this.originDate.map((item) => {
				arr.map((info) => {
					info._checked = true;
					if (item[this.rowKeyName] === info[this.rowKeyName]) {
						info._disabled = true;
						info._checked = true;
						item._checked = false;
						item.processName = item.name;
					}
				});
			});
			this.checkedQuotaList = arr;
			console.log("---------", this.checkedQuotaList);
		},
		// 批量撤回
		handleSelectionRebackChange(arr) {
			this.rebackQuotaList = [];
			this.rebackQuotaList = arr;
		},
		// 双击穿梭右侧
		handleDbRowClick(row, index) {
			this.getIndex = index;
			this.originDate[index] = { ...row, _disabled: true, _checked: true };
			this.originDate = JSON.parse(JSON.stringify(this.originDate));
			this.hasTransferedList = this.hasTransferedList.concat([{ ...row, _disabled: false, _checked: false }]);
			this.shuttledDate = this.objectArrayReset(this.hasTransferedList, this.rowKeyName);
		},
		// 双击穿梭返回
		handleDbRebackRowClick(row) {
			let rowCurIndex = null;
			if (this.shuttledDate.length) {
				this.shuttledDate.map((item, index) => {
					if (item[this.rowKeyName] === row[this.rowKeyName]) rowCurIndex = index;
				});
				this.shuttledDate.splice(rowCurIndex, 1);
			}

			let arr = JSON.parse(JSON.stringify(this.originDate));
			if (arr.length) {
				arr.map((info) => {
					if (info[this.rowKeyName] === row[this.rowKeyName]) {
						info._disabled = false;
						info._checked = false;
					}
				});
			}
			this.originDate = arr;
			// 撤回同时撤回进入的数组值
			this.hasTransferedList = this.shuttledDate;
		},
		// 单条选择指标撤回
		handleCurrentRowRebackClick(row) {
			this.rebackQuotaList = [];
			this.rebackQuotaList.push(row);
		},
		// 表格行特殊处理=>选中之后显示的表格行背景色
		tableRowClassName(row, index) {
			row.index = index;
			if (row._disabled) {
				return "checked-row";
			} else {
				return "checked-reback";
			}
		},
		// 特殊处理=>双击行，切换到其他行时，前面选中行背景色的变换
		changeTrStyle({ rowIndex }) {
			if (this.getIndex === rowIndex) {
				return {
					"background-color": "#EEF2FD", // EEF2FD
				};
			}
		},
		/**
		 * 排序方法
		 */
		setSort() {
			const el = this.$refs.table.$el.querySelectorAll(".ivu-table-body > table > tbody")[0];
			this.sortable = Sortable.create(el, {
				ghostClass: "sortable-ghost",
				setData: function (dataTransfer) {
					dataTransfer.setData("Text", "");
				},
				onEnd: (evt) => {
					const targetRow = this.shuttledDate.splice(evt.oldIndex, 1)[0];
					this.shuttledDate.splice(evt.newIndex, 0, targetRow);
				},
			});
		},
	},
};
</script>

<style lang="less" scoped>
.shuttle-column {
	h1 {
		font-size: 16px;
		font-style: normal;
	}
	.btns {
		text-align: left;
		padding: 10px 0;
	}
	.el-button {
		width: 88px;
	}
	.transfer-colomn {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.transfer-icons {
		width: 70px;
		height: 500px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		p {
			width: 70px;
			height: 24px;
			line-height: 24px;
			text-align: center;
			cursor: pointer;
			border-radius: 2px;
			background-color: transparent;
			color: #21a6ff;
			border: 1px solid #64a2cc;
			box-sizing: border-box;
			&:hover {
				background-color: "#21a6ff";
				border: 1px solid "#21a6ff";
			}
		}
		.to-left {
			margin-top: 10px;
		}
	}
	.add-btns {
		background-color: transparent;
		text-align: right;
		padding-right: 0;
		padding-top: 10px;
	}
}
p {
	margin: 0;
	padding: 0;
	min-height: 0.2rem;
}
.text {
	line-height: 40px;
}
.shuttle-column {
	.ivu-table-tbody .checked-row {
		background-color: #f8f8f8fa;
		color: #999;
	}
	.ivu-table-tbody .checked-reback {
		background-color: #ffffff;
	}
}
</style>
