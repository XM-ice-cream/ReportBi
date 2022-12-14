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
							<Input v-model="submitData.filterTable" :placeholder="$t('pleaseEnter') + '表名称'" @on-search="pageLoad" />
						</FormItem>
					</Form>
					<!-- 树 -->
					<div class="left-tree">
						<ul>
							<li v-for="(item, index) in treeData" :key="index" draggable @dragend="addNodeImage($event, item)">
								<Icon custom="iconfont icon-biaodanzujian-biaoge" class="icon" />{{ item.title }}
							</li>
						</ul>
					</div>
				</div>
				<div slot="right" class="right-box">
					<div id="table-box" ref="tablebox"></div>
				</div>
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
import G6 from "@antv/g6";
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
				this.$nextTick(() => {
					this.createGraphic(); //创建画布
				});
			}
		},
	},
	data() {
		return {
			modalTitle: "数据集配置",
			submitData: {},
			splitValue: 0.2,
			graph: "",
			sourceList: [], //数据源集合
			treeData: [
				{ id: 1, title: "APS_BASE_INFO" },
				{ id: 2, title: "APS_LINE" },
				{ id: 3, title: "APS_PROCESS" },
				{ id: 4, title: "APS_BASE_INFO" },
				{ id: 5, title: "APS_LINE" },
				{ id: 6, title: "APS_PROCESS" },
				{ id: 7, title: "APS_BASE_INFO" },
				{ id: 8, title: "APS_PROCESS_DETAIL" },
				{ id: 9, title: "APS_PROCESS" },
				{ id: 10, title: "APS_BASE_INFO" },
				{ id: 11, title: "APS_LINE" },
				{ id: 12, title: "APS_PROCESS" },
				{ id: 13, title: "APS_BASE_INFO" },
				{ id: 14, title: "APS_LINE" },
				{ id: 15, title: "APS_PROCESS" },
				{ id: 16, title: "APS_BASE_INFO" },
				{ id: 17, title: "APS_LINE" },
				{ id: 18, title: "APS_PROCESS" },
				{ id: 19, title: "APS_BASE_INFO" },
				{ id: 20, title: "APS_PROCESS_DETAIL" },
				{ id: 21, title: "APS_PROCESS" },
				{ id: 22, title: "APS_BASE_INFO" },
				{ id: 23, title: "APS_LINE" },
				{ id: 24, title: "APS_PROCESS" },
			],
		};
	},
	methods: {
		//获取数据
		pageLoad() {},
		//提交
		submitClick() {},
		// 创建画布
		createGraphic() {
			const data = {
				nodes: [],
				edges: [],
				combos: [],
			};

			// 实例化画布
			const container = document.getElementById("table-box"); // 画布
			const width = container.scrollWidth;
			const height = container.scrollHeight;
			this.graph = new G6.Graph({
				container,
				width: width,
				height: height,
				plugins: [],
				modes: {
					default: ["drag-node", "click-select", "drag-canvas", "zoom-canvas", "brush-select", "create-edge"],
				},
				// 节点
				defaultNode: {
					style: {
						fill: "#fff",
						stroke: "#d3d3d3",
						lineWidth: 1,
						width: 200,
						height: 35,
					},
					// 文本内容设定样式
					labelCfg: {
						position: "center",
						offset: 10,
						style: {
							fill: "#000",
							fontSize: 16,
							fontWeight: "bold",
						},
					},
				},
				nodeStateStyles: {
					selected: {
						stroke: "#000",
						lineWidth: 1,
						fill: "#f5f5f5",
						shadowColor: "#fff",
					},
					hover: {
						stroke: "#000",
						lineWidth: 1,
						fill: "#f5f5f5",
					},
				},
				// 边
				defaultEdge: {
					type: "cubic-horizontal",
					style: {
						stroke: "#F6BD16",
						lineWidth: 2,
					},
				},
				fitView: true, //自适应画布
				fitCenter: true, // 画布居中
				// minZoom: 0, //最小缩放比例
			});
			// 渲染数据
			this.graph.data(data);
			this.graph.render();
			// 设置层级
			const canvas = this.graph.get("canvas");
			canvas.get("el").style.zIndex = 2;
			canvas.get("el").style.position = "absolute";
			// 创建右键弹窗
			this.getContextMenu();
			// 点击节点
			this.graph.on("node:click", (e) => {
				// const { item } = event
				// this.activation = item.getModel().id // 获取当前节点
				// this.form.inputText = item.getModel().label
				// console.log("event", e);
			});

			this.graph.on("node:mouseenter", (e) => {
				this.graph.setItemState(e.item, "active", true);
			});
			this.graph.on("node:mouseleave", (e) => {
				this.graph.setItemState(e.item, "active", false);
			});
			//创建边
			// this.graph.on("aftercreateedge", (e) => {
			// 	console.log("创建边", e);
			// });
			//边的双击事件
			this.graph.on("edge:dblclick", (e) => {
				const { source, target } = e.item.getModel();
				const obj = { source, target };
				console.log("边的双击事件", obj, e.item.getModel());
			});
		},

		// 添加节点
		addNodeImage(e, row) {
			console.log("添加节点", e);
			const point = this.graph.getPointByClient(e.x, e.y);
			this.graph.addItem("node", {
				id: row.id.toString(),
				label: row.title,
				nodeType: 0,
				x: point.x,
				y: point.y,
				type: "rect",
			});
		},
		// 右键--节点的删除
		getContextMenu() {
			const menu = new G6.Menu({
				getContent(evt) {
					const outDiv = document.createElement("div");
					outDiv.style.minWidth = "100px";
					outDiv.style.zIndex = 999;
					let htmlVal = ``;
					htmlVal += `<p data-name='delete' style="padding: 3px 0;cursor: pointer;"
              onmouseenter="this.style.backgroundColor = '#ccc'"
              onmouseleave="this.style.backgroundColor = '#fff'">删除</p>`;
					outDiv.innerHTML = htmlVal;
					return outDiv;
				},
				handleMenuClick: (target, item) => {
					const name = target.getAttribute("data-name");
					if (name === "delete") this.delNodes(item.getModel().id);
				},
				offsetX: 16 + 10,
				offsetY: 0,
				itemTypes: ["node", "edge"],
			});
			this.graph.addPlugin(menu);
		},
		// 删除节点
		delNodes(id) {
			this.$Modal.confirm({
				title: "确认删除该节点/边框吗?",
				onOk: () => {
					const item = this.graph.findById(id);
					this.graph.removeItem(item);
				},
			});
		},

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
			font-weight: bold;
			li {
				list-style: none;
				padding-bottom: 10px;
			}
			.icon {
				font-size: 22px;
				margin-right: 5px;
			}
		}
	}
	.right-box {
		height: 100%;
		#table-box {
			width: 100%;
			height: 100%;
		}
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
:deep(.right-pane) {
	margin-left: 15px;
}
:deep(.ivu-tree) {
	height: calc(100% - 135px);
}

:deep(.g6-component-contextmenu) {
	z-index: 999 !important;
}
</style>
