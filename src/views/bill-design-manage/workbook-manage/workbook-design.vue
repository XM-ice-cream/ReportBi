<template>
	<div class="workbook-container">
		<div class="left-box">
			<Input v-model="submitData.filterTable" placeholder="请筛选信息" clearable suffix="ios-search" />
			<Tree :data="data" :load-data="loadData" :render="renderContent" @on-contextmenu="handleContextMenu">
				<template #contextMenu>
					<DropdownItem>编辑</DropdownItem>
					<DropdownItem style="color: #ed4014">删除</DropdownItem>
				</template>
			</Tree>
			<!-- <Tabs value="tabValue">
				<TabPane label="数据" name="data">标签一的内容</TabPane>
				<TabPane label="分析" name="analyse">标签二的内容</TabPane>
			</Tabs> -->
		</div>
		<div class="center-box">
			<div class="filter" :draggable="true" @dragover.native.prevent="filterDragEnd($event)">
				<div class="title">筛选器</div>
				<span v-for="(item, index) in filterData" :key="index">{{ item.title }}</span>
			</div>
			<div class="mark">
				<div class="title">标记</div>
				<Select v-model="submitData.chartType" clearable placeholder="请选择图表">
					<Option v-for="item in chartList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
				<div class="mark-box">
					<div class="color box-cell"><Icon custom="iconfont icon-yansefangan" />颜色</div>
					<div class="size box-cell"><Icon custom="iconfont icon-daxiao" />大小</div>
					<div class="tag box-cell"><Icon custom="iconfont icon-biaojibiaoqian" />标签</div>
					<div class="detail-info box-cell"><Icon type="ios-more" />详细信息</div>
				</div>
			</div>
		</div>
		<div class="right-box"></div>
	</div>
