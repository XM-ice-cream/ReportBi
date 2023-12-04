<template>
	<div class="workbook-base-info">
		<div v-for="item in baseInfos" class="content">
			<span class="term">{{ item.name }}：</span>
			<span class="value">{{ selectObj[item.key] || selectObj[item.othersKey] }}</span>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		selectObj: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			baseInfos: [
				{
					name: "表名",
					key: "labelName",
					othersKey: "tableName",
				},
				{
					name: "列名",
					key: "columnName",
					othersKey: "columnname",
				},
				{
					name: "字段类型",
					key: "columnType",
				},
			],
		};
	},
};
</script>
<style lang="less" scoped>
.workbook-base-info {
	.title {
		padding: 4px 10px;
		margin-bottom: 5px;
		position: relative;
		&::before {
			content: "";
			width: 4px;
			height: 15px;
			background: #27ce88;
			position: absolute;
			left: 0;
			top: 6px;
		}
	}
	.content {
		margin-bottom: 0px;
		.term {
			display: inline-block;
			width: 14%;
			text-align: right;
			padding-right: 10px;
			font-weight: bold;
			padding: 5px 10px 5px 5px;
		}
	}
	.content:last-child {
		margin-bottom: 20px;
	}
}
</style>
