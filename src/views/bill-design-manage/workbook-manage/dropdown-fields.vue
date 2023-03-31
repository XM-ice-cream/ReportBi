/**下拉框 */
<template>
	<Dropdown style="float: right" @on-click="(name) => dropDownClick(name)">
		<Icon type="ios-arrow-down"></Icon>
		<template #list>
			<DropdownMenu>
				<!-- 编辑 -->
				<DropdownItem name="edit">编辑</DropdownItem>
				<DropdownItem name="">维度</DropdownItem>
				<Dropdown placement="right-start">
					<DropdownItem>
						指标
						<Icon type="ios-arrow-forward"></Icon>
					</DropdownItem>
					<template #list>
						<DropdownMenu>
							<DropdownItem name="sum">总和</DropdownItem>
							<DropdownItem name="avg">平均值</DropdownItem>
							<DropdownItem name="count">计数</DropdownItem>
							<DropdownItem name="countDistinct">计数(不同)</DropdownItem>
							<DropdownItem name="max">最大值</DropdownItem>
							<DropdownItem name="min">最小值</DropdownItem>
							<DropdownItem name="stdev">标准差</DropdownItem>
						</DropdownMenu>
					</template>
				</Dropdown>
				<!-- 排序 -->
				<DropdownItem name="sortby">排序</DropdownItem>
				<!-- 删除 -->
				<DropdownItem name="delete">移除</DropdownItem>
			</DropdownMenu>
		</template>
	</Dropdown>
</template>
<script>
export default {
	name: "dropdown-fields",
	components: {},
	props: {
		data: Object,
		index: Number,
		markIndex: Number,
		type: String,
	},
	data() {
		return {};
	},
	methods: {
		//下拉选
		dropDownClick(name) {
			this.$emit("dropDownClick", name, this.data, this.index, this.markIndex, this.type);
		},
	},
};
</script>
<style lang="less" scoped></style>
