<template>
	<div>
		<!-- 左侧抽屉 -->
		<Drawer class="reply-maverick" v-model="drawerFlag" title="回复明细" width="500" :mask-closable="false" @on-close="cancelClick">
			<Timeline>
				<TimelineItem v-for="(item, index) in parmas" :key="index">
					<p class="name">{{ item.name }}</p>
					<p class="content" v-for="(childItem, childIndex) in item.children" :key="'child' + childIndex">
						{{ childItem.name }}: {{ row[childItem.key] }}
					</p>
				</TimelineItem>
			</Timeline>
		</Drawer>
	</div>
</template>
<script>
import { formatDate } from "@/libs/tools";

export default {
	props: {
		// row: Object
	},
	data() {
		return {
			formatDate: formatDate,
			parmas: [
				{
					name: "FA",
					children: [
						{ name: "回复人员", key: "fA_EMPNO" },
						{ name: "回复时间", key: "fA_TIME" },
						{ name: "回复信息", key: "fA_MSG" },
					],
				},
				{
					name: "CA",
					children: [
						{ name: "回复人员", key: "cA_EMPNO" },
						{ name: "回复时间", key: "cA_TIME" },
						{ name: "回复信息", key: "cA_MSG" },
					],
				},
				{
					name: "Q",
					children: [
						{ name: "回复人员", key: "q_EMPNO" },
						{ name: "回复时间", key: "q_TIME" },
						{ name: "回复信息", key: "q_MSG" },
					],
				},
			],
			drawerFlag: false,
			row: {},
		};
	},
	watch: {
		row() {},
	},
	methods: {
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
		},
		pageLoad(row) {
			this.drawerFlag = true;
			this.row = { ...row };
		},
	},
};
</script>
<style scoped lang="less">
.expand-row {
	margin-bottom: 16px;
	.expand-key {
		font-weight: bold;
		display: inline-block;
		width: 6rem;
		text-align: right;
		padding-right: 0.8rem;
	}
}
.expand-row .ivu-col {
	padding: 0.3rem 1rem;
}
.name {
	font-size: 1.12rem;
	font-weight: bold;
}
.content {
	font-size: 0.14rem;
	margin-bottom: 0.3rem;
}
</style>
