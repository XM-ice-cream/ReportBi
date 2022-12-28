<template>
	<div>
		<component :is="type" :value="value" :ispreview="true" :visib="visib" />
	</div>
</template>

<script>
import componentTable from "./component-table.vue";
export default {
	name: "componentsTemp",
	components: { componentTable },
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
