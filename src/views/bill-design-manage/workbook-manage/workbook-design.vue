<template>
	<div class="workbook-container">
		<div class="left-box">
			<Input v-model="submitData.filterTable" placeholder="请筛选信息" clearable suffix="ios-search" />
			<ul class="tree">
				<li v-for="(item, index) in data" :key="index" class="tree-father">
					<div @click="item.isShow = !item.isShow">
						<Icon type="ios-arrow-forward" :style="{ transform: item.isShow ? 'rotate(90deg)' : 'rotate(0deg)' }" />
						<Icon type="md-apps" /> {{ item.title }}
					</div>

					<ul class="subtree" v-if="item.isShow">
						<draggable v-model="item.children" :group="{ name: 'site', pull: 'clone', put: 'false' }" style="height: 99%" @end="treeDragEnd">
							<li class="subtree-li" v-for="(subitem, subIndex) in item.children" :key="subIndex">
								{{ subitem.title }}
								<Dropdown style="float: right" trigger="contextMenu" @on-click="(name) => dropDownClick(name, subitem)">
									<Icon type="ios-arrow-down"></Icon>
									<template #list>
										<DropdownMenu>
											<DropdownItem name="createField">创建计算字段</DropdownItem>
										</DropdownMenu>
									</template>
								</Dropdown>
							</li>
						</draggable>
					</ul>
				</li>
			</ul>
		</div>
		<div class="center-box">
			<div class="filter">
				<div class="title">筛选器</div>
				<draggable group="site" v-model="filterData" id="filter" style="height: 99%" @end="filterDragEnd">
					<span v-for="(item, index) in filterData" :key="index" class="drag-cell">{{ item.title }}</span>
				</draggable>
			</div>
			<div class="mark">
				<div class="title">标记</div>
				<Select v-model="submitData.chartType" clearable placeholder="请选择图表">
					<Option v-for="item in chartList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
				<div class="mark-box">
					<draggable group="site" v-model="markData" id="color" class="box-cell">
						<div class="color"><Icon custom="iconfont icon-yansefangan" />颜色</div>
					</draggable>
					<draggable group="site" v-model="markData" id="size" class="box-cell">
						<div class="size"><Icon custom="iconfont icon-daxiao" />大小</div>
					</draggable>
					<draggable group="site" v-model="markData" id="mark" class="box-cell">
						<div class="tag"><Icon custom="iconfont icon-biaojibiaoqian" />标签</div>
					</draggable>
					<draggable group="site" v-model="markData" id="info" class="box-cell">
						<div class="detail-info"><Icon type="ios-more" />详细信息</div>
					</draggable>
					<draggable group="site" v-model="markData" id="mark-box" @end="markDragEnd">
						<div v-for="(item, index) in markData" :key="index">
							<Icon custom="iconfont icon-yansefangan" v-if="item.innerText === 'color'" />
							<Icon custom="iconfont icon-daxiao" v-if="item.innerText === 'size'" />
							<Icon custom="iconfont icon-biaojibiaoqian" v-if="item.innerText === 'mark'" />
							<Icon type="ios-more" v-if="item.innerText === 'info'" />
							<div class="drag-cell">{{ item.title }}</div>
						</div>
					</draggable>
				</div>
			</div>
		</div>
		<div class="right-box">
			<div class="row-column">
				<div class="row">
					<span class="title">列</span>
					<draggable group="site" v-model="columnData" class="drag-right" id="column" @end="columnDragEnd">
						<span v-for="(item, index) in columnData" :key="index" class="drag-cell">{{ item.title }}</span>
					</draggable>
				</div>
				<div class="column">
					<span class="title">行</span>
					<draggable group="site" v-model="rowData" class="drag-right" id="row" @end="rowDragEnd">
						<span v-for="(item, index) in rowData" :key="index" class="drag-cell">{{ item.title }}</span>
					</draggable>
				</div>
				<div class="right-content">
					<div class="title">{{ submitData.title }}</div>
					<componentsTemp :type="submitData.chartType" :visib="true" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import draggable from "vuedraggable";
