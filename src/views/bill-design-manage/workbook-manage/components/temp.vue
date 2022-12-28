<template>
	<div style="height: calc(100% - 30px)">
		<component :is="type" :value="value" :ispreview="true" :visib="visib" />
	</div>
</template>

<script>
import componentTable from "./component-table.vue";
import componentBar from "./component-bar.vue"; //柱状图
import componentLine from "./component-line.vue"; //折线图
import componentPie from "./component-pie.vue"; //饼图
import componentScatter from "./component-scatter.vue"; //散点图
import componentBoxplot from "./component-boxplot.vue"; //箱线图

export default {
	name: "componentsTemp",
	components: { componentTable, componentBar, componentLine, componentPie, componentScatter, componentBoxplot },
	model: {
		prop: "value",
		event: "input",
	},
	props: {
		type: String,
		visib: Boolean,
		value: {
			type: [Object],
			default: () => {},
		},
	},
	watch: {
		visib() {
			console.log("temp", this.visib);
		},
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {},
};
</script>

<style scoped lang="less"></style>
