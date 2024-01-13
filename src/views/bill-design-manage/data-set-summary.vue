<template>
	<div style="height: 100%; position: relative">
		<dataSet ref="reportRef" v-if="req.type == 'Report'" :type.sync="req.type" />
		<dataSetConfig ref="biRef" v-else :type.sync="req.type" />
	</div>
</template>
<script>
import dataSet from "./data-set.vue";
import dataSetConfig from "./data-set-config.vue";
export default {
	components: { dataSet, dataSetConfig },
	name: "datasetSummary",
	data() {
		return {
			req: {
				type: "Report",
			},
		};
	},
	watch: {
		"req.type": {
			handler() {
				console.log("监听", this.req.type);
				this.$nextTick(() => {
					console.log(this.$refs.biRef);
					this.req.type == "BI" ? this.$refs.biRef.init() : this.$refs.reportRef.init();
				});
			},
			immediate: true,
		},
	},
};
</script>
<style lang="less" scoped>
.data-set-type {
	position: absolute;
	left: 83px;
	top: 18px;
}
:deep(.ivu-radio-group-button .ivu-radio-wrapper) {
	height: 30px;
	line-height: 28px;
}
</style>
