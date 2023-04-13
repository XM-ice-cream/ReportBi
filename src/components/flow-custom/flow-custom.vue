<template>
	<Modal class-name="page-style-modal flow-style-modal" v-model="modalFlag" fullscreen :mask="false" :mask-closable="false" :closable="false">
		<div class="flow-custom">
			<!--  导航条  -->
			<div class="flow-custom-bar">
				<tool-bar
					ref="toolBar"
					@handleDragEnd="handleDragEnd"
					@setMode="setMode"
					@on-delete="onDelete"
					@on-download="onDownload"
					@on-format-row="onFormatRow"
				/>
			</div>
			<!--  流程内容  -->
			<div class="flow-custom-content">
				<!--  流程画布  -->
				<div id="flow-custom" ref="container" class="flow-custom-content-main"></div>
				<!--  右侧详情  -->
				<div class="flow-custom-content-panel" :class="{ panelHeight: !showMiniMap }">
					<div class="panel">{{ infoTitle }}</div>
					<!--  点击画布展示  -->
					<div class="panel">
						<Checkbox v-model="showGrid" @on-change="changeGridState">显示网格</Checkbox>
						<Checkbox v-model="showMiniMap" @on-change="changeMiniMapState">显示缩略图</Checkbox>
					</div>
					<!--  点击画布展示  -->
					<div class="panel panel-content-style2">
						<Collapse v-model="panelName" class="page-style-collapse">
							<Panel v-for="(item, i) in nodeNameList" :key="i" :name="item.id">
								{{ item.label }}
								<p slot="content">
									<span v-for="(child, childIndex) in item.children" :key="childIndex" style="display: block">
										<i
											class="panel-content-node"
											:class="[item.iconClass, { added: child.isAdd }]"
											:title="child.label"
											draggable
											@dragend="handleDragEnd($event, child, i)"
										>
											{{ child.label }}
										</i>
									</span>
								</p>
							</Panel>
						</Collapse>
					</div>
				</div>
				<div id="mini-map"></div>
			</div>
			<AttrSet
				ref="attrSetRef"
				:selectElement="this.selectElement"
				:stationList="nameList"
				:nowStationList="nowStationList"
				:optList="{ id: list.id, name: list.name, graph: graph }"
				@node-attr-change="updateFlowData"
				@track-ok="updateFlowData"
			/>
		</div>
		<div slot="footer">
			<Button @click="modalCancel">{{ $t("cancel") }}</Button>
			<Button type="primary" @click="modalOk">{{ $t("submit") }}</Button>
		</div>
	</Modal>
</template>

