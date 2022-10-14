<template>
	<div>
		<TransferTabelMaintain
			:isShowDateList="isShowDateList"
			:isSelectDateList="isSelectDateList"
			:needClear="ifNeedClear"
			:only="keyValue"
			:tHeight="tableHeight"
			:rWidth="rtWidth"
			:lWidth="ltWidth"
			:lTableHeaderList="lTableHeader"
			:rTableHeaderList="rTableHeader"
			:isSort="isSort"
			@curCheckedShuttleDates="checkedShuttleDates"
		/>
	</div>
</template>

<script>
import TransferTabelMaintain from "./TransferTable.vue";
export default {
	name: "ShuttleTable",
	components: {
		TransferTabelMaintain,
	},
	props: {
		originShuttleDate: {
			type: Array,
			default: () => {
				return [];
			},
		},
		selectData: Array,
		ifNeedClear: {
			type: Boolean,
			default: false,
		},
		keyValue: {
			type: String,
			default: () => {
				return "";
			},
		},
		tableHeight: {
			type: String,
			default: () => {
				return "";
			},
		},
		rtWidth: {
			type: String,
			default: () => {
				return "";
			},
		},
		ltWidth: {
			type: String,
			default: () => {
				return "";
			},
		},
		lTableHeader: {
			type: Array,
			default: () => {
				return [];
			},
		},
		rTableHeader: {
			type: Array,
			default: () => {
				return [];
			},
		},
		isSort: Boolean,
	},
	watch: {
		originShuttleDate() {
			this.isShowDateList = this.originShuttleDate;
		},
		selectData() {
			this.isSelectDateList = this.selectData;
		},
	},
	data() {
		return {
			isShowDateList: [],
			isSelectDateList: [],
		};
	},
	methods: {
		// 穿梭框选中的数组
		checkedShuttleDates(arr) {
			this.$emit("change", arr);
		},
	},
};
</script>