</template>
<script>
export default {
	name: "workbook-design",
	data() {
		return {
			tabValue: "data",
			submitData: {
				filterTable: "",
				chartType: "",
			},
			dragstartNode: "",
			dragstartData: "",
			contextData: "", //菜单
			data: [
				{
					title: "APS_BASE_INFO",
					children: [
						{ title: "Workdayid", contextmenu: true },
						{ title: "ID", contextmenu: true },
						{ title: "CreateDate", contextmenu: true },
						{ title: "OPT1", contextmenu: true },
						{ title: "OPT2", contextmenu: true },
					],
					loading: false,
				},
				{ title: "自定义SQL查询", children: [{ title: "WorkOrder" }] },
			],
			chartList: [
				{ label: "表格", value: "table" },
				{ label: "柱状图", value: "bar" },
				{ label: "折线图", value: "line" },
				{ label: "饼图", value: "pie" },
				{ label: "散点图", value: "scatter" },
				{ label: "盒须图", value: "boxplot" },
			],
			filterData: [],
		};
	},
	activated() {},
	methods: {
		handleContextMenu(data) {
			this.contextData = data;
		},
		loadData(item, callback) {
			console.log(item);
			const data = [
				{
					title: "children",
					loading: false,
					children: [],
				},
				{
					title: "children",
					loading: false,
					children: [],
				},
			];
			callback(data);
		},
		renderContent(h, { root, node, data }) {
			if (!node.children) {
				return h(
					"span",
					{
						class: { "children-tree": true },
						style: {
							display: "inline-block",
							width: "100%",
							fontWeight: "normal",
							color: "#000010",
						},
						attrs: {
							draggable: "true",
						},
						on: {
							dragstart: () => this.handleDragStart(root, node, data),
							dragover: () => this.handleDragOver(root, node, data),
							dragend: () => this.handleDragEnd(root, node, data),
							drop: () => this.handleDrop(root, node, data),
						},
					},
					[
						h("span", data.title),
						h("Button", {
							props: Object.assign({}, this.buttonProps, {
								icon: "ios-arrow-down",
							}),
							style: {
								marginRight: "8px",
								border: "none",
								background: "transparent",
								boxShadow: "none !important",
							},
							on: {
								click: () => {
									this.append(data);
								},
							},
						}),
					]
				);
			} else {
				return h("span", [
					h("span", [
						h("Icon", {
							props: {
								type: "md-apps",
							},
							style: {
								marginRight: "8px",
								fontSize: "14px",
							},
						}),
						h("span", data.title),
					]),
				]);
			}
		},

		handleDragStart(root, node, data) {
			console.log("开始拖拽", node, data);
			const event = window.event || arguments[0];
			this.dragstartNode = node;
			this.dragstartData = data;
		},
		handleDragOver(root, node, data) {
			const event = window.event || arguments[0];
			event.preventDefault();
		},
		handleDragEnd(root, node, data) {
			const event = window.event || arguments[0];
			console.log("拖拽结束", event);

			event.preventDefault();
		},
		handleDrop(root, node, data) {
			const event = window.event || arguments[0];

			event.preventDefault();

			// if (node === this.dragstartNode) return;
			// const target_parentKey = root.find((el) => el === node).parent;
			// const target_parent = root.find((el) => el.nodeKey === target_parentKey).node;
			// const target_index = target_parent.children.indexOf(data);
			// const target_children = data.children || [];
			// target_children.push(this.dragstartData);
			// this.$set(data, "children", target_children);

			// const source_parentKey = root.find((el) => el === this.dragstartNode).parent;
			// const source_parent = root.find((el) => el.nodeKey === source_parentKey).node;
			// const source_index = source_parent.children.indexOf(this.dragstartData);
			// source_parent.children.splice(source_index, 1);
			// console.log(this.data5, "data5");
		},
		//===================过滤器
		filterDragEnd() {
			console.log("拖拽结束");
			this.filterData.push(this.dragstartData);
		},
	},
};
</script>
<style scoped lang="less">
.workbook-container {
	display: flex;
	height: calc(100% - 20px);
	margin: 10px;
	.left-box {
		width: 300px;
		padding: 10px;
		border: 1px solid #27ce88;
		background: #f8fffc;
	}
	.center-box {
		width: 200px;
		height: 100%;
		margin-left: 10px;
		.filter {
			width: 100%;
			height: 200px;
			padding: 10px;
			border: 1px dashed #ccc;
			border-bottom: none;
		}
		.mark {
			width: 100%;
			height: calc(100% - 200px);
			padding: 10px;
			border: 1px dashed #ccc;
			.mark-box {
				display: flex;
				flex-wrap: wrap;
				margin-top: 10px;
				.box-cell {
					width: calc(50% - 10px);
					height: 50px;
					line-height: 1;
					text-align: center;
					border: 1px solid #d4d4d4;
					margin: 5px;
					padding: 4px;
					cursor: pointer;
					i {
						display: inline-block;
						font-size: 25px;
						width: 100%;
					}
					&:hover {
						border: 1px solid #000;
					}
				}
			}
		}
		.title {
			padding: 4px;
			background: #82c43e;
			color: #fff;
			text-align: center;
			margin-bottom: 5px;
		}
	}
	.right-box {
		flex: 1;
	}
}
:deep(.ivu-tree ul) {
	list-style: none;
	margin: 0;
	font-size: 12px;
	font-weight: bold;
	color: #000;
}
:deep(.ivu-tree-title.ivu-tree-title-selected, .ivu-tree-title:hover) {
	color: #fff;
}
:deep(.ivu-tree-title) {
	border-radius: 0px;
	span {
		display: inline-block;
		width: 90%;
	}
}
:deep(.ivu-tree-children .ivu-tree-title) {
	width: 90%;
	height: 18px;
	line-height: 18px;
	border-radius: 10px;
	padding-left: 10px;
	&:hover {
		background: #4795b3;
		color: #fff;
		border-radius: 10px;
	}
}
:deep(.ivu-tree-title.ivu-tree-title-selected, .ivu-tree-title:hover) {
	background-color: #4795b3;
}
</style>
