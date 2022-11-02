/* 添加计算逻辑函数 */
<template>
	<transition name="slide-down">
		<div v-show="drawerFlag" class="transition-box">
			<Card style="width: 100%">
				<template #title>
					<Icon type="ios-film-outline"></Icon>
					CellItem 属性注解
				</template>
				<ul class="cell-item-ul">
					<li v-for="item in cellItemList">{{ item }}</li>
				</ul>
			</Card>
		</div>
	</transition>
</template>

<script>
export default {
	name: "cellItem-explain",
	props: {
		drawerFlag: {
			type: Boolean,
			default: () => false,
		},
	},
	computed: {},
	watch: {
		drawerFlag() {
			console("drawerFlag", this.drawerFlag);
		},
	},
	data() {
		return {
			cellItemList: [
				"数据集编码 （禁止修改）",
				"public string setCode { get; set; }",
				"数据集中的key，拖拽过来的值（禁止修改）",
				"public string setKey { get; set; }",
				"行",
				"public int row { get; set; } = -1;",
				"列",
				"public int column { get; set; } = -1;",
				"行合并",
				"public int rowMerge { get; set; } = -1;",
				"列合并",
				"public int columnMerge { get; set; } = -1;",
				"原始行（禁止修改）",
				"public int coordinateRow { get; set; } = -1;",
				"原始列（禁止修改）",
				"public int coordinateColumn { get; set; } = -1;",
				"值",
				"public string value { get; set; }",
				"值类型（禁止修改）",
				"public string valueType { get; set; } = 'string';",
			],
		};
	},
	mounted() {},
	methods: {},
};
</script>

<style scoped lang="less">
.cell-item-ul {
	> li:nth-child(2n-1) {
		padding: 10px 0 0;
		font-size: 14px;
		font-weight: bold;
		list-style-type: square;
	}
	> li:nth-child(2n) {
		list-style: none;
	}
}
</style>