import componentsTemp from "./components/temp.vue";
export default {
	name: "workbook-design",
	components: { draggable, componentsTemp },
	data() {
		return {
			tabValue: "data",
			submitData: {
				filterTable: "",
				chartType: "componentTable",
				title: "工作表",
			},
			dragstartNode: "",
			dragstartData: "",
			contextData: "", //菜单
			data: [
				{
					title: "APS_BASE_INFO",
					isShow: false,
					children: [{ title: "Workdayid" }, { title: "ID" }, { title: "CreateDate" }, { title: "OPT1" }, { title: "OPT2" }],
				},
				{ title: "自定义SQL查询", isShow: false, children: [{ title: "WorkOrder" }] },
			],
			chartList: [
				{ label: "表格", value: "componentTable" },
				{ label: "柱状图", value: "bar" },
				{ label: "折线图", value: "line" },
				{ label: "饼图", value: "pie" },
				{ label: "散点图", value: "scatter" },
				{ label: "盒须图", value: "boxplot" },
			],
			filterData: [], //过滤值
			columnData: [], //列值
			rowData: [], //行值
			markData: [],
		};
	},
	activated() {},
	methods: {
		//下拉
		dropDownClick(name, row) {
			console.log("下拉", name, row);
		},
		filterDragEnd(e) {
			console.log("拖拽结束--过滤器", e);
			// this.filterData.splice(this.moveId, 1);
			if (e.to.id === "filter" && e.oldIndex === e.newIndex) {
				this.filterData.splice(e.oldIndex, 1);
			}
		},
		columnDragEnd(e) {
			console.log("拖拽结束--列", e);
			if (e.to.id === "column" && e.oldIndex === e.newIndex) {
				this.columnData.splice(e.oldIndex, 1);
			}
		},
		rowDragEnd(e) {
			console.log("拖拽结束--行", e);
			if (e.to.id === "row" && e.oldIndex === e.newIndex) {
				this.rowData.splice(e.oldIndex, 1);
			}
		},
		markDragEnd(e) {
			console.log("拖拽结束--标记", e);
			if (e.to.id === "mark-box" && e.oldIndex === e.newIndex) {
				this.markData.splice(e.oldIndex, 1);
			}
		},
		treeDragEnd(e) {
			console.log("拖拽结束--树", e);
			if (e.to.id === "color") {
				this.markData[e.newIndex].innerText = "color";
			}
			if (e.to.id === "size") {
				this.markData[e.newIndex].innerText = "size";
			}
			if (e.to.id === "mark") {
				this.markData[e.newIndex].innerText = "mark";
			}
			if (e.to.id === "info") {
				this.markData[e.newIndex].innerText = "info";
			}
			this.markData = JSON.parse(JSON.stringify(this.markData));
			console.log(this.markData);
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
		.tree {
			li {
				list-style: none;
			}
			.tree-father {
				padding: 10px 5px 0 5px;
				font-weight: bold;
			}
			.subtree {
				padding: 10px;
				font-weight: normal;
				.subtree-li {
					padding: 4px 15px;
					cursor: pointer;
					&:hover {
						background: #4795b3;
						color: #fff;
						border-radius: 10px;
					}
				}
			}
		}
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
		margin-left: 10px;
		.row-column {
			.row,
			.column {
				height: 40px;
				border: 1px solid #ccc;
				margin-bottom: 10px;
				.title {
					display: inline-block;
					width: 40px;
					line-height: 40px;
					font-weight: bold;
					text-align: center;
					border-right: 1px solid #ccc;
				}
				.drag-right {
					display: inline-block;
					width: calc(100% - 40px);
				}
			}
		}
		.right-content {
			.title {
				padding: 5px 10px;
				font-weight: bold;
				font-size: 18px;
			}
		}
	}
	.drag-cell {
		padding: 4px 20px;
		background: #4996b2;
		color: #fff;
		border-radius: 10px;
		margin: 4px;
		display: inline-block;
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