<script>
import G6 from "@antv/g6";
import global from "./libs/global";
import { newGuid } from "./libs/utils";
import { localSave, localRead, localRemove } from "@/libs/utils";
import ToolBar from "./tool-bar";
import AttrSet from "./attr-set/attr-set.vue";
import _ from "lodash";
export default {
	name: "flow-custom",
	components: { ToolBar, AttrSet },
	props: {
		// 流程配置
		options: {
			type: Object,
			default: () => {
				return {
					name: "",
					localSaveName: "flowInitData",
					isSave: false,
					width: document.documentElement.clientWidth,
					height: document.documentElement.clientHeight,
					rowObj: {},
				};
			},
		},
		// 流程数据
		list: {
			type: Object,
			default: () => {},
		},
		// 站点数据
		nameList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			modalFlag: false,
			graph: null,
			grid: null,
			imageMinimap: null,
			toolBar: null,
			tooltip: null,
			panelWidth: 250,
			showGrid: true,
			showMiniMap: true,
			selectElement: null,
			model: null,
			edge: null,
			mode: "default",
			lineType: "line",
			infoTitle: "画布",
			panelName: "",
			initData: null,
			nodeNameList: [],
			nowStationList: [],
			selectNodeList: [],
			deleteProcessIdList: [],
			contextMenuList: [
				{ types: ["node", "edge"], name: "delete" },
				{ types: ["node", "edge"], name: "attrSet" },
			],
		};
	},
	watch: {
		modalFlag(newVal) {
			if (newVal) {
				this.deleteProcessIdList = [];
				this.initData = this.list || {};
				this.nodeNameList = [...this.nameList];
				this.panelName = this.nodeNameList.length ? this.nodeNameList[0].id : "";
				this.initNodeData();
				this.init();
				this.$refs.toolBar.setMode("default");
			}
		},
	},
	methods: {
		// 初始化流程
		init() {
			let width = this.options.width - this.panelWidth;
			let height = this.options.height - 30;
			// 创建画布
			this.graph = new G6.Graph({
				container: "flow-custom",
				width,
				height,
				...global,
			});
			// 全局点击事件
			this.graph.on("click", (e) => {
				if (e.item) {
					const clickNodes = this.graph.findAllByState("node", "click");
					clickNodes.forEach((cn) => {
						this.graph.clearItemStates(cn, "click");
					});
					const clickEdges = this.graph.findAllByState("edge", "click");
					clickEdges.forEach((ce) => {
						this.graph.clearItemStates(ce, "click");
					});
					const item = e.item;
					this.graph.setItemState(item, "click", true);
					this.selectElement = item;
					this.model = item.getModel();
				}
			});
			this.graph.on("mousemove", (e) => {
				if (this.mode === "addEdge" && this.edge) {
					const point = { x: e.x, y: e.y };
					this.graph.updateItem(this.edge, {
						target: point,
					});
				}
			});
			this.graph.on("mouseup", (e) => {
				if (this.mode === "addEdge" && this.edge) {
					const point = { x: e.x, y: e.y };
					const {
						_cfg: { model, type },
					} = e.item;
					const edgeModel = this.edge.getModel();
					if (type === "node" && edgeModel.source !== model.id) {
						const edgeY = edgeModel.startPoint.y - edgeModel.endPoint.y;
						const edgeX = edgeModel.startPoint.x - edgeModel.endPoint.x;
						const lineType = Math.abs(edgeY) <= 5 || Math.abs(edgeX) <= 5;
						this.graph.updateItem(this.edge, {
							type: lineType ? "line" : "polyline",
							target: model.id,
							targetAnchor: this.getNodeLinkPoint(model, point),
						});
						this.localSaveFlowData();
						this.updateMiniImgUrl();
					} else {
						this.graph.removeItem(this.edge);
					}
					this.edge = null;
				}
			});

			//监听节点事件
			this.graph.on("node:mouseenter", (e) => {
				const item = e.item; // 获取鼠标进入的节点元素对象
				this.graph.setItemState(item, "hover", true);
				if (this.mode === "addEdge") this.setNodeLinkPoint(item, true);
				else this.setNodeLinkPoint(item);
			});
			this.graph.on("node:mouseleave", (e) => {
				const item = e.item;
				this.graph.setItemState(item, "hover", false);
				this.setNodeLinkPoint(item);
			});
			this.graph.on("node:mousedown", (e) => {
				if (this.mode === "addEdge" && this.edge === null) {
					const point = { x: e.x, y: e.y };
					const model = e.item.getModel();
					this.edge = this.graph.addItem("edge", {
						id: newGuid(),
						source: model.id,
						sourceAnchor: this.getNodeLinkPoint(model, point),
						target: point,
					});
				}
			});
			this.graph.on("nodeselectchange", (e) => {
				if (e.select) {
					this.selectNodeList = e.selectedItems.nodes;
					this.selectNodeList.forEach((cn) => {
						this.graph.setItemState(cn, "select", true);
					});
				} else {
					this.selectNodeList.forEach((cn) => {
						this.graph.clearItemStates(cn, "select");
					});
					this.selectNodeList = [];
				}
			});

			//监听边事件
			this.graph.on("edge:mouseenter", (e) => {
				const item = e.item; // 获取鼠标进入的节点元素对象
				this.graph.setItemState(item, "hover", true);
			});
			this.graph.on("edge:mouseleave", (e) => {
				const item = e.item;
				this.graph.setItemState(item, "hover", false);
			});
			this.graph.read(this.initData);
			// 创建网格
			this.changeGridState(true);
			// 创建缩略图
			this.changeMiniMapState(true);
			// 创建Tooltip
			this.getTooltipCom();
			// 创建右键弹窗
			this.getContextMenu();
		},
		// 是否展示网格
		changeGridState(val) {
			if (val) {
				this.grid = new G6.Grid(); // 创建网格
				this.graph.addPlugin(this.grid);
			} else this.graph.removePlugin(this.grid);
		},
		// 是否展示缩略图
		changeMiniMapState(val) {
			if (val) {
				this.imageMinimap = new G6.ImageMinimap({
					container: "mini-map",
					width: this.panelWidth,
					graphImg: "",
				}); // 创建缩略图
				this.graph.addPlugin(this.imageMinimap);
				this.updateMiniImgUrl();
			} else this.graph.removePlugin(this.imageMinimap);
		},
		// 更新缩略图图片
		updateMiniImgUrl() {
			this.graph.toFullDataURL(
				(res) => {
					this.imageMinimap.updateGraphImg(res);
				},
				"image/webp",
				{ padding: 3, backgroundColor: "#fff" }
			);
		},
		// Tooltip展示
		getTooltipCom() {
			if (this.tooltip) this.graph.removePlugin(this.tooltip);
			this.tooltip = new G6.Tooltip({
				className: "tooltip-style",
				// 允许出现 tooltip 的 item 类型
				itemTypes: ["node", "edge"],
				// 自定义 tooltip 内容
				getContent: (e) => {
					return e.item.getModel().label;
				},
				// 是否展示 tooltip 内容
				shouldBegin: (e) => {
					return e.item.getModel().label !== undefined;
				},
			}); // ToolBar展示
			this.graph.addPlugin(this.tooltip);
		},
		// 右键弹窗是否展示
		getContextMenu() {
			const menu = new G6.Menu({
				itemTypes: ["node", "edge"],
				getContent: (evt) => {
					const outDiv = document.createElement("div");
					outDiv.style.minWidth = "100px";
					let htmlVal = ``;
					this.contextMenuList.forEach((o) => {
						if (o.types.includes(evt.item._cfg.type)) {
							htmlVal += `<p data-name="${o.name}" style="padding: 3px 0;cursor: pointer;"
              onmouseenter="this.style.backgroundColor = '#ccc'"
              onmouseleave="this.style.backgroundColor = '#fff'">${this.$t(o.name)}</p>`;
						}
					});
					outDiv.innerHTML = htmlVal;
					return outDiv;
				},
				handleMenuClick: (target, item) => {
					if (item._cfg.type === "node" && !(item.getModel().nodeType === "flowNode" && this.mode === "default")) return;
					this.selectElement = item;
					this.model = item.getModel();
					const name = target.getAttribute("data-name");
					if (name === "delete") this.onDelete();
					if (name === "attrSet") {
						this.nowStationList = this.graph.save().nodes.filter((o) => o.labelId !== "start" && o.labelId !== "end");
						this.$refs.attrSetRef.modalFlag = true;
					}
				},
			});
			this.graph.addPlugin(menu);
		},
		// 设置节点上链接锚点是否显示 model节点位置 point鼠标所在位置
		getNodeLinkPoint(model, point) {
			let edgePoint = null;
			const sizeX = model.size[0] / 4,
				pointX = model.x - point.x,
				pointY = model.y - point.y;
			if (Math.abs(pointX) > sizeX) {
				if (pointX > 0) edgePoint = 3;
				else edgePoint = 1;
			} else {
				if (pointY > 0) edgePoint = 0;
				else edgePoint = 2;
			}
			return edgePoint;
		},
		// 设置节点上链接锚点是否显示
		setNodeLinkPoint(item, status = false) {
			let {
				_cfg: { model },
			} = item;
			model.linkPoints.top = status;
			model.linkPoints.right = status;
			model.linkPoints.bottom = status;
			model.linkPoints.left = status;
			if (!model.type) model.type = "rect";
			this.graph.updateItem(item, model);
			this.localSaveFlowData();
		},
		// 添加节点和站点的对应位置，用以展示添加过多少站点
		initNodeData() {
			for (let [i, item] of this.nodeNameList.entries()) {
				for (let [n, child] of item.children.entries()) {
					this.initData.nodes.forEach((o) => {
						if (child.id === o.labelId) o.num = [i, n];
					});
				}
			}
		},
		// 添加节点，拖拽结束
		handleDragEnd(e, item, num = null) {
			if (item.isAdd) return false;
			const point = this.graph.getPointByClient(e.x, e.y);
			const labelLen = item.label.length > 15 ? (item.label.length - 15) * 8 : 0;
			let model = {
				id: newGuid(),
				type: item.type,
				nodeType: item.nodeType,
				labelId: item.id,
				label: item.label,
				processType: item.processType,
				size: [100 + labelLen, 24],
				num: [num, item.num], //站点在数组中的位置 param1: 第几个分组 param2: 第几个站点
				flowMain: true,
				necessary: true,
				manual: false,
				split: false,
				allowRePass: false,
				isAllowedInDryBox: false,
				enableRecipients: false,
				allowMulitWorkOrder: false,
				forBidSkipIn: false,
				forBidSkipOut: false,
				isAdd: false,
				repassDefectType: "",
				FAICount: 0,
				delayDefectTriggerProcessId: "",
				eqpIds: [],
				trackInMethods: ["UserCheckAsync", "BarCodeCheckAsync", "WorkOrderCheckAsync", "WorkFlowCheckAsync"], // 进站
				collectDataMethods: [], // 收值
				trackOutMethods: ["SaveDefectInfoAsync"], // 出站
				x: point.x,
				y: point.y,
				style: {
					fill: "#ed4014",
					fillOpacity: 0.5,
					stroke: "#ed4014",
					radius: 6,
					cursor: "pointer",
					lineWidth: 1,
				},
			};
			let { nodes } = this.graph.save();
			if (item.nodeType !== "flowNode") {
				let nodeItem = nodes.find((o) => o.nodeType === item.nodeType);
				if (nodeItem) return this.$Msg.error(item.nodeType === "startNode" ? "只能由一个开始节点" : "只能由一个结束节点");
				else {
					model.size = [30, 24];
				}
			}
			this.graph.addItem("node", model);
			_.remove(this.deleteProcessIdList, (item) => item === model.labelId);
			if (num !== null) {
				this.nodeNameList[model.num[0]].children[model.num[1]].isAdd = true;
			}
			this.localSaveFlowData();
			this.updateMiniImgUrl();
		},
		// 设置模式
		setMode(val) {
			this.graph.setMode(val);
			this.mode = val;
			if (val !== "brush" && this.selectNodeList.length) {
				this.selectNodeList.forEach((o) => {
					this.graph.clearItemStates(o, "select");
				});
				this.selectNodeList = [];
			}
		},
		// 格式化排列
		onFormatRow() {
			if (this.selectNodeList.length) {
				const yList = this.selectNodeList.map((o) => o.getModel().y);
				const xList = this.selectNodeList.map((o) => o.getModel().x);
				const yDiff = Math.max(...yList) - Math.min(...yList);
				const xDiff = Math.max(...xList) - Math.min(...xList);
				const diffVal = yDiff - xDiff;
				if (Math.abs(diffVal) > 50) {
					let total = 0;
					if (diffVal > 0) total = xList.reduce((prev, cur) => prev + cur, 0) / xList.length;
					else total = yList.reduce((prev, cur) => prev + cur, 0) / yList.length;
					this.selectNodeList.forEach(async (o) => {
						const model = o.getModel();
						diffVal > 0 ? (model.x = total) : (model.y = total);
						await this.graph.updateItem(o, model);
					});
					this.graph.refreshPositions();
					this.localSaveFlowData();
					this.updateMiniImgUrl();
				}
			} else this.$Msg.error("请选择节点");
		},
		// 导出图片
		onDownload() {
			this.graph.downloadImage(`${this.options.name}`, "image/png", "#fff");
		},
		// 删除节点
		onDelete() {
			if (this.selectElement) {
				if (this.model.nodeType === "flowNode" && this.model.num) {
					this.nodeNameList[this.model.num[0]].children[this.model.num[1]].isAdd = false;
					this.deleteProcessIdList.push(this.model.labelId);
				}
				this.graph.removeItem(this.selectElement);
				this.updateMiniImgUrl();
				this.selectElement = null;
				this.model = null;
				this.localSaveFlowData();
				this.$Msg.success("删除成功");
			} else this.$Msg.warning("请选择要删除的节点");
		},
		// 当前流程节点数据更新
		updateFlowData(model) {
			this.graph.updateItem(this.selectElement, model);
			this.updateMiniImgUrl();
			this.localSaveFlowData();
			this.$Msg.success(`${this.$t("save")}${this.$t("successTips")}`);
		},
		// 判断是否有多个子级主流程 true有 false没有
		isMoreChildMainFlow(edges, nodes) {
			for (let item of edges) {
				const list = edges.filter((o) => o.source === item.source);
				if (list.length > 1) {
					const listIds = list.map((o) => o.target);
					const val = nodes.filter((o) => listIds.includes(o.id) && o.flowMain).length > 1;
					if (val) return true;
				}
			}
			return false;
		},
		// 点击弹窗确定按钮触发
		modalOk() {
			const { nodes, edges } = this.graph.save();
			const startEndLength = nodes.filter((o) => o.nodeType !== "flowNode").length;
			if (startEndLength !== 2) return this.$Msg.error("流程图必须包含开始和结束两个节点！");
			const flowNodes = nodes.filter((o) => o.nodeType === "flowNode");
			if (flowNodes.length > 2 && this.isMoreChildMainFlow(edges, nodes)) return this.$Msg.error("不允许有多个子级同为主流程");
			this.$emit("on-flow-change", this.graph.save());
			this.clearGraphData();
		},
		// 点击弹窗取消按钮触发
		modalCancel() {
			if (this.options.isSave && localRead(this.options.localSaveName)) {
				this.$Modal.confirm({
					title: "是否清除历史流程数据?",
					onOk: () => {
						localRemove(this.options.localSaveName);
						this.clearGraphData();
					},
					onCancel: () => this.clearGraphData(),
				});
			} else this.clearGraphData();
		},
		// 本地缓存新增流程数据
		clearGraphData() {
			this.graph.clear();
			this.graph.destroy();
			this.modalFlag = false;
		},
		// 本地缓存新增流程数据
		localSaveFlowData() {
			if (this.options.isSave) localSave(this.options.localSaveName, this.graph.save());
		},
	},
};
</script>

