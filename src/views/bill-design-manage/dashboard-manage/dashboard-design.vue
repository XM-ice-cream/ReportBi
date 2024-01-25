/* 仪表板设计界面 */
<template>
	<div class="dashboard-design">
		<div class="head">
			<span>{{ req.dashboardName }}</span>
			<div class="head-right">
				<!-- 返回按钮 -->
				<Button @click="turnBack" title="返回">
					<Icon custom="iconfont icon-arrows_left" />
				</Button>
			</div>
		</div>
		<div class="head-tools">
			<span @click="toolsClick('workbook')"><icon custom="iconfont icon-chartnew" />工作簿</span>
		</div>
		<WorkbookModule ref="workbookmodule" :formData="req" />
	</div>
</template>

<script>
import WorkbookModule from "./workbook-module.vue";

export default {
	components: { WorkbookModule },
	name: "dashboard-design",
	data() {
		return {
			req: {},
		};
	},
	mounted() {
		this.req = JSON.parse(window.localStorage.getItem("dashboardObj"));
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		//工具栏点击
		toolsClick(type) {
			if (type === "workbook") {
				this.$refs.workbookmodule.drawerFlag = true;
			}
		},
		//返回
		turnBack() {
			this.$router.go(-1);
		},
	},
};
</script>
<style></style>
<style scoped lang="less">
.dashboard-design {
	height: 100%;
	background-color: #f5f7f9;
	.head {
		height: 40px;
		background: #eef1f6;
		padding: 0 20px;
		line-height: 40px;
		font-size: 18px;
		color: #091e40;
		font-weight: bold;
		.head-right {
			display: inline-block;
			float: right;
		}
	}
	.head-tools {
		height: 30px;
		background: #fff;
		padding: 0 20px;
		line-height: 30px;
		span {
			display: inline-block;
			text-align: center;
			color: #1ecd83;
			height: 100%;
			cursor: pointer;
			padding: 0 5px;
			i {
				margin-right: 5px;
				font-size: 16px;
				vertical-align: middle;
			}
			&:hover {
				background: #edeff1;
			}
		}
	}
}
</style>
