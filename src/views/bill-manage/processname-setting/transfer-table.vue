<template>
	<div class="home">
		<ShuttleTable
			:originShuttleDate="shuttleTableList"
			:selectData.sync="selectData"
			:ifNeedClear="ifNeedClearFlag"
			:keyValue="keyName"
			:tableHeight="tbHeight"
			:rtWidth="rWidth"
			:ltWidth="lWidth"
			:lTableHeader="lTableHeaderList"
			:rTableHeader="rTableHeaderList"
			:isSort="isSort"
			@change="checkedShuttleDates"
		></ShuttleTable>
	</div>
</template>

<script>
import ShuttleTable from "./maintain/ShuttleTable.vue";
export default {
	components: { ShuttleTable },
	name: "TransferTable",
	props: {
		shuttleDate: Array,
		selectData: Array,
		rTableHeaderList: Array,
		lTableHeaderList: Array,
		isSort: Boolean,
		rWidth: String,
		lWidth: String,
	},
	watch: {
		shuttleDate() {
			this.shuttleTableList = this.shuttleDate;
		},
	},
	data() {
		return {
			shuttleTableList: [], // 表格原始数据
			ifNeedClearFlag: false, // 是否需要清除按钮
			keyName: "name", // 唯一关键字标志
			tbHeight: "500", // 表格高度
		};
	},
	created() {},
	methods: {
		// 获取到的选中项
		checkedShuttleDates(arr) {
			this.$emit("update:selectData", arr);
		},
	},
};
</script>

<style lang="less" scoped>
html,
body,
p {
	margin: 0;
	padding: 0;
}
</style>