<style scoped lang="less">
@panelWidth: 250px;
@color1: #5aaf72;
@color2: #cccccc;
@color3: #999;
.flow-custom {
	position: relative;
	z-index: 4000;
	width: 100%;
	height: 100%;
	line-height: 1;

	&-bar {
		display: flex;
		justify-content: flex-start;
		height: 30px;
		border-bottom: 1px solid @color2;
	}

	#flow-tool-bar {
		position: relative;
		width: 300px;
		height: 100%;
		border-left: 1px solid @color3;
	}

	&-content {
		position: relative;
		width: 100%;
		height: calc(100% - 30px);

		&-main {
			position: absolute;
			left: 0;
			top: 0;
			width: calc(100% - @panelWidth);
			height: 100%;
			overflow: auto;
		}

		&-panel {
			position: absolute;
			right: 0;
			top: 0;
			width: @panelWidth;
			height: calc(100% - 100px);
			background-color: #f7f9fb;
			border-left: 1px solid #e6e9ed;
			border-bottom: 1px solid #e6e9ed;

			&.panelHeight {
				height: 100%;
			}

			.panel {
				padding: 3px;
				border-bottom: 1px solid #e6e9ed;

				&:last-child {
					border-bottom: none;
				}
			}

			.panel-content-style {
				height: calc(100% - 19px);
				overflow-y: auto;
			}

			.panel-content-style2 {
				height: calc(100% - 42px);
				overflow-y: auto;

				.panel-content-node {
					display: inline-block;
					line-height: normal;
					font-size: 12px;
					padding: 3px;
					margin: 2px;
					border: 1px solid #f7f7f7;
					border-radius: 5px;
					cursor: move;

					&:hover {
						border-color: @color1;
						color: @color1;
					}

					&.added {
						border-color: @color2;
						color: @color2;
						cursor: not-allowed;
					}
				}
			}
		}

		#mini-map {
			position: absolute;
			right: 0;
			bottom: 0;
			width: @panelWidth;
			height: 100px;
		}

		&:after {
			content: "";
			display: block;
			clear: both;
		}
	}
}
</style>
