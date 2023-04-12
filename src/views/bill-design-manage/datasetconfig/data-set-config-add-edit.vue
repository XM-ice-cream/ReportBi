/*数据集配置 编辑 */
<template>
	<div>
		<!-- 数据集 -->
		<Modal :title="modalTitle" :mask-closable="false" :closable="true" v-model="modalFlag" fullscreen :before-close="closeDialog">
			<template slot="header">
				<div class="ivu-modal-header-inner">
					{{ modalTitle }}
				</div>
			</template>
			<div class="modal-content">
				<Split v-model="splitValue">
					<div slot="left" class="left-box">
						<div class="left-top">
							<div class="left-title">基础信息</div>
							<Form ref="submitRef" :model="submitData" :label-width="90" :rules="rulesValidate">
								<FormItem label="数据集名称" prop="datasetName">
									<Input v-model="submitData.datasetName" :placeholder="$t('pleaseEnter') + '数据集名称'" />
								</FormItem>
								<FormItem label="数据集编码" prop="datasetCode">
									<Input v-model="submitData.datasetCode" :placeholder="$t('pleaseEnter') + '数据集编码'" />
								</FormItem>
								<!-- 是否有效 -->
								<FormItem :label="$t('enabled')" prop="enabled">
									<i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
										<span slot="open">{{ $t("open") }}</span>
										<span slot="close">{{ $t("close") }}</span>
									</i-switch>
								</FormItem>
							</Form>
						</div>
						<Form ref="submitRef" :model="submitData" :label-width="60">
							<!-- 数据源 -->
							<FormItem label="数据源" prop="sourceCode">
								<Select v-model.trim="submitData.sourceCode" size="small" placeholder="请选择数据源" @on-change="getUserList" clearable>
									<Option v-for="item in sourceList" :key="item.sourceName" :label="item.sourceName" :value="item.sourceCode" />
								</Select>
							</FormItem>
							<!-- 架构 -->
							<FormItem label="架构" prop="user">
								<Select v-model.trim="submitData.user" filterable size="small" placeholder="请选择用户" @on-change="getTableList" clearable>
									<Option v-for="item in userList" :key="item" :label="item" :value="item" />
								</Select>
							</FormItem>
							<!-- 筛选表名称 -->
							<Input
								v-model="submitData.filterTable"
								suffix="ios-search"
								placeholder="筛选表名称"
								clearable
								@keyup.native="filterData"
								style="margin-top: 10px"
							/>
						</Form>
						<!-- 树 -->
						<div class="left-tree">
							<ul>
								<li v-for="(item, index) in filterList" :key="index" draggable @dragend="addNodeImage($event, item)" :title="item">
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
		<TableFilter ref="tablefilter" :modalFlag.sync="filterModalFlag" :selectObj="filterObj" @updateFilter="updateFilter" />
	</div>
</template>
<script>
import { getAllDatasourceReq } from "@/api/bill-design-manage/data-set.js";
import { addReq, modifyReq, getTableListReq, getUsersReq } from "@/api/bill-design-manage/data-set-config.js";

import DataSetConfigConnecttable from "./data-set-config-connecttable.vue";
import G6 from "@antv/g6";
import TableFilter from "./table-filter.vue";

