<template>
	<Modal :title="modalTitle" :mask-closable="false" :closable="true" v-model="modalFlag" fullscreen :before-close="closeDialog">
		<div class="modal-content">
			<Split v-model="splitValue">
				<div slot="left" class="left-box">
					<Form ref="submitRef" :model="submitData">
						<label class="name-label">数据源：</label>
						<FormItem prop="sourceCode">
							<Select v-model.trim="submitData.sourceCode" size="small" placeholder="请选择数据源">
								<Option v-for="item in sourceList" :key="item.sourceName" :label="item.sourceName" :value="item.sourceCode" />
							</Select>
						</FormItem>
						<label class="name-label">筛选表名称：</label>
						<FormItem prop="filterTable">
							<Input v-model="submitData.filterTable" :placeholder="$t('pleaseEnter') + $t('表名称')" @on-search="pageLoad" />
						</FormItem>
					</Form>
					<!-- 树 -->
					<div class="left-tree">
						<ul>
							<li v-for="(item, index) in treeData" :key="index">{{ item.title }}</li>
						</ul>
					</div>
				</div>
				<div slot="right" class="right-box">Right Pane</div>
			</Split>
		</div>
		<div slot="footer" class="dialog-footer">
			<Button @click="closeDialog">取消</Button>
			<Button type="primary" @click="submitClick()">提交</Button>
		</div>
	</Modal>
</template>
<script>
import { getAllDatasourceReq } from "@/api/bill-design-manage/data-set.js";

export default {
	name: "DataSetConfigAddEdit",
	components: {},
	props: {
		modalFlag: {
			required: true,
			type: Boolean,
			default: false,
		},
	},
	watch: {
		modalFlag(newVal) {
			if (newVal) {
				this.getDataSourceList(); //获取数据源
			}
		},
	},
	data() {
		return {
			modalTitle: "数据集配置",
			submitData: {},
			splitValue: 0.2,
			sourceList: [], //数据源集合
			treeData: [{ title: "parent" }, { title: "parent" }],
		};
	},
	methods: {
		//获取数据
		pageLoad() {},
		//提交
		submitClick() {},

		//获取数据源下拉框
		getDataSourceList() {
			const obj = { sourceType: "" };
			getAllDatasourceReq(obj).then((res) => {
				if (res.code === 200) {
					this.sourceList = res?.result || [];
				}
			});
		},

		// 关闭模态框
		closeDialog() {
			this.$emit("update:modalFlag", false);
		},
	},
};
</script>
<style lang="less" scoped>
.modal-content {
	height: 100%;
	.left-box {
		height: 100%;
		padding: 10px;
		.name-label {
			margin: 5px 0;
			display: inline-block;
			font-weight: bold;
		}
		.left-tree {
			height: calc(100% - 150px);
			padding: 10px;
			overflow-y: auto;
			li {
				list-style: none;
				padding-bottom: 10px;
			}
		}
	}
	.right-box {
		height: 100%;
	}
}
:deep(.ivu-split-trigger-bar-con.vertical) {
	display: none;
}
:deep(.ivu-split-trigger-vertical) {
	width: 15px;
	border: none;
	border-right: 1px solid #d7d7d7;
}
:deep(.left-pane) {
	background: #f8f8f9;
}
:deep(.ivu-tree) {
	height: calc(100% - 135px);
}
</style>
