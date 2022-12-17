/*数据集配置 编辑 */
<template>
	<div style="height: 100%">
		<!-- 数据集 -->
		<Modal :title="modalTitle" :mask-closable="false" :closable="true" v-model="modalFlag" fullscreen :before-close="closeDialog">
			<template slot="header">
				<div class="ivu-modal-header-inner">
					{{ modalTitle }}
					<Input v-model="submitData.datasetName" :border="false" :placeholder="$t('pleaseEnter') + '数据集名称'" style="width: 150px" />
					<Input v-model="submitData.datasetCode" :border="false" :placeholder="$t('pleaseEnter') + '数据集编码'" style="width: 150px" />
				</div>
			</template>
			<div class="modal-content">
				<Split v-model="splitValue">
					<div slot="left" class="left-box">
						<Form ref="submitRef" :model="submitData">
							<label class="name-label">数据源：</label>
							<FormItem prop="sourceCode">
								<Select v-model.trim="submitData.sourceCode" size="small" placeholder="请选择数据源" @on-change="getTableList">
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
								<li v-for="(item, index) in filterData" :key="index" draggable @dragend="addNodeImage($event, item)" :title="item">
									<Icon custom="iconfont icon-biaodanzujian-biaoge" class="icon" />{{ item }}
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
		<DataSetConfigConnecttable ref="datasetconfigconnecttable" :modalFlag.sync="connectModalFlag" :connectObj="connectObj" @updateEdge="updateEdge" />
	</div>
</template>
<script>
import { getAllDatasourceReq } from "@/api/bill-design-manage/data-set.js";
import { addReq, modifyReq, getTableListReq } from "@/api/bill-design-manage/data-set-config.js";

import DataSetConfigConnecttable from "./data-set-config-connecttable.vue";
import G6 from "@antv/g6";
export default {
	name: "DataSetConfigAddEdit",
	components: { DataSetConfigConnecttable },
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
					// 判断画布是否存在
					this.graph === "" ? "" : this.graph.destroy();
					this.data = {
						nodes: [],
						edges: [],
						combos: [],
					};
					this.createGraphic();
				});
			}
		},
	},
	computed: {
		filterData() {
			const keyWord = this.submitData.filterTable;
			const reg = new RegExp(keyWord);
			const arr = [];
			this.treeData.forEach((item) => {
				if (reg.test(item)) {
					arr.push(item);
				}
			});
			return arr;
		},
	},
	data() {
		return {
			modalTitle: "数据集配置",
			connectModalFlag: false,
			connectObj: {}, //关联表
			submitData: {},
			splitValue: 0.2,
			graph: "",
			sourceList: [], //数据源集合
			treeData: [],
			data: {
				nodes: [],
				edges: [],
				combos: [],
			},
		};
	},
	methods: {
		//获取数据
		pageLoad() {},
		//获取表
		getTableList() {
			const obj = {
				sourceCode: this.submitData.sourceCode,
			};
			getTableListReq(obj).then((res) => {
				if (res.code === 200) {
					this.treeData = res?.result || [];
				} else {
					this.$Message.error("获取表失败", res.message);
				}
			});
		},

		//提交
		submitClick() {
			const { id, datasetName, datasetCode } = this.submitData;
			const obj = {
				id,
				datasetName,
				datasetCode,
				content: JSON.stringify(this.data),
			};
			const requestApi = this.isAdd ? addReq(obj) : modifyReq(obj);
			requestApi.then((res) => {
				if (res.code === 200) {
					this.$Message.success("提交成功！");
					this.$parent.pageLoad(); //刷新数据
					this.closeDialog(); //关闭弹框
				} else {
					this.$Message.error("提交异常", res.message);
				}
			});
		},
		// 创建画布
		createGraphic() {
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
						endArrow: true,
					},
				},
				fitView: true, //自适应画布
				fitCenter: true, // 画布居中
				// minZoom: 0, //最小缩放比例
			});
			// 渲染数据
			this.graph.data(this.data);
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
				this.edgeDblclick(e);
			});
		},
		//边双击
		edgeDblclick(e) {
			const { source, target } = e.item.getModel();
			const obj = { source, target };
			this.connectModalFlag = true;
			this.connectObj = { ...obj };
			console.log("边的双击事件", obj, e.item.getModel());
		},

		// 添加节点
		addNodeImage(e, row) {
			console.log("添加节点", e);
			const { sourceCode } = this.submitData;
			const point = this.graph.getPointByClient(e.x, e.y);
			this.graph.addItem("node", {
				id: `${sourceCode}:${row}`,
				label: row,
				nodeType: 0,
				x: point.x,
				y: point.y,
				type: "rect",
			});
		},
		//更新边
		updateEdge(val) {
			this.data.edges.forEach((element) => {
				const item = this.graph.findById(element.id);

				this.graph.updateItem(item, {
					attchInfo: val,
				});
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
			this.submitData = {};
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
				word-break: inherit;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
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
:deep(.ivu-modal-header-inner) {
	input {
		background: transparent;
		color: #fff;
		font-weight: bold;
		border: none;
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