export default {
	name: "DataSetConfigAddEdit",
	components: { DataSetConfigConnecttable, TableFilter },
	props: {
		modalFlag: {
			required: true,
			type: Boolean,
			default: false,
		},
		isAdd: {
			type: Boolean,
			default: true,
		},
	},
	watch: {
		modalFlag(newVal) {
			if (newVal) {
				this.getDataSourceList(); //获取数据源
			} else {
				this.submitData = { datasetName: "", datasetCode: "", sourceCode: "", filterTable: "", enabled: 1, content: "", user: "" };
				this.filterList = [];
			}
		},
	},
	computed: {},
	data() {
		return {
			modalTitle: "数据集配置",
			connectModalFlag: false,
			filterModalFlag: false,
			connectObj: {}, //关联表
			filterObj: {}, //过滤表
			submitData: { datasetName: "", datasetCode: "", sourceCode: "", filterTable: "", enabled: 1, content: "", user: "" },
			filterList: [], //过滤后的值
			userList: [], //数据源对应所有用户
			splitValue: 0.2,
			graph: "",
			sourceList: [], //数据源集合
			treeData: [],
			data: {
				nodes: [],
				edges: [],
				combos: [],
			},
			rulesValidate: {
				datasetName: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}数据集名称`,
					},
				],
				datasetCode: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}数据集编码`,
					},
				],
			},
		};
	},
	methods: {
		//获取数据
		pageLoad(val) {
			//// 隐式深拷贝，主要实现深拷贝，解除循环引用
			if (JSON.stringify(val) !== "{}") {
				this.data = { ...JSON.parse(val.content) };
				this.submitData = { ...val };
				this.submitData.sourceCode = val.sourceCode?.split(",")[0] || "";
				this.$nextTick(() => {
					this.getUserList(); //获取数据源对应用户
				});
			}

			this.$nextTick(() => {
				this.createGraphic();
			});
		},
		//获取用户
		getUserList() {
			const obj = {
				sourceCode: this.submitData.sourceCode,
			};
			if (obj.sourceCode) {
				getUsersReq(obj).then((res) => {
					if (res.code === 200) {
						this.userList = res?.result || [];
						this.treeData = [];
						this.submitData.user = "";
						this.filterData(); //过滤值
					} else {
						this.$Message.error(`获取用户失败, ${res.message}`);
					}
				});
			}
		},
		//获取表
		getTableList() {
			const { sourceCode, user } = this.submitData;
			const obj = {
				sourceCode: sourceCode,
				user: user,
			};
			if (obj.sourceCode && obj.user) {
				getTableListReq(obj).then((res) => {
					if (res.code === 200) {
						this.treeData = res?.result || [];
						this.submitData.filterTable = ""; //清空搜索栏数据
						this.filterData(); //过滤值
					} else {
						this.$Message.error(`获取表失败, ${res.message}`);
					}
				});
			}
		},

		//提交
		async submitClick() {
			let connectEdge = false;
			await this.getLevel(); //节点层级
			const depth0 = this.data.nodes.filter((item) => item.depth === 0);
			if (depth0.length > 1) {
				this.$Message.error("根节点有且只有一个，请确认！");
				return;
			}
			const { id, datasetName, datasetCode, enabled, user } = this.submitData;
			const sourceList = this.data.nodes.map((item) => item.id.split(":")[0]);
			this.data.edges = this.data.edges.map((item) => {
				if (!item.style || item.style.stroke === "#fb5531") {
					connectEdge = true;
				}
				const { id, type, relations, source, target, startPoint, style, incidenceRelation } = item;
				return { id, type, relations, source, target, startPoint, style, incidenceRelation };
			});
			if (connectEdge) {
				this.$Message.error("请关联每个数据集之间的关系，谢谢！");
				return;
			}
			const obj = {
				id,
				user,
				datasetName,
				datasetCode,
				content: JSON.stringify(this.data),
				sourceCode: Array.from(new Set(sourceList)).toString(),
				enabled,
			};

			this.$refs.submitRef.validate((validate) => {
				if (validate) {
					const requestApi = this.isAdd ? addReq(obj) : modifyReq(obj);
					requestApi.then((res) => {
						if (res.code === 200) {
							this.$Message.success("提交成功！");
							this.$parent.pageLoad(); //刷新数据
							this.closeDialog(); //关闭弹框
						} else {
							this.$Message.error(`提交异常, ${res.message}`);
						}
					});
				}
			});
		},
		//获取二叉树层级
		async getLevel() {
			let depth = 0;
			let { nodes, edges } = this.data;
			const edge = edges.map((item) => item.target);
			await nodes.forEach((item) => {
				if (!edge.includes(item.id)) {
					depth = 0;
					// 获取根节点
					item.depth = depth;
					let chilArr = [];
					chilArr.push(item.id);
					// 寻找子节点
					while (chilArr.length > 0) {
						depth++;
						let chilArrTmp = [];
						edges.forEach((x) => {
							if (chilArr.includes(x.source)) {
								chilArrTmp.push(x.target);
								nodes.forEach((y, yIndex) => {
									if (y.id == x.target) {
										nodes[yIndex].depth = depth;
									}
								});
							}
						});
						chilArr = chilArrTmp;
					}
				}
			});
		},
		filterData() {
			const keyWord = this.submitData.filterTable?.toUpperCase() || "";
			const reg = new RegExp(keyWord);
			const arr = [];
			this.treeData.forEach((item) => {
				if (reg.test(item)) {
					arr.push(item);
				}
			});
			this.filterList = arr;
		},

		// 创建画布
		createGraphic() {
			// 实例化画布
			const container = document.getElementById("table-box"); // 画布
			const width = container.scrollWidth;
			const height = container.scrollHeight;
			this.graph = new G6.Graph({
				container: "table-box",
				width: width,
				height: height,
				plugins: [],
				modes: {
					default: [
						"drag-node",
						"click-select",
						"drag-canvas",
						"zoom-canvas",
						"brush-select",
						{
							type: "create-edge",
							// shouldEnd【v4.3.8 后支持】
							shouldEnd: (e, self) => {
								if (e.item) {
									const { id } = e.item.getModel();
									const targetEdges = this.data.edges.filter((item) => {
										return item.target === id;
									});
									if (targetEdges.length >= 1) {
										this.$Message.error("禁止多对一连接！");
										return false;
									}
								}
								return true;
							},
						},
					],
				},
				// 节点
				defaultNode: {
					style: {
						fill: "#fff",
						stroke: "#d3d3d3",
						lineWidth: 1,
						width: 300,
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
					type: "custom-quadratic",
					style: {
						// stroke: "#F6BD16",
						stroke: "#fb5531",
						lineWidth: 2,
						endArrow: true,
						lineDash: [1, 1],
					},
				},
				// fitView: true, //自适应画布
				fitCenter: true, // 画布居中
				// minZoom: 0, //最小缩放比例
			});
			// 渲染数据
			this.graph.data(this.data);
			this.graph.render();
			this.graph.refresh(); //刷新
			this.graph.layout(true); //数据变更后，重新布局，刷新视图
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
			});

			this.graph.on("node:mouseenter", (e) => {
				this.graph.setItemState(e.item, "active", true);
			});
			this.graph.on("node:mouseleave", (e) => {
				this.graph.setItemState(e.item, "active", false);
			});
			//创建边
			this.graph.on("aftercreateedge", (e) => {
				if (e.edge.getModel()) {
					const { id, target, source } = e.edge.getModel();
					this.data.edges.push({ id, target, source });
					this.graph.changeData(this.data);
					this.edgeDblclick(e.edge.getModel());
				}
			});
			//边的双击事件
			this.graph.on("edge:dblclick", (e) => {
				this.edgeDblclick(e.item.getModel());
			});
		},
		//边双击
		edgeDblclick(model) {
			const { id, type, relations, source, target, startPoint, style, incidenceRelation } = model;
			let obj = { id, type, relations, source, target, startPoint, style, incidenceRelation };
			obj.incidenceRelation = obj?.incidenceRelation || "left join";
			this.connectModalFlag = true;
			this.connectObj = { ...obj };
		},

		// 添加节点
		addNodeImage(e, row) {
			const isExistTable = this.data.nodes
				.map((item) => item.label)
				.filter((item) => {
					return item?.split("(")[0] === row;
				});
			const label = isExistTable.length === 0 ? row : `${row}(${isExistTable.length})`;
			const { sourceCode } = this.submitData;
			const point = this.graph.getPointByClient(e.x, e.y); //将屏幕坐标转换为渲染坐标
			const model = {
				id: `${sourceCode}:${row}:${isExistTable.length}`,
				label: `${label}`,
				nodeType: 0,
				x: point.x,
				y: point.y,
				type: "rect",
			};
			this.data.nodes.push({ ...model });
			this.graph.changeData(this.data);
		},
		//更新边
		updateEdge(val) {
			val.style.lineDash = [];
			val.style.stroke = "#cacaca";
			const isNodesId = this.data.edges.map((item) => item.id).includes(val.id);
			if (isNodesId) {
				this.data.edges.forEach((item, index) => {
					if (item.id === val.id) {
						this.data.edges[index] = JSON.parse(JSON.stringify({ ...val }));
					}
				});
			} else {
				this.data.edges.push({ ...val });
			}
			this.graph.changeData(this.data);
		},
		//更新节点
		updateFilter(val) {
			const index = this.data.nodes.findIndex((item) => item.id === val.id);
			this.data.nodes[index].condition = [...val.condition];
			this.graph.changeData(this.data);
		},
		// 右键--节点的删除
		getContextMenu() {
			const menu = new G6.Menu({
				getContent(evt) {
					const outDiv = document.createElement("div");
					outDiv.style.minWidth = "100px";
					outDiv.style.zIndex = 999;
					let htmlVal = ``;
					// 对于表的筛选
					htmlVal += `<p data-name='filter' style="padding: 3px 10px;cursor: pointer;"
              onmouseenter="this.style.backgroundColor = '#27ce88';this.style.color = '#fff';"
              onmouseleave="this.style.backgroundColor = '#fff';this.style.color = '#515a6e'">筛选</p>`;

					// 删除
					htmlVal += `<p data-name='delete' style="padding: 3px 10px;cursor: pointer;"
              onmouseenter="this.style.backgroundColor = '#e95050';this.style.color = '#fff';"
              onmouseleave="this.style.backgroundColor = '#fff';this.style.color = '#515a6e'">删除</p>`;

					outDiv.innerHTML = htmlVal;
					return outDiv;
				},
				handleMenuClick: (target, item) => {
					const name = target.getAttribute("data-name");
					if (name === "delete") this.delNodes(item.getModel().id);
					if (name === "filter") this.filterNodes(item.getModel());
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
					const { id: itemid, type, edges } = item._cfg;
					//删除边
					if (type === "edge") {
						this.data.edges = this.data.edges.filter((item) => !itemid.includes(item.id));
					} else {
						const nodeId = itemid;
						const edgeId = edges.map((item) => item._cfg.id);
						this.data.edges = this.data.edges.filter((item) => !edgeId.includes(item.id));
						this.data.nodes = this.data.nodes.filter((item) => item.id !== nodeId);
					}

					this.graph.changeData(this.data);
				},
			});
		},
		//节点 过滤器筛选
		filterNodes(model) {
			const { id, condition, label } = model;
			let obj = { id, condition, label };
			this.filterModalFlag = true;
			this.filterObj = { ...obj };
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
			this.$refs.submitRef.resetFields();
			this.$emit("update:modalFlag", false);
			// this.submitData = { ...this.submitData, sourceCode: "", filterTable: "" };
			this.treeData = [];
			// 判断画布是否存在
			this.graph === "" ? "" : this.graph.destroy();
			this.data = {
				nodes: [],
				edges: [],
				combos: [],
			};
			this.createGraphic();
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
		.left-top {
			background: #f2f2f2;
			padding: 10px;
			/* border: 1px solid #78ce780f; */
			margin-bottom: 10px;
			border-radius: 5px;
			.left-title {
				padding: 5px;
				margin-bottom: 10px;
				font-weight: bold;
				border-bottom: 2px solid #fff;
			}
		}

		.name-label {
			margin: 5px 0;
			display: inline-block;
			font-weight: bold;
		}
		.left-tree {
			height: calc(100% - 320px);
			padding: 10px;
			overflow-y: auto;
			font-weight: bold;
			margin-top: 10px;
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
	form {
		display: inline-block;
		input {
			background: transparent;
			color: #fff;
			font-weight: bold;
			border: none;
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
	background-color: #fff;
}
:deep(.left-pane) {
	background: #fff;
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
:deep(.ivu-modal-fullscreen .ivu-modal-body) {
	bottom: 35px;
}
</style>
