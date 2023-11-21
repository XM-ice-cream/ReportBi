/**下拉框 */
<template>
	<Dropdown
		style="float: right"
		placement="right-end"
		trigger="click"
		@on-click="(name) => dropDownClick(name)"
		transfer
		transfer-class-name="workbook-dropdownTrs"
	>
		<Icon type="ios-arrow-down"></Icon>
		<template #list>
			<DropdownMenu>
				<!-- 编辑 -->
				<DropdownItem name="edit">编辑</DropdownItem>
				<DropdownItem name="" :class="selectClassType([''])">维度</DropdownItem>
				<Dropdown placement="right-end" transfer transfer-class-name="workbook-dropdownTrs-dropdown">
					<DropdownItem :class="selectClassType(['sum', 'avg', 'count', 'countDistinct', 'max', 'min', 'stdev'])">
						指标
						<Icon type="ios-arrow-forward"></Icon>
					</DropdownItem>
					<template #list>
						<DropdownMenu>
							<DropdownItem name="sum" :class="selectClassType(['sum'])">总和</DropdownItem>
							<DropdownItem name="avg" :class="selectClassType(['avg'])">平均值</DropdownItem>
							<DropdownItem name="count" :class="selectClassType(['count'])">计数</DropdownItem>
							<DropdownItem name="countDistinct" :class="selectClassType(['countDistinct'])">计数(不同)</DropdownItem>
							<DropdownItem name="max" :class="selectClassType(['max'])">最大值</DropdownItem>
							<DropdownItem name="min" :class="selectClassType(['min'])">最小值</DropdownItem>
							<DropdownItem name="stdev" :class="selectClassType(['stdev'])">标准差</DropdownItem>
						</DropdownMenu>
					</template>
				</Dropdown>
				<template v-if="data.dataType === 'DateTime'">
					<DropdownItem name="YYYY" :class="selectClassType(['YYYY'])">年</DropdownItem>
					<DropdownItem name="MM" :class="selectClassType(['MM'])">月</DropdownItem>
					<DropdownItem name="DD" :class="selectClassType(['DD'])">日</DropdownItem>
					<DropdownItem name="HH" :class="selectClassType(['HH'])">时</DropdownItem>
					<DropdownItem name="HM" :class="selectClassType(['HM'])">分</DropdownItem>
					<DropdownItem name="HMS" :class="selectClassType(['HMS'])">秒</DropdownItem>
					<DropdownItem name="Q" :class="selectClassType(['Q'])">季</DropdownItem>
					<DropdownItem name="WK" :class="selectClassType(['WK'])">周</DropdownItem>
				</template>
				<!-- 排序 -->
				<DropdownItem name="sortby" :class="data.sortBy && data.sortBy !== 0 ? [data.sortBy, 'dropdown-sortby-selected'] : ''">排序</DropdownItem>
				<!-- 连续 -->
				<DropdownItem name="continuous" :class="[[1].includes(data.isContinue) ? 'dropdown-selected' : '']">连续</DropdownItem>
				<!-- 离散 -->
				<DropdownItem name="discrete" :class="[[0].includes(data.isContinue) ? 'dropdown-selected' : '']">离散</DropdownItem>

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
		markIndex: [Number, String],
		type: String,
	},
	data() {
		return {};
	},
	methods: {
		//下拉选
		dropDownClick(name) {
			console.log("this.data", this.data);
			this.$emit("dropDownClick", name, this.data, this.index, this.markIndex, this.type);
		},
		//是否选中样式返回类
		selectClassType(item) {
			return item.includes(this.data.calculatorFunction) ? "dropdown-selected" : "";
		},
	},
};
</script>
<style>
.workbook-dropdownTrs .ivu-dropdown-menu .ivu-dropdown,
.workbook-dropdownTrs-dropdown .ivu-dropdown-menu .ivu-dropdown {
	width: 100%;
}
.workbook-dropdownTrs .ivu-dropdown-item,
.workbook-dropdownTrs-dropdown .ivu-dropdown-item {
	padding: 7px 16px 7px 32px;
}
</style>

<style lang="less" scoped>
.dropdown-selected {
	position: relative;
	&:before {
		content: "";
		width: 7px;
		height: 7px;
		position: absolute;
		background: #27ce88;
		left: 16px;
		top: 12px;
		border-radius: 50%;
	}
}
.dropdown-sortby-selected {
	position: relative;
	&:before {
		content: "\e750";
		font-family: "iconfont";
		position: absolute;
		color: #27ce88;
		left: 10px;
		top: 3px;
		font-size: 20px;
	}
}
.dropdown-sortby-selected.desc:before {
	transform: rotateZ(90deg);
}
.dropdown-sortby-selected.asc:before {
	transform: rotateZ(270deg);
}
.dropdown-sortby-selected.manual:before {
	transform: rotateZ(360deg);
}
</style>
