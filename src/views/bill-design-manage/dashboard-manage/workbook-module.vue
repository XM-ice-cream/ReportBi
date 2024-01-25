/* 单元格元素自定义按钮 */
<template>
	<div class="design-workbook">
		<!-- 左侧抽屉 -->
		<Drawer v-model="drawerFlag" title="添加组件" width="300" :mask="false" placement="left" @on-close="cancelClick" class-name="workbook-drawer">
			<!-- 筛选工作簿名称 -->
			<Input
				v-model="leftForm.filterWorkbook"
				suffix="ios-search"
				placeholder="筛选工作簿名称"
				clearable
				@keyup.native="filterData"
				style="margin-bottom: 10px"
			/>
			<div class="content">
				<span v-for="item in filterList"
					><icon custom="iconfont icon-liebiaotubiao" />
					<div class="name textOverhidden">{{ item.workBookName }}</div></span
				>
			</div>
		</Drawer>
	</div>
</template>

<script>
import { getpagelistReq as getWorkbookListReq } from "@/api/bill-design-manage/workbook-manage.js";

export default {
	name: "workbook-module",
	components: {},
	props: {
		formData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			leftForm: {},
			drawerFlag: false,
			workbookList: [],
			filterList: [],
		};
	},
	watch: {
		drawerFlag(newValue) {
			if (newValue) {
				this.getWorkbookList();
			}
		},
		formData: {
			handler() {
				this.leftForm = { ...this.formData };
			},
			deep: true,
		},
	},
	mounted() {},
	methods: {
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
		},
		//获取对应数据集的工作簿
		getWorkbookList() {
			const obj = {
				orderField: "createDate",
				ascending: true,
				pageSize: 3000,
				pageIndex: 1,
				data: {
					datasetId: this.leftForm.datasetId,
				},
			};
			getWorkbookListReq(obj).then((res) => {
				this.workbookList = res?.result?.data || [];
				this.$nextTick(() => this.filterData());
				console.log("this.workbookList", this.workbookList);
			});
		},
		//筛选搜索出来的工作簿
		filterData() {
			const keyWord = this.leftForm.filterWorkbook?.toUpperCase() || "";
			const reg = new RegExp(keyWord, "i");
			const arr = [];
			this.workbookList.forEach((item) => {
				if (reg.test(item.workBookName)) {
					arr.push(item);
				}
			});
			this.filterList = arr;
		},
	},
};
</script>
<style>
.workbook-drawer {
	top: 70px;
}
.workbook-drawer .ivu-drawer-left {
	top: 75px;
}
.workbook-drawer .ivu-drawer-header-inner {
	color: #091e40;
	font-size: 16px;
	font-weight: bold;
}
.workbook-drawer .ivu-drawer-header {
	background: #fff;
	border-bottom: none;
}
.workbook-drawer .ivu-drawer-header-inner::before {
	display: none;
}
.workbook-drawer .ivu-drawer-body .content {
	height: calc(100% - 100px);
	overflow: auto;
}
.workbook-drawer .ivu-drawer-body .content span {
	width: 100%;
	padding: 5px 10px;
	color: #000;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	cursor: pointer;
}
.workbook-drawer .ivu-drawer-body .content span:hover {
	background: #edeff1;
}
.workbook-drawer .ivu-drawer-body .content span i {
	margin-right: 5px;
}
.workbook-drawer .ivu-drawer-body .content span .name {
	width: calc(100% - 25px);
}
</style>
<style scoped lang="less"></style>
